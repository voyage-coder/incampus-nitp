from uuid import UUID
from app.models.user import User

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.position_of_responsibilty import PositionOfResponsibility
from app.models.resume import Resume
from app.schemas.position_of_responsibility import (
    PositionCreate,
    PositionUpdate,
)


class PositionService:

    def __init__(self, db: Session):
        self.db = db

    def get_all(
        self,
        resume_id: UUID,
        current_user: User,
    ):
        resume = (
            self.db.query(Resume)
            .filter(
                Resume.id == resume_id,
                Resume.user_id == current_user.id,
            )
            .first()
        )

        if not resume:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume not found.",
            )

        return (
            self.db.query(PositionOfResponsibility)
            .filter(PositionOfResponsibility.resume_id == resume_id)
            .order_by(PositionOfResponsibility.start_date.desc())
            .all()
        )

    def get_by_id(
        self,
        position_id: UUID,
        resume_id: UUID,
    ):

        position = (
            self.db.query(PositionOfResponsibility)
            .filter(
                PositionOfResponsibility.id == position_id,
                PositionOfResponsibility.resume_id == resume_id,
            )
            .first()
        )

        if not position:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Position not found.",
            )

        return position

    def create(
        self,
        resume_id: UUID,
        data: PositionCreate,
        current_user: User,
    ):
        resume = (
            self.db.query(Resume)
            .filter(
                Resume.id == resume_id,
                Resume.user_id == current_user.id,
            )
            .first()
        )

        if not resume:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume not found.",
            )

        position = PositionOfResponsibility(
            resume_id=resume_id,
            **data.model_dump(),
        )

        self.db.add(position)
        self.db.commit()
        self.db.refresh(position)

        return position

    def update(
        self,
        resume_id: UUID,
        position_id: UUID,
        data: PositionUpdate,
        current_user: User,
    ):
        resume = (
            self.db.query(Resume)
            .filter(
                Resume.id == resume_id,
                Resume.user_id == current_user.id,
            )
            .first()
        )

        if not resume:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume not found.",
            )

        position = self.get_by_id(
            position_id,
            resume_id,
        )

        update_data = data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(position, key, value)

        self.db.commit()
        self.db.refresh(position)

        return position

    def delete(
        self,
        resume_id: UUID,
        position_id: UUID,
        current_user: User,
    ):
        resume = (
            self.db.query(Resume)
            .filter(
                Resume.id == resume_id,
                Resume.user_id == current_user.id,
            )
            .first()
        )

        if not resume:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume not found.",
            )

        position = self.get_by_id(
            position_id,
            resume_id,
        )

        self.db.delete(position)
        self.db.commit()

        return {
            "message": "Position deleted successfully."
        }