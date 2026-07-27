from uuid import UUID

from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.roles import require_role

from app.enums.role import UserRole
from app.models.user import User

from app.schemas.user import UserResponse, UpdateRole

from app.services.auth_service import (
    get_all_users,
    update_user_role,
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


@router.get(
    "/users",
    response_model=list[UserResponse],
)
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role([UserRole.ADMIN])
    ),
):
    return get_all_users(db)


@router.patch(
    "/users/{user_id}/role",
    response_model=UserResponse,
)
def change_user_role(
    user_id: UUID,
    role_data: UpdateRole,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role([UserRole.ADMIN])
    ),
):
    return update_user_role(
        db,
        user_id,
        role_data,
    )