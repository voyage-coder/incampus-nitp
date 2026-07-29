from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.project import (
    ProjectCreate,
    ProjectResponse,
    ProjectUpdate,
)
from app.services.project_service import (
    create_project,
    delete_project,
    get_my_projects,
    get_project_by_id,
    update_project,
)

router = APIRouter(
    tags=["Project"],
)

@router.post(
    "/resume/{resume_id}/project",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project_endpoint(
    resume_id: UUID,
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_project(
        db=db,
        resume_id=resume_id,
        project=project,
        current_user=current_user,
    )

@router.get(
    "/resume/{resume_id}/project",
    response_model=list[ProjectResponse],
)
def get_my_projects_endpoint(
    resume_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_my_projects(
        db=db,
        resume_id=resume_id,
        current_user=current_user,
    )

@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
)
def get_project_by_id_endpoint(
    project_id: UUID,
    db: Session = Depends(get_db),
):
    return get_project_by_id(
        project_id=project_id,
        db=db,
    )


@router.patch(
    "/{project_id}",
    response_model=ProjectResponse,
)
def update_project_endpoint(
    project_id: UUID,
    project: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_project(
        project_id=project_id,
        project_update=project,
        db=db,
        current_user=current_user,
    )


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_200_OK,
)
def delete_project_endpoint(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return delete_project(
        project_id=project_id,
        db=db,
        current_user=current_user,
    )