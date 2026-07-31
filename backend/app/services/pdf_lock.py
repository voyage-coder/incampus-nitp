import threading
from contextlib import contextmanager

from fastapi import HTTPException, status

PDF_BUSY_MESSAGE = "PDF export is busy. Please try again in a moment."

_lock = threading.Lock()


@contextmanager
def pdf_compile_slot():
    acquired = _lock.acquire(blocking=False)
    if not acquired:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=PDF_BUSY_MESSAGE,
        )
    try:
        yield
    finally:
        _lock.release()
