from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.marketplace_item import MarketplaceItem
from app.models.user import User
from app.schemas.marketplace import (
    MarketplaceItemCreate,
    MarketplaceItemUpdate,
)
from app.enums.item_status import ItemStatus

def create_marketplace_item(
    db: Session,
    current_user: User,
    item_data: MarketplaceItemCreate,
) -> MarketplaceItem:

    item = MarketplaceItem(
        seller_id=current_user.id,
        title=item_data.title,
        description=item_data.description,
        category=item_data.category,
        price=item_data.price,
        image_url=item_data.image_url,
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


def get_all_marketplace_items(
    db: Session,
):
    return (
        db.query(MarketplaceItem)
        .order_by(MarketplaceItem.created_at.desc())
        .all()
    )


def get_marketplace_item_by_id(
    db: Session,
    item_id: UUID,
) -> MarketplaceItem:

    item = (
        db.query(MarketplaceItem)
        .filter(MarketplaceItem.id == item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Marketplace item not found.",
        )

    return item


def update_marketplace_item(
    db: Session,
    item: MarketplaceItem,
    item_data: MarketplaceItemUpdate,
) -> MarketplaceItem:

    update_data = item_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)

    return item


def delete_marketplace_item(
    db: Session,
    item: MarketplaceItem,
):

    db.delete(item)
    db.commit()


def mark_item_as_sold(
    db: Session,
    item: MarketplaceItem,
) -> MarketplaceItem:

    item.status = "SOLD"

    db.commit()
    db.refresh(item)

    return item