import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.enums.job_type import JobType
from sqlalchemy import func
from sqlalchemy import CheckConstraint

class PlacementExperience(Base):
    __tablename__ = "placement_experiences"
    __table_args__ = (
        CheckConstraint(
            "cgpa >= 0 AND cgpa <= 10",
            name="ck_placement_cgpa",
        ),
        CheckConstraint(
            "year >= 2000",
            name="ck_placement_year",
        ),
    )

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    company = Column(
        String(150),
        nullable=False,
    )

    role = Column(
        String(100),
        nullable=False,
    )

    job_type = Column(
        Enum(JobType),
        nullable=False,
    )

    cgpa = Column(
        Float,
        nullable=False,
    )

    ctc = Column(
        Float,
        nullable=True,
    )

    stipend = Column(
        Integer,
        nullable=True,
    )

    year = Column(
        Integer,
        nullable=False,
    )

    interview_rounds = Column(
        Text,
        nullable=False,
    )

    preparation = Column(
        Text,
        nullable=False,
    )

    experience = Column(
        Text,
        nullable=False,
    )

    # created_at = Column(
    #     DateTime(timezone=True),
    #     default=lambda: datetime.now(timezone.utc),
    #     nullable=False,
    # )

    # updated_at = Column(
    #     DateTime(timezone=True),
    #     default=lambda: datetime.now(timezone.utc),
    #     onupdate=lambda: datetime.now(timezone.utc),
    #     nullable=False,
    # )
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

    user = relationship(
        "User",
        back_populates="placement_experiences",
    )


