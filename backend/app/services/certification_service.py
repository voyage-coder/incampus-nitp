from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.enums.role import UserRole
from app.models.certification import Certification
from app.models.resume import Resume
from app.models.user import User
from app.schemas.certification import (
    CertificationCreate,
    CertificationUpdate,
)


def create_certification(
    db: Session,
    resume_id:UUID,
    certification: CertificationCreate,
    current_user: User,
):
    resume = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id == current_user.id,
        ).first()
    )

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found.",
        )

    db_certification = Certification(
        resume_id=resume.id,
        **certification.model_dump(),
    )

    db.add(db_certification)
    db.commit()
    db.refresh(db_certification)

    return db_certification


def get_my_certifications(
    db: Session,
    resume_id:UUID,
    current_user: User,
):
    resume = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id == current_user.id,
        ).first()
    )

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found.",
        )

    return (
        db.query(Certification)
        .filter(Certification.resume_id == resume.id)
        .all()
    )


def get_certification_by_id(
    certification_id: UUID,
    db: Session,
):
    certification = (
        db.query(Certification)
        .filter(Certification.id == certification_id)
        .first()
    )

    if not certification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certification not found.",
        )

    return certification


def update_certification(
    certification_id: UUID,
    certification_update: CertificationUpdate,
    db: Session,
    current_user: User,
):
    certification = (
        db.query(Certification)
        .filter(Certification.id == certification_id)
        .first()
    )

    if not certification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certification not found.",
        )

    resume = (
        db.query(Resume)
        .filter(Resume.id == certification.resume_id)
        .first()
    )

    if (
        resume.user_id != current_user.id
        and current_user.role != UserRole.ADMIN.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this certification.",
        )

    update_data = certification_update.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(certification, key, value)

    db.commit()
    db.refresh(certification)

    return certification


def delete_certification(
    certification_id: UUID,
    db: Session,
    current_user: User,
):
    certification = (
        db.query(Certification)
        .filter(Certification.id == certification_id)
        .first()
    )

    if not certification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certification not found.",
        )

    resume = (
        db.query(Resume)
        .filter(Resume.id == certification.resume_id)
        .first()
    )

    if (
        resume.user_id != current_user.id
        and current_user.role != UserRole.ADMIN.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this certification.",
        )

    db.delete(certification)
    db.commit()

    return {
        "message": "Certification deleted successfully."
    }