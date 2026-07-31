from fastapi import APIRouter
from pathlib import Path

from app.utils.pdf_engine import get_pdf_engine_name, resolve_pdf_engine

router = APIRouter()


@router.get("/")
def home():
    return {"message": "Welcome to Nitp"}


@router.get("/health")
def health():
    pdf_engine = get_pdf_engine_name()

    return {
        "status": "ok",
        "pdf_engine": pdf_engine,
        "pdf_ready": pdf_engine is not None,
        "pdf_path": resolve_pdf_engine(),
        "base_dir": str(Path(__file__).resolve().parents[2]),
    }
