from uuid import UUID

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.dependencies.auth import get_current_user
from app.dependencies.roles import require_president

from app.models.user import User

from app.schemas.recruitment_drive import (
    RecruitmentDriveCreate,
    RecruitmentDriveResponse,
    RecruitmentDriveUpdate,
)

from app.services.recruitment_drive_service import (
    create_recruitment_drive,
    delete_recruitment_drive,
    get_recruitment_drive,
    get_recruitment_drives,
    update_recruitment_drive,
)

router = APIRouter(
    prefix="",
    tags=["Recruitment Drives"],
)


@router.post(
    "/clubs/{club_id}/recruitments",
    response_model=RecruitmentDriveResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_drive(
    club_id: UUID,
    recruitment: RecruitmentDriveCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_president(
        club_id,
        current_user,
        db,
    )

    return create_recruitment_drive(
        db,
        club_id,
        recruitment,
    )


@router.get(
    "/clubs/{club_id}/recruitments",
    response_model=list[RecruitmentDriveResponse],
)
def read_drives(
    club_id: UUID,
    db: Session = Depends(get_db),
):
    return get_recruitment_drives(
        db,
        club_id,
    )


@router.get(
    "/recruitments/{recruitment_id}",
    response_model=RecruitmentDriveResponse,
)
def read_drive(
    recruitment_id: UUID,
    db: Session = Depends(get_db),
):
    return get_recruitment_drive(
        db,
        recruitment_id,
    )


@router.patch(
    "/recruitments/{recruitment_id}",
    response_model=RecruitmentDriveResponse,
)
def edit_drive(
    recruitment_id: UUID,
    recruitment: RecruitmentDriveUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recruitment_drive = get_recruitment_drive(
        db,
        recruitment_id,
    )

    require_president(
        recruitment_drive.club_id,
        current_user,
        db,
    )

    return update_recruitment_drive(
        db,
        recruitment_id,
        recruitment,
    )


@router.delete(
    "/recruitments/{recruitment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_drive(
    recruitment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recruitment_drive = get_recruitment_drive(
        db,
        recruitment_id,
    )

    require_president(
        recruitment_drive.club_id,
        current_user,
        db,
    )

    delete_recruitment_drive(
        db,
        recruitment_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )