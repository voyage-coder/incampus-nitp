from pydantic import BaseModel, model_validator

from app.utils.media import public_upload_url


class ImageUploadResponse(BaseModel):
    filename: str
    url: str = ""

    @model_validator(mode="after")
    def attach_public_url(self):
        self.url = public_upload_url(self.filename) or self.filename
        return self
