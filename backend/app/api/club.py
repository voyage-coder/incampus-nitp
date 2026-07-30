from uuid import UUID

from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.club import (
    ClubCreate,
    ClubResponse,
    ClubUpdate,
)
from app.services.club_service import (
    create_club,
    delete_club,
    get_all_clubs,
    get_club_by_id,
    update_club,
)

from app.dependencies.auth import get_current_user
from app.dependencies.roles import require_role

from app.enums.role import UserRole
from app.models.user import User



router = APIRouter(
    prefix="/clubs",
    tags=["Clubs"]
)

# create clubs - admin
@router.post(
    "",
    response_model=ClubResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_club(
    club: ClubCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN])),
):
    return create_club(
        db,
        club,
    )

# all
@router.get(
    "",
    response_model=list[ClubResponse],
)
def read_clubs(
    db: Session = Depends(get_db),
):
    return get_all_clubs(db)

# get individual club
@router.get(
    "/{club_id}",
    response_model=ClubResponse,
)
def read_club(
    club_id: UUID,
    db: Session = Depends(get_db),
):
    return get_club_by_id(
        db,
        club_id,
    )

# updating club - admin or clubhead
@router.patch(
    "/{club_id}",
    response_model=ClubResponse,
)
def edit_club(
    club_id: UUID,
    club: ClubUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN])),
):
    return update_club(
        db,
        club_id,
        club,
    )

# delete club - admin
@router.delete(
    "/{club_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_club(
    club_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN])),
):
    delete_club(db, club_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)