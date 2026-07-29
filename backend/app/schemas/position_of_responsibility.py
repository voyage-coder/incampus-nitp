from datetime import date
from uuid import UUID

from pydantic import BaseModel, ConfigDict, HttpUrl


class PositionBase(BaseModel):
    position: str
    organization: str
    start_date: date
    end_date: date | None = None
    url: HttpUrl | None = None


class PositionCreate(PositionBase):
    pass


class PositionUpdate(BaseModel):
    position: str | None = None
    organization: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    url: HttpUrl | None = None


class PositionResponse(PositionBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)