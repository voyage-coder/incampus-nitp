from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ExperienceCreate(BaseModel):
    company: str
    role: str
    location: str | None = None
    description: list[str]
    start_date: date
    end_date: date | None = None


class ExperienceUpdate(BaseModel):
    company: str | None = None
    role: str | None = None
    location: str | None = None
    description: list[str] | None = None
    start_date: date | None = None
    end_date: date | None = None


class ExperienceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    resume_id: UUID
    company: str
    role: str
    location: str | None
    description: list[str]
    start_date: date
    end_date: date | None
    created_at: datetime
    updated_at: datetime