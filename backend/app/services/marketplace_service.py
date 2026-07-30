from datetime import datetime, timedelta, timezone
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
from app.notifications.enums import NotificationType
from app.notifications.models import Notification
from app.notifications.service import create_notification


def _notify_marketplace_inquiry(
    db: Session,
    *,
    item: MarketplaceItem,
    buyer: User,
    action: str,
) -> None:
    if item.seller_id == buyer.id:
        return

    message = f'{buyer.full_name} {action} your listing "{item.title}".'
    one_hour_ago = datetime.now(timezone.utc) - timedelta(hours=1)
    existing = (
        db.query(Notification)
        .filter(
            Notification.user_id == item.seller_id,
            Notification.type == NotificationType.MARKETPLACE_INQUIRY,
            Notification.message == message,
            Notification.created_at >= one_hour_ago,
        )
        .first()
    )
    if existing:
        return

    create_notification(
        db,
        user_id=item.seller_id,
        title="New marketplace inquiry",
        message=message,
        type=NotificationType.MARKETPLACE_INQUIRY,
        link="/app/marketplace",
    )


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


def record_marketplace_view(
    db: Session,
    item_id: UUID,
    current_user: User,
) -> None:
    item = get_marketplace_item_by_id(db, item_id)

    if item.seller_id == current_user.id:
        return

    if item.status != ItemStatus.AVAILABLE:
        return

    _notify_marketplace_inquiry(
        db,
        item=item,
        buyer=current_user,
        action="viewed",
    )
    db.commit()


def get_marketplace_seller_contact(
    db: Session,
    item_id: UUID,
    current_user: User,
) -> User:
    item = get_marketplace_item_by_id(db, item_id)

    if item.seller_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot request your own contact details.",
        )

    if item.status != ItemStatus.AVAILABLE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This item is no longer available.",
        )

    seller = db.get(User, item.seller_id)
    if not seller:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Seller not found.",
        )

    _notify_marketplace_inquiry(
        db,
        item=item,
        buyer=current_user,
        action="requested contact for",
    )
    db.commit()

    return seller