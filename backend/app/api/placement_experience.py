from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.placement_experience import PlacementExperience
from app.models.user import User
from app.schemas.placement_experience import (
    PlacementExperienceCreate,
    PlacementExperienceResponse,
    PlacementExperienceUpdate,
)
from app.enums.role import UserRole
from app.services.placement_experience_service import (
    create_placement_experience,
    delete_placement_experience,
    get_all_placement_experiences,
    get_placement_experience_by_id,
    update_placement_experience,
)

router = APIRouter(
    prefix="/placement-experiences",
    tags=["Placement Experiences"],
)


@router.post(
    "",
    response_model=PlacementExperienceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    placement_data: PlacementExperienceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_placement_experience(
        db,
        current_user,
        placement_data,
    )

@router.get(
    "",
    response_model=list[PlacementExperienceResponse],
)
def get_all(
    db: Session = Depends(get_db),
):
    return get_all_placement_experiences(db)

@router.get(
    "/{placement_id}",
    response_model=PlacementExperienceResponse,
)
def get_one(
    placement_id: UUID,
    db: Session = Depends(get_db),
):
    placement = get_placement_experience_by_id(
        db,
        placement_id,
    )

    if not placement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Placement experience not found.",
        )

    return placement


@router.patch(
    "/{placement_id}",
    response_model=PlacementExperienceResponse,
)
def update(
    placement_id: UUID,
    placement_data: PlacementExperienceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    placement = get_placement_experience_by_id(
        db,
        placement_id,
    )

    if not placement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Placement experience not found.",
        )

    if (
        placement.user_id != current_user.id
        and current_user.role != UserRole.ADMIN.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this placement experience.",
        )

    return update_placement_experience(
        db,
        placement,
        placement_data,
    )


@router.delete(
    "/{placement_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete(
    placement_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    placement = get_placement_experience_by_id(
        db,
        placement_id,
    )

    if not placement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Placement experience not found.",
        )

    if (
        placement.user_id != current_user.id
        and current_user.role != UserRole.ADMIN.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this placement experience.",
        )

    delete_placement_experience(
        db,
        placement,
    )


