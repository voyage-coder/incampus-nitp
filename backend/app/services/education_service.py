from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.education import Education
from app.models.resume import Resume
from app.models.user import User
from app.schemas.education import EducationCreate, EducationUpdate
from app.enums.role import UserRole


def create_education(
    db: Session,
    resume_id: UUID,
    education: EducationCreate,
    current_user: User,
):
    resume = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id == current_user.id,
        )
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found.",
        )

    db_education = Education(
        resume_id=resume.id,
        **education.model_dump(),
    )

    db.add(db_education)
    db.commit()
    db.refresh(db_education)

    return db_education


def get_my_educations(
    db: Session,
    resume_id: UUID,
    current_user: User,
):
    resume = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id == current_user.id,
        )
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found.",
        )

    return (
        db.query(Education)
        .filter(Education.resume_id == resume.id)
        .all()
    )


def get_education_by_id(
    education_id: UUID,
    db: Session,
):
    education = (
        db.query(Education)
        .filter(Education.id == education_id)
        .first()
    )

    if not education:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education not found.",
        )

    return education


def update_education(
    education_id: UUID,
    education_update: EducationUpdate,
    db: Session,
    current_user: User,
):
    education = (
        db.query(Education)
        .filter(Education.id == education_id)
        .first()
    )

    if not education:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education not found.",
        )

    resume = (
        db.query(Resume)
        .filter(Resume.id == education.resume_id)
        .first()
    )

    if (
        resume.user_id != current_user.id
        and current_user.role != UserRole.ADMIN.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this education.",
        )

    update_data = education_update.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(education, key, value)

    db.commit()
    db.refresh(education)

    return education


def delete_education(
    education_id: UUID,
    db: Session,
    current_user: User,
):
    education = (
        db.query(Education)
        .filter(Education.id == education_id)
        .first()
    )

    if not education:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education not found.",
        )

    resume = (
        db.query(Resume)
        .filter(Resume.id == education.resume_id)
        .first()
    )

    if (
        resume.user_id != current_user.id
        and current_user.role != UserRole.ADMIN.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this education.",
        )

    db.delete(education)
    db.commit()

    return {
        "message": "Education deleted successfully."
    }