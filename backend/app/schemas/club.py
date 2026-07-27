from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, HttpUrl

from app.models.club import ClubCategory


class ClubCreate(BaseModel):
    name: str = Field(min_length=3, max_length=100)
    description: str = Field(min_length=10)
    logo: HttpUrl | None = None
    category: ClubCategory

    # User who will become the first PRESIDENT of the club
    founder_id: UUID


class ClubUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=3, max_length=100)
    description: str | None = Field(default=None, min_length=10)
    logo: HttpUrl | None = None
    category: ClubCategory | None = None


class ClubResponse(BaseModel):
    id: UUID
    name: str
    description: str
    logo: str | None
    category: ClubCategory
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)