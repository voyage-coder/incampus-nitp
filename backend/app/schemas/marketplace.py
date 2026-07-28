from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.enums.item_category import ItemCategory
from app.enums.item_status import ItemStatus


class MarketplaceItemCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    description: str = Field(..., min_length=10)
    category: ItemCategory
    price: int = Field(..., ge=0)
    image_url: Optional[str] = None


class MarketplaceItemUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=150)
    description: Optional[str] = Field(None, min_length=10)
    category: Optional[ItemCategory] = None
    price: Optional[int] = Field(None, ge=0)
    image_url: Optional[str] = None
    status: Optional[ItemStatus] = None


class MarketplaceItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    seller_id: UUID

    title: str
    description: str
    category: ItemCategory
    price: int
    image_url: Optional[str]
    status: ItemStatus

    created_at: datetime
    updated_at: datetime