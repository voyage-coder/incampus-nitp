import os  # used to work with folders and file paths
import uuid
import shutil # copies uploaded file to the destination

from fastapi import UploadFile, HTTPException

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True) # if folder(uploads) doesn't exist create it
# if it already exists don't throw an error


def save_profile_image(file: UploadFile) -> str:
    # validate file type
    allowed_types = [
        "image/jpeg",
        "image/png",
        "image/jpg",
    ]
    # if uploaded pdf content type is application/pdf

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPG and PNG images are allowed."
        )
    # generate a unique filename
    extension = os.path.splitext(file.filename)[1]
    # file.filename is profile.png
    # split returns ("profile", ".png") here [1] means .png
    # we preserve the original extension
    filename = f"{uuid.uuid4()}{extension}"
    # buid the filepath
    # file_path = os.path.join(
    #     UPLOAD_DIR,
    #     filename
    # )
    file_path = os.path.join(UPLOAD_DIR, filename)
    # Convert Windows backslashes to forward slashes
    file_path = file_path.replace("\\", "/")
    # this becomes uploads/8ac17d7f.png
    # save the file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # wb means write binary - images are binary files
    # buffer is destination file - new empty image file
    # copyfileobj copies uploaded image to uploads/
    # return the path
    # return file_path
    return filename
    # if the uploaded file is abc.png the function returns uploads/8ac17d7f.png
    