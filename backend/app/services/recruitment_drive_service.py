from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.club import Club
from app.models.recruitment_drive import (
    RecruitmentDrive,
    RecruitmentStatus,
)

from app.schemas.recruitment_drive import (
    RecruitmentDriveCreate,
    RecruitmentDriveUpdate,
)
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError

def create_recruitment_drive(
    db: Session,
    club_id: UUID,
    recruitment_data: RecruitmentDriveCreate,
):
    club = (
        db.query(Club)
        .filter(Club.id == club_id)
        .first()
    )

    if club is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Club not found.",
        )

    if (
        recruitment_data.application_end
        <= recruitment_data.application_start
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Application end time must be after application start time.",
        )

    existing = (
        db.query(RecruitmentDrive)
        .filter(
            RecruitmentDrive.club_id == club_id,
            RecruitmentDrive.title == recruitment_data.title,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Recruitment drive with this title already exists.",
        )

    open_drive = (
        db.query(RecruitmentDrive)
        .filter(
            RecruitmentDrive.club_id == club_id,
            RecruitmentDrive.status == RecruitmentStatus.OPEN,
        )
        .first()
    )

    if open_drive:
        raise HTTPException(
            status_code=409,
            detail="Club already has an active recruitment drive.",
        )

    recruitment = RecruitmentDrive(
        club_id=club_id,
        title=recruitment_data.title,
        description=recruitment_data.description,
        application_start=recruitment_data.application_start,
        application_end=recruitment_data.application_end,
        status=RecruitmentStatus.DRAFT,
    )

    db.add(recruitment)
    try:
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise
    db.refresh(recruitment)

    return recruitment

def get_recruitment_drives(
    db: Session,
    club_id: UUID,
):
    club = db.get(Club, club_id)

    if club is None:
        raise HTTPException(
            status_code=404,
            detail="Club not found.",
        )
    return (
        db.query(RecruitmentDrive)
        .filter(
            RecruitmentDrive.club_id == club_id
        )
        .order_by(
            RecruitmentDrive.created_at.desc()
        )
        .all()
    )

def get_recruitment_drive(
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

    return recruitment

def update_recruitment_drive(
    db: Session,
    recruitment_id: UUID,
    recruitment_data: RecruitmentDriveUpdate,
):
    # Get existing recruitment drive
    recruitment = get_recruitment_drive(
        db,
        recruitment_id,
    )

    # Fields to update
    updates = recruitment_data.model_dump(
        exclude_unset=True
    )

    # Check duplicate title only if title is updated
    if "title" in updates:
        statement = select(RecruitmentDrive).where(
            RecruitmentDrive.club_id == recruitment.club_id,
            RecruitmentDrive.title == updates["title"],
            RecruitmentDrive.id != recruitment.id,
        )

        existing = db.execute(statement).scalar_one_or_none()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Recruitment drive with this title already exists.",
            )

    # Validate application dates
    if (
        "application_start" in updates
        or "application_end" in updates
    ):
        start = updates.get(
            "application_start",
            recruitment.application_start,
        )

        end = updates.get(
            "application_end",
            recruitment.application_end,
        )

        if end <= start:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Application end time must be after application start time.",
            )

    # Update fields
    for key, value in updates.items():
        setattr(
            recruitment,
            key,
            value,
        )

    try:
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise

    db.refresh(recruitment)

    return recruitment

def delete_recruitment_drive(
    db: Session,
    recruitment_id: UUID,
):
    recruitment = get_recruitment_drive(
        db,
        recruitment_id,
    )

    db.delete(recruitment)
    try:
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise