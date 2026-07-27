import uuid
from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import (
    Column,
    DateTime,
    Enum as SQLEnum,
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column


class ApplicationStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    WITHDRAWN = "WITHDRAWN"


class ClubApplication(Base):
    __tablename__ = "club_applications"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "recruitment_drive_id",
            name="uq_user_recruitment_application",
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

    recruitment_drive_id = Column(
        UUID(as_uuid=True),
        ForeignKey("recruitment_drives.id"),
        nullable=False,
    )

    status = Column(
        SQLEnum(ApplicationStatus),
        default=ApplicationStatus.PENDING,
        nullable=False,
    )

    applied_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="applications",
    )

    club = relationship(
        "Club",
        back_populates="applications",
    )

    recruitment_drive = relationship(
        "RecruitmentDrive",
        back_populates="applications",
    )