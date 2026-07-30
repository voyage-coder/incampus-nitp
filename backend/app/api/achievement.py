from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.achievement import (
    AchievementCreate,
    AchievementResponse,
    AchievementUpdate,
)
from app.services.achievement_service import (
    create_achievement,
    delete_achievement,
    get_achievement_by_id,
    get_my_achievements,
    update_achievement,
)

router = APIRouter(
    tags=["Achievement"],
)


@router.post(
    "/resume/{resume_id}/achievement",
    response_model=AchievementResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_achievement_endpoint(
    resume_id: UUID,
    achievement: AchievementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_achievement(
        db=db,
        resume_id=resume_id,
        achievement=achievement,
        current_user=current_user,
    )


@router.get(
    "/resume/{resume_id}/achievement",
    response_model=list[AchievementResponse],
)
def get_my_achievements_endpoint(
    resume_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_my_achievements(
        db=db,
        resume_id=resume_id,
        current_user=current_user,
    )


@router.get(
    "/achievements/{achievement_id}",
    response_model=AchievementResponse,
)
def get_achievement_by_id_endpoint(
    achievement_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_achievement_by_id(
        achievement_id=achievement_id,
        db=db,
    )


@router.patch(
    "/achievements/{achievement_id}",
    response_model=AchievementResponse,
)
def update_achievement_endpoint(
    achievement_id: UUID,
    achievement: AchievementUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_achievement(
        achievement_id=achievement_id,
        achievement_update=achievement,
        db=db,
        current_user=current_user,
    )


@router.delete(
    "/achievements/{achievement_id}",
    status_code=status.HTTP_200_OK,
)
def delete_achievement_endpoint(
    achievement_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return delete_achievement(
        achievement_id=achievement_id,
        db=db,
        current_user=current_user,
    )