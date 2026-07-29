import uuid

from sqlalchemy import (
    CheckConstraint,
    Column,
    DateTime,
    ForeignKey,
    Numeric,
    String,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ENUM
from app.enums.branch import Branch
from sqlalchemy import Integer

from app.db.database import Base


class Education(Base):
    __tablename__ = "educations"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    resume_id = Column(
        UUID(as_uuid=True),
        ForeignKey("resumes.id", ondelete="CASCADE"),
        nullable=False,
    )

    institution = Column(
        String(200),
        nullable=False,
    )

    degree = Column(
        String(100),
        nullable=False,
    )

    branch = Column(
        ENUM(
            Branch,
            name="branch",
            create_type=False,
        ),
        nullable=True,
    )

    score = Column(
        Numeric(5, 2),
        nullable=False,
    )

    start_year = Column(
        Integer,
        nullable=False,
    )

    end_year = Column(
        Integer,
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

    resume = relationship(
        "Resume",
        back_populates="educations",
    )

    __table_args__ = (
        CheckConstraint(
            "cgpa >= 0 AND cgpa <= 10",
            name="ck_education_cgpa",
        ),
    )