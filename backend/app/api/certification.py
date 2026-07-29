from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.certification import (
    CertificationCreate,
    CertificationResponse,
    CertificationUpdate,
)
from app.services.certification_service import (
    create_certification,
    delete_certification,
    get_certification_by_id,
    get_my_certifications,
    update_certification,
)

router = APIRouter(
    tags=["Certification"],
)


@router.post(
    "/resume/{resume_id}/certification",
    response_model=CertificationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_certification_endpoint(
    resume_id: UUID,
    certification: CertificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_certification(
        db=db,
        resume_id=resume_id,
        certification=certification,
        current_user=current_user,
    )


@router.get(
    "/resume/{resume_id}/certification",
    response_model=list[CertificationResponse],
)
def get_my_certifications_endpoint(
    resume_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_my_certifications(
        db=db,
        resume_id=resume_id,
        current_user=current_user,
    )


@router.get(
    "/{certification_id}",
    response_model=CertificationResponse,
)
def get_certification_by_id_endpoint(
    certification_id: UUID,
    db: Session = Depends(get_db),
):
    return get_certification_by_id(
        certification_id=certification_id,
        db=db,
    )


@router.patch(
    "/{certification_id}",
    response_model=CertificationResponse,
)
def update_certification_endpoint(
    certification_id: UUID,
    certification: CertificationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_certification(
        certification_id=certification_id,
        certification_update=certification,
        db=db,
        current_user=current_user,
    )


@router.delete(
    "/{certification_id}",
    status_code=status.HTTP_200_OK,
)
def delete_certification_endpoint(
    certification_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return delete_certification(
        certification_id=certification_id,
        db=db,
        current_user=current_user,
    )