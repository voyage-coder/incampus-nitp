import uuid
# python itself can generate uuids
from sqlalchemy import Column, String, Text, SmallInteger, DateTime, Boolean
# everythung inside sql table is a column, string is equivalent to VARCHAR, text equivalent to TEXT, SMALLINT, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy.sql import func # CURRENT_TIMESTAMP - SQLA writes it as func.now()

from app.db.database import Base

from sqlalchemy.orm import relationship

# create user class - it inherits from Base
class User(Base): 
    __tablename__ = "users"
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4 # here python generates this value
    )
    full_name = Column(
        String(100),
        nullable=False
    )
    email = Column(
        String(255),
        unique=True,
        nullable=False
    )
    password_hash = Column(
        Text,
        nullable=True,
    )
    google_id = Column(
        String(255),
        unique=True,
        nullable=True,
        index=True,
    )
    roll_number = Column(
        String(20),
        unique=True
    )
    branch = Column(
        String(20),
        nullable=False
    )
    year = Column(
        SmallInteger
    )
    profile_image = Column(Text)
    bio = Column(Text)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now() # here PSQL generates this value
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    role = Column(
        String(20),
        nullable=False,
        default="student"
    )
    github = Column(String, nullable=True)
    linkedin = Column(String, nullable=True)
    portfolio = Column(String, nullable=True)
    # hostel = Column(String, nullable=True)
    # room_number = Column(String, nullable=True)
    phone = Column(String(15), nullable=True)
    is_active = Column(
        Boolean,
        default=True,
        nullable=False
    )
    is_verified = Column(
        Boolean,
        default=False,
        nullable=False
    )
    # clubs = relationship(
    #     "Club",
    #     back_populates="head"
    # )
    memberships = relationship(
        "Membership",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    applications = relationship(
        "ClubApplication",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    event_registrations = relationship(
        "EventRegistration",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    placement_experiences = relationship(
        "PlacementExperience",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    marketplace_items = relationship(
        "MarketplaceItem",
        back_populates="seller",
        cascade="all, delete-orphan",
    )
    lost_found_items = relationship(
        "LostFoundItem",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    pyqs = relationship(
        "Pyq",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    resume = relationship(
        "Resume",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    notifications = relationship(
        "Notification",
        back_populates="user",
        cascade="all, delete-orphan",
    )