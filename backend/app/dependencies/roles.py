from fastapi import Depends, HTTPException, status

from app.dependencies.auth import get_current_user
from app.models.user import User

def require_role(allowed_roles: list[str]):
    def role_checker(
        current_user: User = Depends(get_current_user)
    ):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to perform this action."
            )

        return current_user

    return role_checker

# function inside function
# outside function creates a customized dependency like require_role(["admin"])
# the inner function is what fastapi actually do