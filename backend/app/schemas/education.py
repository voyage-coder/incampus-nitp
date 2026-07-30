from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, field_validator

from app.enums.branch import Branch
from typing import Optional


class EducationCreate(BaseModel):
    institution: str
    degree: str
    branch: Optional[Branch] = None

    @field_validator("branch", mode="before")
    @classmethod
    def empty_branch_to_none(cls, value):
        if value == "" or value is None:
            return None
        return value
    score: float
    start_year: int
    end_year: int


class EducationUpdate(BaseModel):
    institution: str | None = None
    degree: str | None = None
    branch: Optional[Branch] = None

    @field_validator("branch", mode="before")
    @classmethod
    def empty_branch_to_none(cls, value):
        if value == "" or value is None:
            return None
        return value
    score: float | None = None
    start_year: int | None = None
    end_year: int | None = None


class EducationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    resume_id: UUID
    institution: str
    degree: str
    branch: Optional[Branch] = None
    score: float
    start_year: int
    end_year: int
    created_at: datetime
    updated_at: datetime