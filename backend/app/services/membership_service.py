from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.models.club import Club
from app.models.membership import Membership, MembershipRole
from app.schemas.membership import MembershipRoleUpdate
from sqlalchemy.exc import SQLAlchemyError

from app.models.user import User

# def join_club(
#     db: Session,
#     club_id: UUID,
#     current_user: User,
# ):
#     club = (
#         db.query(Club)
#         .filter(Club.id == club_id)
#         .first()
#     )

#     if club is None:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Club not found."
#         )

#     existing = (
#         db.query(Membership)
#         .filter(
#             Membership.user_id == current_user.id,
#             Membership.club_id == club_id,
#         )
#         .first()
#     )

#     if existing:
#         raise HTTPException(
#             status_code=status.HTTP_409_CONFLICT,
#             detail="You are already a member of this club."
#         )

#     membership = Membership(
#         user_id=current_user.id,
#         club_id=club_id,
#     )

#     db.add(membership)
#     db.commit()
#     db.refresh(membership)

#     return membership

def get_club_members(
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

    return (
        db.query(Membership)
        .options(joinedload(Membership.user))
        .filter(Membership.club_id == club_id)
        .all()
    )


def get_membership(
    db: Session,
    membership_id: UUID,
):
    membership = (
        db.query(Membership)
        .filter(
            Membership.id == membership_id
        )
        .first()
    )

    if membership is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Membership not found.",
        )

    return membership

def update_member_role(
    db: Session,
    club_id: UUID,
    user_id: UUID,
    role: MembershipRole,
):
    membership = (
        db.query(Membership)
        .options(joinedload(Membership.user))
        .filter(
            Membership.club_id == club_id,
            Membership.user_id == user_id,
        )
        .first()
    )

    if membership is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found in this club.",
        )

    # Prevent changing the founder President directly
    if membership.role == MembershipRole.PRESIDENT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="President role cannot be changed directly. Transfer presidency first.",
        )

    membership.role = role

    try:
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise

    db.refresh(membership)

    return membership

def remove_member(
    db: Session,
    club_id: UUID,
    user_id: UUID,
):
    membership = (
        db.query(Membership)
        .filter(
            Membership.club_id == club_id,
            Membership.user_id == user_id,
        )
        .first()
    )

    if membership is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found in this club.",
        )

    # President cannot be removed directly
    if membership.role == MembershipRole.PRESIDENT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="President cannot be removed. Transfer presidency first.",
        )

    db.delete(membership)

    try:
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise