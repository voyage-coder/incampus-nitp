from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.enums.event_status import EventStatus


class EventCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=150)
    description: str = Field(..., min_length=10)
    venue: str = Field(..., min_length=3, max_length=255)
    start_time: datetime
    end_time: datetime
    registration_deadline: datetime
    max_participants: int = Field(..., gt=0)
    banner_url: Optional[str] = None


class EventUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=150)
    description: Optional[str] = Field(None, min_length=10)
    venue: Optional[str] = Field(None, min_length=3, max_length=255)
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    registration_deadline: Optional[datetime] = None
    max_participants: Optional[int] = Field(None, gt=0)
    banner_url: Optional[str] = None
    status: Optional[EventStatus] = None


class EventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    club_id: UUID
    title: str
    description: str
    venue: str
    start_time: datetime
    end_time: datetime
    registration_deadline: datetime
    max_participants: int
    banner_url: Optional[str]
    status: EventStatus
    created_at: datetime
    updated_at: datetime