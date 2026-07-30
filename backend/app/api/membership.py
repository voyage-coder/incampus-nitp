from uuid import UUID

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.dependencies.auth import get_current_user
from app.dependencies.roles import require_president

from app.models.user import User

from app.schemas.membership import (
    MembershipResponse,
    MembershipRoleUpdate,
)

from app.services.membership_service import (
    get_club_members,
    get_membership,
    remove_member,
    update_member_role,
)


def _membership_response(membership) -> MembershipResponse:
    return MembershipResponse(
        id=membership.id,
        user_id=membership.user_id,
        club_id=membership.club_id,
        role=membership.role,
        joined_at=membership.joined_at,
        user_full_name=membership.user.full_name if membership.user else None,
        user_email=membership.user.email if membership.user else None,
    )

router = APIRouter(
    tags=["Memberships"],
)


@router.get(
    "/clubs/{club_id}/members",
    response_model=list[MembershipResponse],
)
def read_members(
    club_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return [
        _membership_response(member)
        for member in get_club_members(
            db,
            club_id,
        )
    ]


@router.get(
    "/memberships/{membership_id}",
    response_model=MembershipResponse,
)
def read_membership(
    membership_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    membership = get_membership(
        db,
        membership_id,
    )
    return _membership_response(membership)


@router.patch(
    "/clubs/{club_id}/members/{user_id}/role",
    response_model=MembershipResponse,
)
def change_member_role(
    club_id: UUID,
    user_id: UUID,
    role_data: MembershipRoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_president(
        club_id,
        current_user,
        db,
    )

    return _membership_response(
        update_member_role(
            db,
            club_id,
            user_id,
            role_data.role,
        )
    )


@router.delete(
    "/clubs/{club_id}/members/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_member(
    club_id: UUID,
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_president(
        club_id,
        current_user,
        db,
    )

    remove_member(
        db,
        club_id,
        user_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )