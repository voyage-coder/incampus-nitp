from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.notifications.enums import NotificationType


class NotificationResponse(BaseModel):
    id: UUID
    title: str
    message: str
    type: NotificationType
    link: Optional[str] = None
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UnreadCountResponse(BaseModel):
    count: int
