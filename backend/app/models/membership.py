import uuid
from datetime import datetime
from enum import Enum # python enum

from sqlalchemy import (
    Column,
    DateTime,
    Enum as SQLEnum, # sqla enum
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base
from sqlalchemy.sql import func

class MembershipRole(str, Enum):
    MEMBER = "MEMBER"
    PRESIDENT = "PRESIDENT"
    VICE_PRESIDENT = "VICE_PRESIDENT"
    SECRETARY = "SECRETARY"
    TREASURER = "TREASURER"
    COORDINATOR = "COORDINATOR"

class Membership(Base):
    __tablename__ = "memberships"
    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "club_id",
            name="uq_user_club_membership",
        ),
    )
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )
    club_id = Column(
        UUID(as_uuid=True),
        ForeignKey("clubs.id"),
        nullable=False,
    )
    role = Column(
        SQLEnum(MembershipRole),
        nullable=False,
        default=MembershipRole.MEMBER,
    )
    joined_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    user = relationship(
        "User",
        back_populates="memberships",
    )

    club = relationship(
        "Club",
        back_populates="memberships",
    )