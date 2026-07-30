from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas.education import (
    EducationCreate,
    EducationResponse,
    EducationUpdate,
)
from app.services.education_service import (
    create_education,
    delete_education,
    get_education_by_id,
    get_my_educations,
    update_education,
)
from app.dependencies.auth import get_current_user

router = APIRouter(tags=["Education"])

@router.post(
    "/resume/{resume_id}/education",
    response_model=EducationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_education_endpoint(
    resume_id: UUID,
    education: EducationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_education(
        db=db,
        resume_id=resume_id,
        education=education,
        current_user=current_user,
    )


@router.get(
    "/resume/{resume_id}/education",
    response_model=list[EducationResponse],
)
def get_resume_educations(
    resume_id: UUID,
    db: Session =Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_my_educations(
        db=db,
        resume_id=resume_id,
        current_user=current_user,
    )


@router.get(
    "/educations/{education_id}",
    response_model=EducationResponse,
)
def get_education_by_id_endpoint(
    education_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_education_by_id(
        education_id=education_id,
        db=db,
    )


@router.patch(
    "/educations/{education_id}",
    response_model=EducationResponse,
)
def update_education_endpoint(
    education_id: UUID,
    education: EducationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_education(
        education_id=education_id,
        education_update=education,
        db=db,
        current_user=current_user,
    )


@router.delete(
    "/educations/{education_id}",
    status_code=status.HTTP_200_OK,
)
def delete_education_endpoint(
    education_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return delete_education(
        education_id=education_id,
        db=db,
        current_user=current_user,
    )