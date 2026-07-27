import uuid
from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import (
    Column,
    DateTime,
    Enum as SQLEnum,
    ForeignKey,
    String,
    Text,
    UniqueConstraint,
    CheckConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
# from sqlalchemy.orm import relationship
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base
from sqlalchemy.sql import func


class RecruitmentStatus(str, Enum):
    DRAFT = "DRAFT"
    OPEN = "OPEN"
    CLOSED = "CLOSED"


class RecruitmentDrive(Base):
    __tablename__ = "recruitment_drives"
    __table_args__ = (
        UniqueConstraint(
            "club_id",
            "title",
            name="uq_club_recruitment_title",
        ),
        CheckConstraint(
            "application_end > application_start",
            name="ck_application_dates",
        ),
    )

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    club_id = Column(
        UUID(as_uuid=True),
        ForeignKey("clubs.id"),
        nullable=False,
    )

    title = Column(
        String(100),
        nullable=False,
    )

    description = Column(
        Text,
        nullable=True,
    )

    application_start = Column(
        DateTime(timezone=True),
        nullable=False,
    )

    application_end = Column(
        DateTime(timezone=True),
        nullable=False,
    )

    status = Column(
        SQLEnum(RecruitmentStatus),
        default=RecruitmentStatus.DRAFT,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    club = relationship(
        "Club",
        back_populates="recruitment_drives",
    )

    applications = relationship(
        "ClubApplication",
        back_populates="recruitment_drive",
        cascade="all, delete-orphan",
    )