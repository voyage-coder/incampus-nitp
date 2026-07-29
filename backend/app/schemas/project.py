from uuid import UUID
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict


class ProjectCreate(BaseModel):
    title: str
    description: list[str]
    technologies: str
    github_url: str | None = None
    live_url: str | None = None
    start_date: date | None = None
    end_date: date | None = None

class ProjectUpdate(BaseModel):
    title: str | None = None
    description: list[str] | None = None
    technologies: str | None = None
    github_url: str | None = None
    live_url: str | None = None
    start_date: date | None = None
    end_date: date | None = None

class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    resume_id: UUID
    title: str
    description: list[str]
    technologies: str
    github_url: str | None
    live_url: str | None
    start_date: date | None
    end_date: date | None
    created_at: datetime
    updated_at: datetime