from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.user import UserProfileResponse, UserUpdate
from app.services.user_service import (
    get_user_profile,
    update_user_profile,
    upload_profile_image
)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/me", response_model=UserProfileResponse)
def read_my_profile(
    current_user: User = Depends(get_current_user),
):
    return get_user_profile(current_user)

@router.patch("/me", response_model=UserProfileResponse)
def update_my_profile(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_user_profile(
        db=db,
        current_user=current_user,
        user_update=user_update,
    )

@router.post(
    "/me/profile-image",
    response_model=UserProfileResponse,
)
def upload_my_profile_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return upload_profile_image(
        db=db,
        current_user=current_user,
        file=file,
    )