from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload

from app.models.resume import Resume
from app.models.user import User
from app.schemas.resume import ResumeCreate, ResumeUpdate


def create_resume(
    db: Session,
    current_user: User,
    resume_data: ResumeCreate,
) -> Resume:

    resume = Resume(
        user_id=current_user.id,
        name=resume_data.name,
        headline=resume_data.headline,
        summary=resume_data.summary,
        template=resume_data.template,
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return resume


def get_my_resume(
    db: Session,
    current_user: User,
):
    resume = (
        db.query(Resume)
        .options(
            joinedload(Resume.educations),
            joinedload(Resume.experiences),
            joinedload(Resume.projects),
            joinedload(Resume.skills),
            joinedload(Resume.achievements),
            joinedload(Resume.certifications),
            joinedload(Resume.positions_of_responsibility),
        )
        .filter(Resume.user_id == current_user.id)
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found.",
        )

    return resume

def update_resume(
    db: Session,
    resume: Resume,
    resume_data: ResumeUpdate,
) -> Resume:

    update_data = resume_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(resume, key, value)

    db.commit()
    db.refresh(resume)

    return resume