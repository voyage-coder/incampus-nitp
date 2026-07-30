from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.experience import (
    ExperienceCreate,
    ExperienceResponse,
    ExperienceUpdate,
)
from app.services.experience_service import (
    create_experience,
    delete_experience,
    get_experience_by_id,
    get_my_experiences,
    update_experience,
)

router = APIRouter(
    tags=["Experience"],
)


@router.post(
    "/resume/{resume_id}/experience",
    response_model=ExperienceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_experience_endpoint(
    resume_id: UUID,
    experience: ExperienceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_experience(
        db=db,
        resume_id=resume_id,
        experience=experience,
        current_user=current_user,
    )


@router.get(
    "/resume/{resume_id}/experience",
    response_model=list[ExperienceResponse],
)
def get_my_experiences_endpoint(
    resume_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_my_experiences(
        db=db,
        resume_id=resume_id,
        current_user=current_user,
    )

@router.get(
    "/experiences/{experience_id}",
    response_model=ExperienceResponse,
)
def get_experience_by_id_endpoint(
    experience_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_experience_by_id(
        experience_id=experience_id,
        db=db,
    )


@router.patch(
    "/experiences/{experience_id}",
    response_model=ExperienceResponse,
)
def update_experience_endpoint(
    experience_id: UUID,
    experience: ExperienceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_experience(
        experience_id=experience_id,
        experience_update=experience,
        db=db,
        current_user=current_user,
    )


@router.delete(
    "/experiences/{experience_id}",
    status_code=status.HTTP_200_OK,
)
def delete_experience_endpoint(
    experience_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return delete_experience(
        experience_id=experience_id,
        db=db,
        current_user=current_user,
    )