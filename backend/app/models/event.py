from datetime import datetime, timezone
import uuid

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    Enum,
)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base

from app.enums.event_status import EventStatus


class Event(Base):
    __tablename__ = "events"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    club_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "clubs.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    title = Column(
        String(150),
        nullable=False,
    )

    description = Column(
        Text,
        nullable=False,
    )

    venue = Column(
        String(255),
        nullable=False,
    )

    start_time = Column(
        DateTime(timezone=True),
        nullable=False,
    )

    end_time = Column(
        DateTime(timezone=True),
        nullable=False,
    )

    registration_deadline = Column(
        DateTime(timezone=True),
        nullable=False,
    )

    max_participants = Column(
        Integer,
        nullable=False,
    )

    banner_url = Column(
        String,
        nullable=True,
    )

    status = Column(
        Enum(EventStatus),
        default=EventStatus.DRAFT,
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    club = relationship(
        "Club",
        back_populates="events",
    )

    registrations = relationship(
        "EventRegistration",
        back_populates="event",
        cascade="all, delete-orphan",
    )