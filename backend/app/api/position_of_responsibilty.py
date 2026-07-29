from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.position_of_responsibility import (
    PositionCreate,
    PositionResponse,
    PositionUpdate,
)
from app.services.position_of_responsibility_service import PositionService


router = APIRouter(
    prefix="/positions",
    tags=["Positions of Responsibility"],
)


@router.get(
    "/resume/{resume_id}/position",
    response_model=list[PositionResponse],
)
def get_positions(
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return PositionService(db).get_all(
        resume_id,
        current_user,
    )

@router.post(
    "/resume/{resume_id}/position",
    response_model=PositionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_position(
    resume_id: UUID,
    data: PositionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return PositionService(db).create(
        resume_id,
        data,
        current_user,
    )


@router.put(
    "/resume/{resume_id}/position/{position_id}",
    response_model=PositionResponse,
)
def update_position(
    resume_id: UUID,
    position_id: UUID,
    data: PositionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return PositionService(db).update(
        resume_id,
        position_id,
        data,
        current_user,
    )


@router.delete(
    "/resume/{resume_id}/position/{position_id}",
)
def delete_position(
    resume_id: UUID,
    position_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return PositionService(db).delete(
        resume_id,
        position_id,
        current_user,
    )