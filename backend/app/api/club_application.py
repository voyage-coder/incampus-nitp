from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.dependencies.auth import get_current_user
from app.dependencies.roles import require_president

from app.models.user import User

from app.schemas.club_application import (
    ClubApplicationResponse,
)

from app.services.club_application_service import (
    apply_for_recruitment,
    approve_application,
    get_application,
    get_recruitment_applications,
    reject_application,
)

from app.services.recruitment_drive_service import (
    get_recruitment_drive,
)

router = APIRouter(
    tags=["Club Applications"],
)


@router.post(
    "/recruitments/{recruitment_id}/apply",
    response_model=ClubApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def apply(
    recruitment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return apply_for_recruitment(
        db,
        recruitment_id,
        current_user,
    )


@router.get(
    "/recruitments/{recruitment_id}/applications",
    response_model=list[ClubApplicationResponse],
)
def read_applications(
    recruitment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recruitment = get_recruitment_drive(
        db,
        recruitment_id,
    )

    require_president(
        recruitment.club_id,
        current_user,
        db,
    )

    return get_recruitment_applications(
        db,
        recruitment_id,
    )


@router.get(
    "/applications/{application_id}",
    response_model=ClubApplicationResponse,
)
def read_application(
    application_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    application = get_application(
        db,
        application_id,
    )

    require_president(
        application.recruitment.club_id,
        current_user,
        db,
    )

    return application


@router.patch(
    "/applications/{application_id}/approve",
    response_model=ClubApplicationResponse,
)
def approve(
    application_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    application = get_application(
        db,
        application_id,
    )

    require_president(
        application.recruitment.club_id,
        current_user,
        db,
    )

    return approve_application(
        db,
        application_id,
    )


@router.patch(
    "/applications/{application_id}/reject",
    response_model=ClubApplicationResponse,
)
def reject(
    application_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    application = get_application(
        db,
        application_id,
    )

    require_president(
        application.recruitment.club_id,
        current_user,
        db,
    )

    return reject_application(
        db,
        application_id,
    )