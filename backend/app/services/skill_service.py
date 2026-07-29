from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.enums.role import UserRole
from app.models.resume import Resume
from app.models.skill import Skill
from app.models.user import User
from app.schemas.skill import SkillCreate, SkillUpdate


def create_skill(
    db: Session,
    resume_id: UUID,
    skill: SkillCreate,
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

    db_skill = Skill(
        resume_id=resume.id,
        **skill.model_dump(),
    )

    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)

    return db_skill


def get_my_skills(
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
        db.query(Skill)
        .filter(Skill.resume_id == resume.id)
        .all()
    )


def get_skill_by_id(
    skill_id: UUID,
    db: Session,
):
    skill = (
        db.query(Skill)
        .filter(Skill.id == skill_id)
        .first()
    )

    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found.",
        )

    return skill


def update_skill(
    skill_id: UUID,
    skill_update: SkillUpdate,
    db: Session,
    current_user: User,
):
    skill = (
        db.query(Skill)
        .filter(Skill.id == skill_id)
        .first()
    )

    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found.",
        )

    resume = (
        db.query(Resume)
        .filter(Resume.id == skill.resume_id)
        .first()
    )

    if (
        resume.user_id != current_user.id
        and current_user.role != UserRole.ADMIN.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this skill.",
        )

    update_data = skill_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(skill, key, value)

    db.commit()
    db.refresh(skill)

    return skill


def delete_skill(
    skill_id: UUID,
    db: Session,
    current_user: User,
):
    skill = (
        db.query(Skill)
        .filter(Skill.id == skill_id)
        .first()
    )

    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found.",
        )

    resume = (
        db.query(Resume)
        .filter(Resume.id == skill.resume_id)
        .first()
    )

    if (
        resume.user_id != current_user.id
        and current_user.role != UserRole.ADMIN.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this skill.",
        )

    db.delete(skill)
    db.commit()

    return {
        "message": "Skill deleted successfully."
    }