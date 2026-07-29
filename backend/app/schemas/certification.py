from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class CertificationCreate(BaseModel):
    name: str
    issuer: str
    issue_date: datetime | None = None
    credential_id: str | None = None
    credential_url: str | None = None


class CertificationUpdate(BaseModel):
    name: str | None = None
    issuer: str | None = None
    issue_date: datetime | None = None
    credential_id: str | None = None
    credential_url: str | None = None


class CertificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    resume_id: UUID
    name: str
    issuer: str
    issue_date: datetime | None
    credential_id: str | None
    credential_url: str | None
    created_at: datetime
    updated_at: datetime