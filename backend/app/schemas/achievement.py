from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class AchievementCreate(BaseModel):
    title: str
    description: str
    achievement_url: str | None = None


class AchievementUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    achievement_url: str | None = None


class AchievementResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    resume_id: UUID
    title: str
    description: str
    achievement_url: str | None
    created_at: datetime
    updated_at: datetime