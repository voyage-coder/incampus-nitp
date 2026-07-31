import shutil

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def home():
    return {"message": "Welcome to Nitp"}


@router.get("/health")
def health():
    if shutil.which("tectonic"):
        pdf_engine = "tectonic"
    elif shutil.which("pdflatex"):
        pdf_engine = "pdflatex"
    else:
        pdf_engine = None

    return {
        "status": "ok",
        "pdf_engine": pdf_engine,
        "pdf_ready": pdf_engine is not None,
    }
