from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.enums.branch import Branch
from app.enums.semester import Semester


class PyqCreate(BaseModel):
    subject: str = Field(..., min_length=2, max_length=150)
    course_code: str = Field(..., min_length=2, max_length=20)
    branch: Branch
    semester: Semester
    year: int = Field(..., ge=2000, le=2100)
    pdf_url: str


class PyqUpdate(BaseModel):
    subject: Optional[str] = Field(None, min_length=2, max_length=150)
    course_code: Optional[str] = Field(None, min_length=2, max_length=20)
    branch: Optional[Branch] = None
    semester: Optional[Semester] = None
    year: Optional[int] = Field(None, ge=2000, le=2100)
    pdf_url: Optional[str] = None


class PyqResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID

    subject: str
    course_code: str
    branch: Branch
    semester: Semester
    year: int
    pdf_url: str

    created_at: datetime
    updated_at: datetime