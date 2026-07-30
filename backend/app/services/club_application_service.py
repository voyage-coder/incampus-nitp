from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError

from app.models.club_application import (
    ClubApplication,
    ApplicationStatus,
)
from app.models.membership import (
    Membership,
    MembershipRole,
)
from app.models.recruitment_drive import (
    RecruitmentDrive,
    RecruitmentStatus,
)
from app.models.user import User
from app.notifications.enums import NotificationType
from app.notifications.service import create_notification, notify_club_presidents


def apply_for_recruitment(
    db: Session,
    recruitment_id: UUID,
    current_user: User,
):
        recruitment = (
            db.query(RecruitmentDrive)
            .filter(
                RecruitmentDrive.id == recruitment_id
            )
            .first()
        )

        if recruitment is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recruitment drive not found.",
            )
        if recruitment.status != RecruitmentStatus.OPEN:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Recruitment is not open.",
            )

        now = datetime.now(timezone.utc)

        if now < recruitment.application_start:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Applications have not started yet.",
            )

        if now > recruitment.application_end:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Applications are closed.",
            )

        membership = (
            db.query(Membership)
            .filter(
                Membership.user_id == current_user.id,
                Membership.club_id == recruitment.club_id,
            )
            .first()
        )

        if membership:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="You are already a member of this club.",
            )

        existing = (
            db.query(ClubApplication)
            .filter(
                ClubApplication.user_id == current_user.id,
                ClubApplication.recruitment_drive_id == recruitment.id,
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="You have already applied.",
            )

        application = ClubApplication(
            user_id=current_user.id,
            club_id=recruitment.club_id,
            recruitment_drive_id=recruitment.id,
            status=ApplicationStatus.PENDING,
        )

        db.add(application)
        notify_club_presidents(
            db,
            club_id=recruitment.club_id,
            title="New club application",
            message=f"{current_user.full_name} applied for “{recruitment.title}”.",
            type=NotificationType.APPLICATION_RECEIVED,
            link=f"/app/clubs/{recruitment.club_id}",
        )
        try:
            db.commit()
        except SQLAlchemyError:
            db.rollback()
            raise
        db.refresh(application)

        return application

def get_recruitment_applications(
    db: Session,
    recruitment_id: UUID,
):
    recruitment = (
        db.query(RecruitmentDrive)
        .filter(
            RecruitmentDrive.id == recruitment_id
        )
        .first()
    )

    if recruitment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recruitment drive not found.",
        )

    return (
        db.query(ClubApplication)
        .options(joinedload(ClubApplication.user))
        .filter(
            ClubApplication.recruitment_drive_id == recruitment_id
        )
        .all()
    )


def get_application(
    db: Session,
    application_id: UUID,
):
    application = (
        db.query(ClubApplication)
        .options(joinedload(ClubApplication.user))
        .filter(
            ClubApplication.id == application_id
        )
        .first()
    )

    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found.",
        )

    return application



def approve_application(
    db: Session,
    application_id: UUID,
):
    application = get_application(
        db,
        application_id,
    )

    if application.status != ApplicationStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Application has already been processed.",
        )

    existing_membership = (
        db.query(Membership)
        .filter(
            Membership.user_id == application.user_id,
            Membership.club_id == application.club_id,
        )
        .first()
    )

    if existing_membership:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User is already a member of this club.",
        )

    try:
        application.status = ApplicationStatus.APPROVED

        membership = Membership(
            user_id=application.user_id,
            club_id=application.club_id,
            role=MembershipRole.MEMBER,
        )

        db.add(membership)

        create_notification(
            db,
            user_id=application.user_id,
            title="Application approved",
            message="Your club application was approved. Welcome aboard!",
            type=NotificationType.APPLICATION_APPROVED,
            link=f"/app/clubs/{application.club_id}",
        )

        db.commit()

        db.refresh(application)
        db.refresh(membership)

    except SQLAlchemyError:
        db.rollback()
        raise

    return application



def reject_application(
    db: Session,
    application_id: UUID,
):
    application = get_application(
        db,
        application_id,
    )

    if application.status != ApplicationStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Application has already been processed.",
        )

    application.status = ApplicationStatus.REJECTED

    create_notification(
        db,
        user_id=application.user_id,
        title="Application not selected",
        message="Your club application was not selected this time.",
        type=NotificationType.APPLICATION_REJECTED,
        link=f"/app/clubs/{application.club_id}",
    )

    try:
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise

    db.refresh(application)

    return application