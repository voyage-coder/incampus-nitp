from uuid import UUID

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user

from app.models.membership import Membership, MembershipRole
from app.models.user import User


def require_role(allowed_roles: list[str]):
    normalized_allowed = {
        (role.value if hasattr(role, "value") else str(role)).lower()
        for role in allowed_roles
    }

    def role_checker(
        current_user: User = Depends(get_current_user),
    ):
        user_role = (current_user.role or "").lower()
        if user_role not in normalized_allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to perform this action.",
            )

        return current_user

    return role_checker


def require_president(
    club_id: UUID,
    current_user: User,
    db: Session,
):
    membership = (
        db.query(Membership)
        .filter(
            Membership.club_id == club_id,
            Membership.user_id == current_user.id,
        )
        .first()
    )

    if membership is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You are not a member of this club.",
        )

    if membership.role != MembershipRole.PRESIDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the club president can perform this action.",
        )

    return membership