from sqlalchemy.orm import Session
from sqlalchemy import select
import os
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserProfileResponse, UserUpdate
from fastapi import UploadFile
from app.utils.file_upload import save_profile_image
from app.utils.url import normalize_profile_url
UPLOAD_DIR = "uploads"

PROFILE_SETUP_BRANCH = "TBD"


def is_profile_complete(user: User) -> bool:
    roll = user.roll_number or ""
    return bool(roll.strip()) and user.branch != PROFILE_SETUP_BRANCH and not roll.startswith("G-")


def serialize_user_profile(user: User) -> UserProfileResponse:
    return UserProfileResponse(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        roll_number=user.roll_number,
        branch=user.branch,
        year=user.year,
        role=str(user.role or "student"),
        bio=user.bio,
        phone=user.phone,
        github=user.github or None,
        linkedin=user.linkedin or None,
        portfolio=user.portfolio or None,
        profile_image=user.profile_image,
        is_active=bool(user.is_active),
        is_verified=bool(user.is_verified),
        profile_complete=is_profile_complete(user),
    )

def get_user_profile(current_user: User) -> UserProfileResponse:
    return serialize_user_profile(current_user)

def update_user_profile(
    db: Session,
    current_user: User,
    user_update: UserUpdate,
):
    update_data = user_update.model_dump(exclude_unset=True, mode="json")

    if "roll_number" in update_data and update_data["roll_number"]:
        roll_number = update_data["roll_number"].strip().upper()
        update_data["roll_number"] = roll_number
        existing = db.execute(
            select(User).where(
                User.roll_number == roll_number,
                User.id != current_user.id,
            )
        ).scalar_one_or_none()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Roll number already registered.",
            )

    for field in ("github", "linkedin", "portfolio"):
        if field in update_data:
            update_data[field] = normalize_profile_url(update_data[field])

    for field, value in update_data.items():
        setattr(current_user, field, value)

    try:
        db.commit()
    except:
        db.rollback()
        raise
    db.refresh(current_user)

    return serialize_user_profile(current_user)

def upload_profile_image(
    db: Session,
    current_user: User,
    file: UploadFile,
):
    if current_user.profile_image:
        old_image_path = os.path.join(UPLOAD_DIR, current_user.profile_image)

        if os.path.exists(old_image_path):
            os.remove(old_image_path)

    # file_path = save_profile_image(file)

    # current_user.profile_image = file_path
    filename = save_profile_image(file)
    current_user.profile_image = filename
    # now the db store the returned path instead of actual image
    # db.commit()
    try:
        db.commit()
    except:
        db.rollback()
        raise
    db.refresh(current_user)

    return serialize_user_profile(current_user)