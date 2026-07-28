from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.enums.job_type import JobType
from app.models.placement_experience import PlacementExperience
from app.models.user import User
from app.schemas.placement_experience import (
    PlacementExperienceCreate,
    PlacementExperienceUpdate,
)


def validate_job_details(data):
    if data.job_type == JobType.INTERNSHIP:
        if data.stipend is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Internship requires a stipend.",
            )

        if data.ctc is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Internship should not have a CTC.",
            )

    if data.job_type == JobType.FULL_TIME:
        if data.ctc is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Full-time placement requires a CTC.",
            )

        if data.stipend is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Full-time placement should not have a stipend.",
            )


def create_placement_experience(
    db: Session,
    current_user: User,
    placement_data: PlacementExperienceCreate,
) -> PlacementExperience:

    validate_job_details(placement_data)

    placement = PlacementExperience(
        user_id=current_user.id,
        company=placement_data.company,
        role=placement_data.role,
        job_type=placement_data.job_type,
        cgpa=placement_data.cgpa,
        ctc=placement_data.ctc,
        stipend=placement_data.stipend,
        year=placement_data.year,
        interview_rounds=placement_data.interview_rounds,
        preparation=placement_data.preparation,
        experience=placement_data.experience,
    )

    db.add(placement)
    db.commit()
    db.refresh(placement)

    return placement


def get_all_placement_experiences(db: Session):
    return (
        db.query(PlacementExperience)
        .order_by(PlacementExperience.created_at.desc())
        .all()
    )


def get_placement_experience_by_id(
    db: Session,
    placement_id: UUID,
) -> PlacementExperience:
    placement = (
        db.query(PlacementExperience)
        .filter(PlacementExperience.id == placement_id)
        .first()
    )

    if not placement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Placement experience not found.",
        )

    return placement


def update_placement_experience(
    db: Session,
    placement: PlacementExperience,
    placement_data: PlacementExperienceUpdate,
):

    update_data = placement_data.model_dump(exclude_unset=True)

    job_type = update_data.get("job_type", placement.job_type)
    ctc = update_data.get("ctc", placement.ctc)
    stipend = update_data.get("stipend", placement.stipend)

    if job_type == JobType.INTERNSHIP:
        if stipend is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Internship requires a stipend.",
            )

        if ctc is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Internship should not have a CTC.",
            )

    if job_type == JobType.FULL_TIME:
        if ctc is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Full-time placement requires a CTC.",
            )

        if stipend is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Full-time placement should not have a stipend.",
            )

    for key, value in update_data.items():
        setattr(placement, key, value)

    db.commit()
    db.refresh(placement)

    return placement


def delete_placement_experience(
    db: Session,
    placement: PlacementExperience,
):
    db.delete(placement)
    db.commit()