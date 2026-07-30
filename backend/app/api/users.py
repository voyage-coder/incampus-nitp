from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.user import UserContactResponse, UserProfileResponse, UserUpdate
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

@router.put(
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

@router.get(
    "/{user_id}/contact",
    response_model=UserContactResponse,
)
def get_user_contact(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot request your own contact details.",
        )

    user = db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )
    return user