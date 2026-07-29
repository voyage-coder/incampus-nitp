from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.enums.role import UserRole
from app.models.project import Project
from app.models.resume import Resume
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectUpdate


def create_project(
    db: Session,
    resume_id:UUID,
    project: ProjectCreate,
    current_user: User,
):
    # print(project.description)
    # print(type(project.description))
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

    db_project = Project(
        resume_id=resume.id,
        **project.model_dump(),
    )

    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    print(db_project.description)
    print(type(db_project.description))

    return db_project


def get_my_projects(
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
        db.query(Project)
        .filter(Project.resume_id == resume.id)
        .all()
    )


def get_project_by_id(
    project_id: UUID,
    db: Session,
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    return project


def update_project(
    project_id: UUID,
    project_update: ProjectUpdate,
    db: Session,
    current_user: User,
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    resume = (
        db.query(Resume)
        .filter(Resume.id == project.resume_id)
        .first()
    )

    if (
        resume.user_id != current_user.id
        and current_user.role != UserRole.ADMIN.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this project.",
        )

    update_data = project_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(project, key, value)

    db.commit()
    db.refresh(project)

    return project


def delete_project(
    project_id: UUID,
    db: Session,
    current_user: User,
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    resume = (
        db.query(Resume)
        .filter(Resume.id == project.resume_id)
        .first()
    )

    if (
        resume.user_id != current_user.id
        and current_user.role != UserRole.ADMIN.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this project.",
        )

    db.delete(project)
    db.commit()

    return {
        "message": "Project deleted successfully."
    }