from fastapi import APIRouter, HTTPException

from sqlalchemy.orm import Session
from fastapi import Depends

from app.db.session import get_db
from app.dependencies.roles import require_role
from app.models.user import User
from app.schemas.user import UserResponse, UpdateRole
from uuid import UUID
from app.services.auth_service import get_all_users, update_user_role

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

@router.get(
    "/users",
    response_model=list[UserResponse]
)
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(["admin"])
    )
):
    return get_all_users(db)

# updating role
@router.patch(
    "/users/{user_id}/role",
    response_model=UserResponse
)
def change_role(
    # user_id: int,
    user_id: UUID,
    role_data: UpdateRole,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(["admin"])
    )
):
    user = update_user_role(
        db,
        user_id,
        role_data.role
    )
    # if user not found
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    return user
# but ryt now this api accepts any string like role["banana"]
# we will improvve this by introducing enums