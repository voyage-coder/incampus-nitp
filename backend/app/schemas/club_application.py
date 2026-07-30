from typing import Optional
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.club_application import ApplicationStatus


class ClubApplicationCreate(BaseModel):
    pass


class ClubApplicationUpdate(BaseModel):
    status: ApplicationStatus


class ClubApplicationResponse(BaseModel):
    id: UUID

    user_id: UUID
    club_id: UUID
    recruitment_drive_id: UUID

    status: ApplicationStatus

    applied_at: datetime

    user_full_name: Optional[str] = None
    user_email: Optional[str] = None

    model_config = ConfigDict(
        from_attributes=True
    )