from uuid import UUID

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.enums.item_status import ItemStatus
from app.enums.role import UserRole
from app.models.user import User
from app.schemas.marketplace import (
    MarketplaceItemCreate,
    MarketplaceItemResponse,
    MarketplaceItemUpdate,
)
from app.schemas.upload import ImageUploadResponse
from app.schemas.user import UserContactResponse
from app.services.marketplace_service import (
    create_marketplace_item,
    delete_marketplace_item,
    get_all_marketplace_items,
    get_marketplace_item_by_id,
    get_marketplace_seller_contact,
    mark_item_as_sold,
    record_marketplace_view,
    update_marketplace_item,
)
from app.utils.file_upload import save_image

router = APIRouter(
    prefix="/marketplace",
    tags=["Marketplace"],
)


@router.post(
    "",
    response_model=MarketplaceItemResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    item_data: MarketplaceItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_marketplace_item(
        db,
        current_user,
        item_data,
    )


@router.post(
    "/upload-image",
    response_model=ImageUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
def upload_listing_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    return ImageUploadResponse(filename=save_image(file))


@router.get(
    "",
    response_model=list[MarketplaceItemResponse],
)
def get_all(
    db: Session = Depends(get_db),
):
    return get_all_marketplace_items(db)

@router.get(
    "/{item_id}",
    response_model=MarketplaceItemResponse,
)
def get_one(
    item_id: UUID,
    db: Session = Depends(get_db),
):
    return get_marketplace_item_by_id(
        db,
        item_id,
    )


@router.get(
    "/{item_id}/contact",
    response_model=UserContactResponse,
)
def get_seller_contact(
    item_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    seller = get_marketplace_seller_contact(
        db,
        item_id,
        current_user,
    )
    return seller


@router.post(
    "/{item_id}/view",
    status_code=status.HTTP_204_NO_CONTENT,
)
def record_item_view(
    item_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record_marketplace_view(
        db,
        item_id,
        current_user,
    )


@router.patch(
    "/{item_id}",
    response_model=MarketplaceItemResponse,
)
def update(
    item_id: UUID,
    item_data: MarketplaceItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = get_marketplace_item_by_id(
        db,
        item_id,
    )

    if (
        item.seller_id != current_user.id
        and current_user.role != UserRole.ADMIN.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this item.",
        )

    return update_marketplace_item(
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
    item = get_marketplace_item_by_id(
        db,
        item_id,
    )

    if (
        item.seller_id != current_user.id
        and current_user.role != UserRole.ADMIN.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this item.",
        )

    delete_marketplace_item(
        db,
        item,
    )


@router.patch(
    "/{item_id}/sold",
    response_model=MarketplaceItemResponse,
)
def mark_sold(
    item_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = get_marketplace_item_by_id(
        db,
        item_id,
    )

    if (
        item.seller_id != current_user.id
        and current_user.role != UserRole.ADMIN.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this item.",
        )

    if item.status == ItemStatus.SOLD:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Item is already marked as sold.",
        )

    return mark_item_as_sold(
        db,
        item,
    )