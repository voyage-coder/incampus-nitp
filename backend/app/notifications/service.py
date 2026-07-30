from uuid import UUID

from sqlalchemy.orm import Session

from app.models.membership import Membership, MembershipRole
from app.notifications.enums import NotificationType
from app.notifications.models import Notification


def create_notification(
    db: Session,
    *,
    user_id: UUID,
    title: str,
    message: str,
    type: NotificationType,
    link: str | None = None,
) -> Notification:
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=type,
        link=link,
    )
    db.add(notification)
    return notification


def notify_club_presidents(
    db: Session,
    *,
    club_id: UUID,
    title: str,
    message: str,
    type: NotificationType,
    link: str | None = None,
) -> None:
    presidents = (
        db.query(Membership)
        .filter(
            Membership.club_id == club_id,
            Membership.role == MembershipRole.PRESIDENT,
        )
        .all()
    )
    for membership in presidents:
        create_notification(
            db,
            user_id=membership.user_id,
            title=title,
            message=message,
            type=type,
            link=link,
        )


def get_user_notifications(db: Session, user_id: UUID) -> list[Notification]:
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .all()
    )


def get_unread_count(db: Session, user_id: UUID) -> int:
    return (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.is_read.is_(False),
        )
        .count()
    )


def mark_notification_read(
    db: Session,
    notification_id: UUID,
    user_id: UUID,
) -> Notification | None:
    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.user_id == user_id,
        )
        .first()
    )
    if not notification:
        return None
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification


def mark_all_read(db: Session, user_id: UUID) -> int:
    updated = (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.is_read.is_(False),
        )
        .update({Notification.is_read: True})
    )
    db.commit()
    return updated
