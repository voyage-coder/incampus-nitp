from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.enums.lost_found_status import LostFoundStatus
from app.enums.role import UserRole
from app.models.user import User
from app.schemas.lost_found import (
    LostFoundItemCreate,
    LostFoundItemResponse,
    LostFoundItemUpdate,
)
from app.services.lost_found_service import (
    create_lost_found_item,
    delete_lost_found_item,
    get_all_lost_found_items,
    get_lost_found_item_by_id,
    mark_item_as_claimed,
    update_lost_found_item,
)

router = APIRouter(
    prefix="/lost-found",
    tags=["Lost & Found"],
)

@router.post(
    "",
    response_model=LostFoundItemResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    item_data: LostFoundItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_lost_found_item(
        db,
        current_user,
        item_data,
    )

@router.get(
    "",
    response_model=list[LostFoundItemResponse],
)
def get_all(
    db: Session = Depends(get_db),
):
    return get_all_lost_found_items(db)


@router.get(
    "/{item_id}",
    response_model=LostFoundItemResponse,
)
def get_one(
    item_id: UUID,
    db: Session = Depends(get_db),
):
    return get_lost_found_item_by_id(
        db,
        item_id,
    )



@router.patch(
    "/{item_id}",
    response_model=LostFoundItemResponse,
)
def update(
    item_id: UUID,
    item_data: LostFoundItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = get_lost_found_item_by_id(
        db,
        item_id,
    )

    if (
        item.user_id != current_user.id
        and current_user.role != UserRole.ADMIN.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this report.",
        )

    return update_lost_found_item(
        db,
        item,
        item_data,
    )


@router.delete(
    "/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete(
    item_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = get_lost_found_item_by_id(
        db,
        item_id,
    )

    if (
        item.user_id != current_user.id
        and current_user.role != UserRole.ADMIN.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this report.",
        )

    delete_lost_found_item(
        db,
        item,
    )


@router.patch(
    "/{item_id}/claim",
    response_model=LostFoundItemResponse,
)
def mark_claimed(
    item_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = get_lost_found_item_by_id(
        db,
        item_id,
    )

    if (
        item.user_id != current_user.id
        and current_user.role != UserRole.ADMIN.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to mark this report as claimed.",
        )

    if item.status == LostFoundStatus.CLAIMED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Item has already been claimed.",
        )

    return mark_item_as_claimed(
        db,
        item,
    )


