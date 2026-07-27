from sqlalchemy.orm import Session
import os
from app.models.user import User
from app.schemas.user import UserUpdate
from fastapi import UploadFile
from app.utils.file_upload import save_profile_image
UPLOAD_DIR = "uploads"
def get_user_profile(current_user: User):
    return current_user

def update_user_profile(
    db: Session,
    current_user: User,
    user_update: UserUpdate,
):
    update_data = user_update.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(current_user, field, value)

    try:
        db.commit()
    except:
        db.rollback()
        raise
    db.refresh(current_user)

    return current_user

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

    return current_user