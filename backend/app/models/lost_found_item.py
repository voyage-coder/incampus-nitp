import uuid

from sqlalchemy import (
    CheckConstraint,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.enums.lost_found_status import LostFoundStatus
from app.enums.lost_found_type import LostFoundType


class LostFoundItem(Base):
    __tablename__ = "lost_found_items"

    __table_args__ = (
        CheckConstraint(
            "length(title) >= 2",
            name="ck_lost_found_title_length",
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

    title = Column(
        String(150),
        nullable=False,
    )

    description = Column(
        Text,
        nullable=False,
    )

    type = Column(
        Enum(LostFoundType),
        nullable=False,
    )

    location = Column(
        String(200),
        nullable=False,
    )

    image_url = Column(
        String,
        nullable=True,
    )

    status = Column(
        Enum(LostFoundStatus),
        nullable=False,
        default=LostFoundStatus.OPEN,
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
        back_populates="lost_found_items",
    )