from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_serializer

from app.enums.lost_found_status import LostFoundStatus
from app.enums.lost_found_type import LostFoundType
from app.utils.media import public_upload_url


class LostFoundItemCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    description: str = Field(..., min_length=10)
    type: LostFoundType
    location: str = Field(..., min_length=2, max_length=200)
    image_url: Optional[str] = None


class LostFoundItemUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=150)
    description: Optional[str] = Field(None, min_length=10)
    type: Optional[LostFoundType] = None
    location: Optional[str] = Field(None, min_length=2, max_length=200)
    image_url: Optional[str] = None
    status: Optional[LostFoundStatus] = None


class LostFoundItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID

    title: str
    description: str
    type: LostFoundType
    location: str
    image_url: Optional[str]
    status: LostFoundStatus

    created_at: datetime
    updated_at: datetime

    @field_serializer("image_url")
    def serialize_image_url(self, value: str | None) -> str | None:
        return public_upload_url(value)