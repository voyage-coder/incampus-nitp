from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.dependencies.auth import get_current_user
from app.dependencies.roles import require_president

from app.models.user import User

from app.schemas.event import (
    EventCreate,
    EventUpdate,
    EventResponse,
)

from app.services.event_service import (
    create_event,
    get_all_events,
    get_event_by_id,
    update_event,
    delete_event,
)

router = APIRouter(
    prefix="/events",
    tags=["Events"],
)

@router.post(
    "/clubs/{club_id}",
    response_model=EventResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_event(
    club_id: UUID,
    event_data: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    require_president(
        club_id,
        current_user,
        db,
    )

    return create_event(
        db,
        club_id,
        event_data,
    )

@router.get(
    "",
    response_model=list[EventResponse],
)
def read_all_events(
    db: Session = Depends(get_db),
):

    return get_all_events(db)

@router.get(
    "/{event_id}",
    response_model=EventResponse,
)
def read_event(
    event_id: UUID,
    db: Session = Depends(get_db),
):

    event = get_event_by_id(
        db,
        event_id,
    )

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found.",
        )

    return event


@router.patch(
    "/{event_id}",
    response_model=EventResponse,
)
def edit_event(
    event_id: UUID,
    event_data: EventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    event = get_event_by_id(
        db,
        event_id,
    )

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found.",
        )

    require_president(
        event.club_id,
        current_user,
        db,
    )

    return update_event(
        db,
        event,
        event_data,
    )

@router.delete(
    "/{event_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_event(
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
            status_code=404,
            detail="Event not found.",
        )

    require_president(
        event.club_id,
        current_user,
        db,
    )

    delete_event(
        db,
        event,
    )