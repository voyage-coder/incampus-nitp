from uuid import UUID

from sqlalchemy.orm import Session

from app.models.event import Event
from app.models.event_registration import EventRegistration
from app.models.user import User
from datetime import datetime, timezone

from fastapi import HTTPException, status

from app.enums.event_status import EventStatus
from app.notifications.enums import NotificationType
from app.notifications.service import create_notification


def register_for_event(
    db: Session,
    event: Event,
    user: User,
) -> EventRegistration:

    if event.status != EventStatus.PUBLISHED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration is allowed only for published events.",
        )

    if datetime.now(timezone.utc) > event.registration_deadline:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration deadline has passed.",
        )

    registrations_count = (
        db.query(EventRegistration)
        .filter(EventRegistration.event_id == event.id)
        .count()
    )

    if registrations_count >= event.max_participants:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event is full.",
        )

    registration = EventRegistration(
        event_id=event.id,
        user_id=user.id,
    )

    db.add(registration)
    create_notification(
        db,
        user_id=user.id,
        title="Event registration confirmed",
        message=f"You are registered for “{event.title}”.",
        type=NotificationType.EVENT_REGISTERED,
        link="/app/events",
    )
    db.commit()
    db.refresh(registration)

    return registration

def get_registration(
    db: Session,
    event_id: UUID,
    user_id: UUID,
):

    return (
        db.query(EventRegistration)
        .filter(
            EventRegistration.event_id == event_id,
            EventRegistration.user_id == user_id,
        )
        .first()
    )


def cancel_registration(
    db: Session,
    registration: EventRegistration,
):

    db.delete(registration)
    db.commit()


def get_event_registrations(
    db: Session,
    event_id: UUID,
):

    return (
        db.query(EventRegistration)
        .filter(EventRegistration.event_id == event_id)
        .all()
    )