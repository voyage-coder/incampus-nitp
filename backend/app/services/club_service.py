from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, select
from sqlalchemy.exc import SQLAlchemyError

from app.models.club import Club
from app.models.user import User
from app.models.membership import Membership, MembershipRole

from app.schemas.club import ClubCreate, ClubUpdate


def create_club(
    db: Session,
    club_data: ClubCreate,
):
    existing = (
        db.query(Club)
        .filter(
            func.lower(Club.name) == club_data.name.lower()
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Club with this name already exists.",
        )

    founder = db.get(User, club_data.founder_id)

    if not founder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Founder not found.",
        )

    club = Club(
        name=club_data.name,
        description=club_data.description,
        logo=str(club_data.logo) if club_data.logo else None,
        category=club_data.category,
    )

    db.add(club)

    try:
        db.commit()
        db.refresh(club)

        founder_membership = Membership(
            user_id=club_data.founder_id,
            club_id=club.id,
            role=MembershipRole.PRESIDENT,
        )

        db.add(founder_membership)
        db.commit()

    except SQLAlchemyError:
        db.rollback()
        raise

    db.refresh(club)

    return club


def get_all_clubs(db: Session):
    return (
        db.query(Club)
        .order_by(Club.name)
        .all()
    )


def get_club_by_id(
    db: Session,
    club_id: UUID,
):
    club = (
        db.query(Club)
        .filter(Club.id == club_id)
        .first()
    )

    if club is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Club not found.",
        )

    return club


def update_club(
    db: Session,
    club_id: UUID,
    club_data: ClubUpdate,
):
    club = get_club_by_id(db, club_id)

    updates = club_data.model_dump(
        exclude_unset=True,
    )

    if "name" in updates:
        statement = select(Club).where(
            Club.name == updates["name"],
            Club.id != club.id,
        )

        existing = db.execute(statement).scalar_one_or_none()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Club name already exists.",
            )

    if "logo" in updates and updates["logo"] is not None:
        updates["logo"] = str(updates["logo"])

    for key, value in updates.items():
        setattr(club, key, value)

    try:
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise

    db.refresh(club)

    return club


def delete_club(
    db: Session,
    club_id: UUID,
):
    club = get_club_by_id(
        db,
        club_id,
    )

    db.delete(club)

    try:
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise

    return {
        "message": "Club deleted successfully."
    }