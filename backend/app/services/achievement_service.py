from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.enums.role import UserRole
from app.models.achievement import Achievement
from app.models.resume import Resume
from app.models.user import User
from app.schemas.achievement import AchievementCreate, AchievementUpdate


def create_achievement(
    db: Session,
    resume_id : UUID,
    achievement: AchievementCreate,
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

    db_achievement = Achievement(
        resume_id=resume.id,
        **achievement.model_dump(),
    )

    db.add(db_achievement)
    db.commit()
    db.refresh(db_achievement)

    return db_achievement


def get_my_achievements(
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
        db.query(Achievement)
        .filter(Achievement.resume_id == resume.id)
        .all()
    )


def get_achievement_by_id(
    achievement_id: UUID,
    db: Session,
):
    achievement = (
        db.query(Achievement)
        .filter(Achievement.id == achievement_id)
        .first()
    )

    if not achievement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Achievement not found.",
        )

    return achievement


def update_achievement(
    achievement_id: UUID,
    achievement_update: AchievementUpdate,
    db: Session,
    current_user: User,
):
    achievement = (
        db.query(Achievement)
        .filter(Achievement.id == achievement_id)
        .first()
    )

    if not achievement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Achievement not found.",
        )

    resume = (
        db.query(Resume)
        .filter(Resume.id == achievement.resume_id)
        .first()
    )

    if (
        resume.user_id != current_user.id
        and current_user.role != UserRole.ADMIN.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this achievement.",
        )

    update_data = achievement_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(achievement, key, value)

    db.commit()
    db.refresh(achievement)

    return achievement


def delete_achievement(
    achievement_id: UUID,
    db: Session,
    current_user: User,
):
    achievement = (
        db.query(Achievement)
        .filter(Achievement.id == achievement_id)
        .first()
    )

    if not achievement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Achievement not found.",
        )

    resume = (
        db.query(Resume)
        .filter(Resume.id == achievement.resume_id)
        .first()
    )

    if (
        resume.user_id != current_user.id
        and current_user.role != UserRole.ADMIN.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this achievement.",
        )

    db.delete(achievement)
    db.commit()

    return {
        "message": "Achievement deleted successfully."
    }