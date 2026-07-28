import uuid

from sqlalchemy import (
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.enums.branch import Branch
from app.enums.semester import Semester


class Pyq(Base):
    __tablename__ = "pyqs"

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

    subject = Column(
        String(150),
        nullable=False,
    )

    course_code = Column(
        String(20),
        nullable=False,
    )

    branch = Column(
        Enum(Branch),
        nullable=False,
    )

    semester = Column(
        Enum(Semester),
        nullable=False,
    )

    year = Column(
        Integer,
        nullable=False,
    )

    pdf_url = Column(
        String,
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

    user = relationship(
        "User",
        back_populates="pyqs",
    )