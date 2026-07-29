import uuid

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship


from app.db.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )

    headline = Column(
        String(200),
        nullable=True,
    )

    summary = Column(
        Text,
        nullable=True,
    )
    name = Column(String(100), nullable=False)

    template = Column(
        String(50),
        nullable=False,
        server_default="default",
    )
    pdf_path = Column(
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

    user = relationship(
        "User",
        back_populates="resume",
    )

    educations = relationship(
        "Education",
        back_populates="resume",
        cascade="all, delete-orphan",
    )

    experiences = relationship(
        "Experience",
        back_populates="resume",
        cascade="all, delete-orphan",
    )

    projects = relationship(
        "Project",
        back_populates="resume",
        cascade="all, delete-orphan",
    )

    skills = relationship(
        "Skill",
        back_populates="resume",
        cascade="all, delete-orphan",
    )

    achievements = relationship(
        "Achievement",
        back_populates="resume",
        cascade="all, delete-orphan",
    )

    certifications = relationship(
        "Certification",
        back_populates="resume",
        cascade="all, delete-orphan",
    )

    positions_of_responsibility = relationship(
        "PositionOfResponsibility",
        back_populates="resume",
        cascade="all, delete-orphan",
    )