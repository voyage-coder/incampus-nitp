from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.enums.job_type import JobType


class PlacementExperienceCreate(BaseModel):
    company: str = Field(..., min_length=2, max_length=150)
    role: str = Field(..., min_length=2, max_length=100)
    job_type: JobType

    cgpa: float = Field(..., ge=0, le=10)

    ctc: Optional[float] = Field(None, gt=0)
    stipend: Optional[int] = Field(None, gt=0)

    year: int = Field(..., ge=2000)

    interview_rounds: str = Field(..., min_length=20)
    preparation: str = Field(..., min_length=20)
    experience: str = Field(..., min_length=20)

class PlacementExperienceUpdate(BaseModel):
    company: Optional[str] = Field(None, min_length=2, max_length=150)
    role: Optional[str] = Field(None, min_length=2, max_length=100)
    job_type: Optional[JobType] = None

    cgpa: Optional[float] = Field(None, ge=0, le=10)

    ctc: Optional[float] = Field(None, gt=0)
    stipend: Optional[int] = Field(None, gt=0)

    year: Optional[int] = Field(None, ge=2000)

    interview_rounds: Optional[str] = Field(None, min_length=20)
    preparation: Optional[str] = Field(None, min_length=20)
    experience: Optional[str] = Field(None, min_length=20)

class PlacementExperienceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID

    company: str
    role: str
    job_type: JobType

    cgpa: float

    ctc: Optional[float]
    stipend: Optional[int]

    year: int

    interview_rounds: str
    preparation: str
    experience: str

    created_at: datetime
    updated_at: datetime