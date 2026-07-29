import uuid

from sqlalchemy import (
    Column,
    Date,
    DateTime,
    ForeignKey,
    String,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base


class Certification(Base):
    __tablename__ = "certifications"

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

    name = Column(
        String(200),
        nullable=False,
    )

    issuer = Column(
        String(200),
        nullable=False,
    )

    issue_date = Column(
        Date,
        nullable=True,
    )

    credential_id = Column(
        String(500),
        nullable=True,
    )

    credential_url = Column(
        String,
        nullable=True,
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
        back_populates="certifications",
    )