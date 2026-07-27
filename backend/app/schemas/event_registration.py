from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class EventRegistrationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    event_id: UUID
    user_id: UUID
    registered_at: datetime