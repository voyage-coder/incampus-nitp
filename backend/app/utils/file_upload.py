import os  # used to work with folders and file paths
import uuid
import shutil # copies uploaded file to the destination

from fastapi import UploadFile, HTTPException

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True) # if folder(uploads) doesn't exist create it
# if it already exists don't throw an error


def save_image(file: UploadFile) -> str:
    allowed_types = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
    ]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG, and WEBP images are allowed.",
        )

    extension = os.path.splitext(file.filename or "")[1] or ".jpg"
    filename = f"{uuid.uuid4()}{extension}"
    file_path = os.path.join(UPLOAD_DIR, filename).replace("\\", "/")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return filename


def save_profile_image(file: UploadFile) -> str:
    return save_image(file)
    