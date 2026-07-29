from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.achievement import AchievementResponse
from app.schemas.certification import CertificationResponse
from app.schemas.education import EducationResponse
from app.schemas.experience import ExperienceResponse
from app.schemas.project import ProjectResponse
from app.schemas.skill import SkillResponse
from app.schemas.position_of_responsibility import PositionResponse

class ResumeCreate(BaseModel):
    name: str

    headline: Optional[str] = Field(None, max_length=200)
    summary: Optional[str] = None
    template: str = Field(default="default", max_length=50)

class ResumeUpdate(BaseModel):
    name: Optional[str] = None

    headline: Optional[str] = Field(None, max_length=200)
    summary: Optional[str] = None
    template: Optional[str] = Field(None, max_length=50)

class ResumeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID

    headline: str
    summary: str | None = None
    template: str
    name: str

    educations: list[EducationResponse] = []
    experiences: list[ExperienceResponse] = []
    projects: list[ProjectResponse] = []
    skills: list[SkillResponse] = []
    achievements: list[AchievementResponse] = []
    certifications: list[CertificationResponse] = []
    positions_of_responsibility: list[PositionResponse] = []

    created_at: datetime
    updated_at: datetime