from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.services.pdf_service import PDFService

router = APIRouter(
    prefix="/resume",
    tags=["Resume PDF"],
)


@router.get("/{resume_id}/pdf")
def generate_resume_pdf(
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        pdf_path = PDFService(db).generate_pdf(
            resume_id=resume_id,
            user_id=current_user.id,
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="PDF export failed unexpectedly.",
        ) from exc

    if not pdf_path.exists():
        raise HTTPException(status_code=500, detail="Generated PDF file was not found.")

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename="resume.pdf",
    )