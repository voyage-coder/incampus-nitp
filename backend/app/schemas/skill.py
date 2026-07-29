from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.enums.skill_category import SkillCategory


class SkillCreate(BaseModel):
    name: str
    category: SkillCategory


class SkillUpdate(BaseModel):
    name: str | None = None
    category: SkillCategory | None = None


class SkillResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    resume_id: UUID
    name: str
    category: SkillCategory
    created_at: datetime
    updated_at: datetime