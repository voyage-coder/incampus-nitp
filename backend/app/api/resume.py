from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.resume import (
    ResumeCreate,
    ResumeResponse,
    ResumeUpdate,
)
from app.services.resume_service import (
    create_resume,
    get_my_resume,
    update_resume,
)

router = APIRouter(
    prefix="/resume",
    tags=["Resume"],
)

@router.post(
    "",
    response_model=ResumeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    resume_data: ResumeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_resume(
        db,
        current_user,
        resume_data,
    )


@router.get(
    "/me",
    response_model=ResumeResponse,
)
def get_my_resume_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_my_resume(
        db=db,
        current_user=current_user,
    )


@router.patch(
    "/me",
    response_model=ResumeResponse,
)
def update_my_resume(
    resume_data: ResumeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = get_my_resume(
        db,
        current_user,
    )

    return update_resume(
        db,
        resume,
        resume_data,
    )


