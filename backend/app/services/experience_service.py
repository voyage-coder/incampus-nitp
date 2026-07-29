from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.enums.role import UserRole
from app.models.experience import Experience
from app.models.resume import Resume
from app.models.user import User
from app.schemas.experience import ExperienceCreate, ExperienceUpdate


def create_experience(
    db: Session,
    resume_id: UUID,
    experience: ExperienceCreate,
    current_user: User,
):
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found.",
        )

    db_experience = Experience(
        resume_id=resume.id,
        **experience.model_dump(),
    )

    db.add(db_experience)
    db.commit()
    db.refresh(db_experience)

    return db_experience


def get_my_experiences(
    db: Session,
    resume_id: UUID,
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
        db.query(Experience)
        .filter(Experience.resume_id == resume.id)
        .all()
    )


def get_experience_by_id(
    experience_id: UUID,
    db: Session,
):
    experience = (
        db.query(Experience)
        .filter(Experience.id == experience_id)
        .first()
    )

    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found.",
        )

    return experience


def update_experience(
    experience_id: UUID,
    experience_update: ExperienceUpdate,
    db: Session,
    current_user: User,
):
    experience = (
        db.query(Experience)
        .filter(Experience.id == experience_id)
        .first()
    )

    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found.",
        )

    resume = (
        db.query(Resume)
        .filter(Resume.id == experience.resume_id)
        .first()
    )

    if (
        resume.user_id != current_user.id
        and current_user.role != UserRole.ADMIN.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this experience.",
        )

    update_data = experience_update.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(experience, key, value)

    db.commit()
    db.refresh(experience)

    return experience


def delete_experience(
    experience_id: UUID,
    db: Session,
    current_user: User,
):
    experience = (
        db.query(Experience)
        .filter(Experience.id == experience_id)
        .first()
    )

    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found.",
        )

    resume = (
        db.query(Resume)
        .filter(Resume.id == experience.resume_id)
        .first()
    )

    if (
        resume.user_id != current_user.id
        and current_user.role != UserRole.ADMIN.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this experience.",
        )

    db.delete(experience)
    db.commit()

    return {
        "message": "Experience deleted successfully."
    }
