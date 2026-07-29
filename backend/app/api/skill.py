from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.skill import (
    SkillCreate,
    SkillResponse,
    SkillUpdate,
)
from app.services.skill_service import (
    create_skill,
    delete_skill,
    get_my_skills,
    get_skill_by_id,
    update_skill,
)

router = APIRouter(
    tags=["Skill"],
)


@router.post(
    "/resume/{resume_id}/skill",
    response_model=SkillResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_skill_endpoint(
    resume_id: UUID,
    skill: SkillCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_skill(
        db=db,
        resume_id=resume_id,
        skill=skill,
        current_user=current_user,
    )


@router.get(
    "/resume/{resume_id}/skill",
    response_model=list[SkillResponse],
)
def get_my_skills_endpoint(
    resume_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_my_skills(
        db=db,
        resume_id=resume_id,
        current_user=current_user,
    )


@router.get(
    "/{skill_id}",
    response_model=SkillResponse,
)
def get_skill_by_id_endpoint(
    skill_id: UUID,
    db: Session = Depends(get_db),
):
    return get_skill_by_id(
        skill_id=skill_id,
        db=db,
    )


@router.patch(
    "/{skill_id}",
    response_model=SkillResponse,
)
def update_skill_endpoint(
    skill_id: UUID,
    skill: SkillUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_skill(
        skill_id=skill_id,
        skill_update=skill,
        db=db,
        current_user=current_user,
    )


@router.delete(
    "/{skill_id}",
    status_code=status.HTTP_200_OK,
)
def delete_skill_endpoint(
    skill_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return delete_skill(
        skill_id=skill_id,
        db=db,
        current_user=current_user,
    )