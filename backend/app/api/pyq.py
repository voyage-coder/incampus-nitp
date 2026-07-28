from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.enums.branch import Branch
from app.enums.role import UserRole
from app.enums.semester import Semester
from app.models.user import User
from app.schemas.pyq import (
    PyqCreate,
    PyqResponse,
    PyqUpdate,
)
from app.services.pyq_service import (
    create_pyq,
    delete_pyq,
    get_all_pyqs,
    get_pyq_by_id,
    update_pyq,
)

router = APIRouter(
    prefix="/pyqs",
    tags=["PYQs"],
)

@router.post(
    "",
    response_model=PyqResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    pyq_data: PyqCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_pyq(
        db,
        current_user,
        pyq_data,
    )



@router.get(
    "",
    response_model=list[PyqResponse],
)
def get_all(
    branch: Branch | None = Query(None),
    semester: Semester | None = Query(None),
    subject: str | None = Query(None),
    db: Session = Depends(get_db),
):
    return get_all_pyqs(
        db,
        branch,
        semester,
        subject,
    )


@router.get(
    "/{pyq_id}",
    response_model=PyqResponse,
)
def get_one(
    pyq_id: UUID,
    db: Session = Depends(get_db),
):
    return get_pyq_by_id(
        db,
        pyq_id,
    )


@router.patch(
    "/{pyq_id}",
    response_model=PyqResponse,
)
def update(
    pyq_id: UUID,
    pyq_data: PyqUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pyq = get_pyq_by_id(
        db,
        pyq_id,
    )

    if (
        pyq.user_id != current_user.id
        and current_user.role != UserRole.ADMIN.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this PYQ.",
        )

    return update_pyq(
        db,
        pyq,
        pyq_data,
    )


@router.delete(
    "/{pyq_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete(
    pyq_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pyq = get_pyq_by_id(
        db,
        pyq_id,
    )

    if (
        pyq.user_id != current_user.id
        and current_user.role != UserRole.ADMIN.value
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this PYQ.",
        )

    delete_pyq(
        db,
        pyq,
    )


