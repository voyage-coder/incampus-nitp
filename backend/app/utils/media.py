from app.core.config import PUBLIC_API_URL


def public_upload_url(value: str | None) -> str | None:
    if not value:
        return None

    text = str(value).strip()
    if not text:
        return None
    if text.startswith(("http://", "https://")):
        return text

    upload_path = text
    if not upload_path.startswith("/uploads/"):
        upload_path = (
            f"/{upload_path}"
            if upload_path.startswith("uploads/")
            else f"/uploads/{upload_path}"
        )

    base = (PUBLIC_API_URL or "").rstrip("/")
    return f"{base}{upload_path}" if base else upload_path
