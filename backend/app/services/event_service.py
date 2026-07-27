from uuid import UUID

from sqlalchemy.orm import Session

from app.models.club import Club
from app.models.event import Event
from app.schemas.event import EventCreate, EventUpdate
from app.enums.event_status import EventStatus
from fastapi import HTTPException, status


def validate_event_dates(event_data):
    if event_data.start_time >= event_data.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event end time must be after start time.",
        )

    if event_data.registration_deadline > event_data.start_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration deadline must be before or equal to the event start time.",
        )

    

def create_event(
    db: Session,
    club_id: UUID,
    event_data: EventCreate,
) -> Event:

    validate_event_dates(event_data)

    event = Event(
        club_id=club_id,
        title=event_data.title,
        description=event_data.description,
        venue=event_data.venue,
        start_time=event_data.start_time,
        end_time=event_data.end_time,
        registration_deadline=event_data.registration_deadline,
        max_participants=event_data.max_participants,
        banner_url=event_data.banner_url,
        status=EventStatus.DRAFT,
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return event


def get_event_by_id(
    db: Session,
    event_id: UUID,
) -> Event | None:

    return (
        db.query(Event)
        .filter(Event.id == event_id)
        .first()
    )


def get_all_events(db: Session):

    return (
        db.query(Event)
        .order_by(Event.start_time)
        .all()
    )


def update_event(
    db: Session,
    event: Event,
    event_data: EventUpdate,
) -> Event:

    update_data = event_data.model_dump(exclude_unset=True)

    start_time = update_data.get("start_time", event.start_time)
    end_time = update_data.get("end_time", event.end_time)
    registration_deadline = update_data.get(
        "registration_deadline",
        event.registration_deadline,
    )

    if start_time >= end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event end time must be after start time.",
        )

    if registration_deadline > start_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration deadline must be before or equal to the event start time.",
        )

    for key, value in update_data.items():
        setattr(event, key, value)

    db.commit()
    db.refresh(event)

    return event


def delete_event(
    db: Session,
    event: Event,
):

    db.delete(event)
    db.commit()

