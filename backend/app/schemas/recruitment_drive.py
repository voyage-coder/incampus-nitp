from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models.recruitment_drive import RecruitmentStatus


class RecruitmentDriveCreate(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=100,
    )

    description: str | None = None

    application_start: datetime

    application_end: datetime
    @model_validator(mode="after")
    def validate_dates(self):
        if self.application_end <= self.application_start:
            raise ValueError(
                "application_end must be after application_start."
            )
        return self


class RecruitmentDriveUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=3,
        max_length=100,
    )

    description: str | None = None

    application_start: datetime | None = None

    application_end: datetime | None = None

    status: RecruitmentStatus | None = None
    @model_validator(mode="after")
    def validate_dates(self):
        if (
            self.application_start
            and self.application_end
            and self.application_end <= self.application_start
        ):
            raise ValueError(
                "application_end must be after application_start."
            )

        return self


class RecruitmentDriveResponse(BaseModel):
    id: UUID
    club_id: UUID

    title: str
    description: str | None

    application_start: datetime
    application_end: datetime

    status: RecruitmentStatus

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
    