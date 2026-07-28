from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.enums.branch import Branch
from app.enums.semester import Semester
from app.models.pyq import Pyq
from app.models.user import User
from app.schemas.pyq import PyqCreate, PyqUpdate


def create_pyq(
    db: Session,
    current_user: User,
    pyq_data: PyqCreate,
) -> Pyq:

    pyq = Pyq(
        user_id=current_user.id,
        subject=pyq_data.subject,
        course_code=pyq_data.course_code,
        branch=pyq_data.branch,
        semester=pyq_data.semester,
        year=pyq_data.year,
        pdf_url=pyq_data.pdf_url,
    )

    db.add(pyq)
    db.commit()
    db.refresh(pyq)

    return pyq


def get_all_pyqs(
    db: Session,
    branch: Branch | None = None,
    semester: Semester | None = None,
    subject: str | None = None,
):
    query = db.query(Pyq)

    if branch:
        query = query.filter(Pyq.branch == branch)

    if semester:
        query = query.filter(Pyq.semester == semester)

    if subject:
        query = query.filter(Pyq.subject.ilike(f"%{subject}%"))

    return (
        query
        .order_by(Pyq.created_at.desc())
        .all()
    )


def get_pyq_by_id(
    db: Session,
    pyq_id: UUID,
) -> Pyq:

    pyq = (
        db.query(Pyq)
        .filter(Pyq.id == pyq_id)
        .first()
    )

    if not pyq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="PYQ not found.",
        )

    return pyq


def update_pyq(
    db: Session,
    pyq: Pyq,
    pyq_data: PyqUpdate,
) -> Pyq:

    update_data = pyq_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(pyq, key, value)

    db.commit()
    db.refresh(pyq)

    return pyq


def delete_pyq(
    db: Session,
    pyq: Pyq,
):
    db.delete(pyq)
    db.commit()