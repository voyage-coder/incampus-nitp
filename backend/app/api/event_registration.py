from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.roles import require_president

from app.models.user import User

from app.schemas.event_registration import EventRegistrationResponse

from app.services.event_service import get_event_by_id
from app.services.event_registration_service import (
    register_for_event,
    get_registration,
    cancel_registration,
    get_event_registrations,
)

router = APIRouter(
    prefix="/events",
    tags=["Event Registration"],
)

@router.post(
    "/{event_id}/register",
    response_model=EventRegistrationResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    event_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    event = get_event_by_id(db, event_id)

    if event is None:
        raise HTTPException(404, "Event not found.")

    existing = get_registration(
        db,
        event.id,
        current_user.id,
    )

    if existing:
        raise HTTPException(
            400,
            "Already registered.",
        )

    return register_for_event(
        db,
        event,
        current_user,
    )

@router.post(
    "/{event_id}/register",
    response_model=EventRegistrationResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    event_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    event = get_event_by_id(db, event_id)

    if event is None:
        raise HTTPException(404, "Event not found.")

    existing = get_registration(
        db,
        event.id,
        current_user.id,
    )

    if existing:
        raise HTTPException(
            400,
            "Already registered.",
        )

    return register_for_event(
        db,
        event,
        current_user,
    )


@router.get(
    "/{event_id}/registrations",
    response_model=list[EventRegistrationResponse],
)
def view_registrations(
    event_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    event = get_event_by_id(
        db,
        event_id,
    )

    if event is None:
        raise HTTPException(
            404,
            "Event not found.",
        )

    require_president(
        event.club_id,
        current_user,
        db,
    )

    return get_event_registrations(
        db,
        event.id,
    )


