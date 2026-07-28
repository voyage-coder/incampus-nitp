from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.enums.lost_found_status import LostFoundStatus
from app.models.lost_found_item import LostFoundItem
from app.models.user import User
from app.schemas.lost_found import (
    LostFoundItemCreate,
    LostFoundItemUpdate,
)


def create_lost_found_item(
    db: Session,
    current_user: User,
    item_data: LostFoundItemCreate,
) -> LostFoundItem:

    item = LostFoundItem(
        user_id=current_user.id,
        title=item_data.title,
        description=item_data.description,
        type=item_data.type,
        location=item_data.location,
        image_url=item_data.image_url,
    )
    if item.status == LostFoundStatus.CLAIMED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Item has already been claimed.",
        )
    db.add(item)
    db.commit()
    db.refresh(item)

    return item


def get_all_lost_found_items(
    db: Session,
):
    return (
        db.query(LostFoundItem)
        .order_by(LostFoundItem.created_at.desc())
        .all()
    )


def get_lost_found_item_by_id(
    db: Session,
    item_id: UUID,
) -> LostFoundItem:

    item = (
        db.query(LostFoundItem)
        .filter(LostFoundItem.id == item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lost & Found item not found.",
        )

    return item


def update_lost_found_item(
    db: Session,
    item: LostFoundItem,
    item_data: LostFoundItemUpdate,
) -> LostFoundItem:

    update_data = item_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)

    return item


def delete_lost_found_item(
    db: Session,
    item: LostFoundItem,
):
    db.delete(item)
    db.commit()


def mark_item_as_claimed(
    db: Session,
    item: LostFoundItem,
) -> LostFoundItem:

    item.status = LostFoundStatus.CLAIMED

    db.commit()
    db.refresh(item)

    return item