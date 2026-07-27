import uuid
from enum import Enum

from sqlalchemy import (
    Column,
    DateTime,
    Enum as SQLEnum,
    String,
    Text,
)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class ClubCategory(str, Enum):
    TECHNICAL = "TECHNICAL"
    CULTURAL = "CULTURAL"
    SPORTS = "SPORTS"
    LITERARY = "LITERARY"
    SOCIAL_SERVICE = "SOCIAL_SERVICE"
    ENTREPRENEURSHIP = "ENTREPRENEURSHIP"


class Club(Base):
    __tablename__ = "clubs"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    name = Column(
        String(100),
        unique=True,
        nullable=False,
    )

    description = Column(
        Text,
        nullable=False,
    )

    logo = Column(
        Text,
        nullable=True,
    )

    category = Column(
        SQLEnum(ClubCategory),
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    memberships = relationship(
        "Membership",
        back_populates="club",
        cascade="all, delete-orphan",
    )

    recruitment_drives = relationship(
        "RecruitmentDrive",
        back_populates="club",
        cascade="all, delete-orphan",
    )

    applications = relationship(
        "ClubApplication",
        back_populates="club",
        cascade="all, delete-orphan",
    )