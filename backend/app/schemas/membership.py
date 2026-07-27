from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.membership import MembershipRole


class MembershipResponse(BaseModel):
    id: UUID

    user_id: UUID
    club_id: UUID

    role: MembershipRole

    joined_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


class MembershipRoleUpdate(BaseModel):
    # New role to assign to the club member
    role: MembershipRole