import uuid

from sqlalchemy import (
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.enums.item_category import ItemCategory
from app.enums.item_status import ItemStatus
from sqlalchemy import CheckConstraint

class MarketplaceItem(Base):
    __tablename__ = "marketplace_items"
    __table_args__ = (
        CheckConstraint(
            "price >= 0",
            name="ck_marketplace_price",
        ),
    )

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    seller_id = Column(
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

    category = Column(
        Enum(ItemCategory),
        nullable=False,
    )

    price = Column(
        Integer,
        nullable=False,
    )

    image_url = Column(
        String,
        nullable=True,
    )

    status = Column(
        Enum(ItemStatus),
        nullable=False,
        default=ItemStatus.AVAILABLE,
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

    seller = relationship(
        "User",
        back_populates="marketplace_items",
    )