from typing import Annotated
from fastapi import Depends, HTTPException, APIRouter
from uuid import UUID
from sqlalchemy.orm import Session

from Schemas.list_schema import DeleteListSchema, EditListSchema, ListResponseSchema, CreateListSchema
from Database.database import get_session

from Repositories.list_repo import ListRepository

from Models.models import Project, User, WorkspaceRole
from Repositories.project_repo import ProjectRepository
from Services.Authentication.auth_methods import verify_token
from Services.Permissions.perm_methods import assert_project_permission

list_router = APIRouter()

SessionDep = Annotated[Session, Depends(get_session)]
CurrentUserDep = Annotated[User, Depends(verify_token)]


def get_accessible_project(project_id: UUID, session: SessionDep, user: CurrentUserDep) -> Project:

    # Perm Check Start
    assert_project_permission(project_id, WorkspaceRole.ADMIN, user.id, session)
    # Perm Check End

    project = ProjectRepository(session).get_by_id(project_id)
    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not Found."
        )

    return project

AccessibleProjectDep = Annotated[Project, Depends(get_accessible_project)]

@list_router.post("/", response_model=ListResponseSchema)
async def create_list(project_id: UUID, list: CreateListSchema, session: SessionDep, user: CurrentUserDep) -> ListResponseSchema:

    # Perm Check Start
    assert_project_permission(project_id, WorkspaceRole.ADMIN, user.id, session)
    # Perm Check End

    repo = ListRepository(session)

    return repo.create_list(project_id, list)

@list_router.get("/{list_id}", response_model=ListResponseSchema)
async def read_single_list(list_id: UUID, project_id: UUID, session: SessionDep, user: CurrentUserDep) -> ListResponseSchema:

    # Perm Check Start
    assert_project_permission(project_id, WorkspaceRole.MEMBER, user.id, session)
    # Perm Check End

    repo = ListRepository(session)
    list_model = repo.get_by_id(list_id, project_id)
    if list_model is None:
        raise HTTPException(status_code=404, detail="no list found for id provided")
    return list_model

@list_router.get("/", response_model=list[ListResponseSchema])
async def list_lists(session: SessionDep, project_id: UUID, user: CurrentUserDep) -> list[ListResponseSchema]:

    # Perm Check Start
    assert_project_permission(project_id, WorkspaceRole.MEMBER, user.id, session)
    # Perm Check End

    repo = ListRepository(session)
    return repo.get_all_by_project(project_id)

@list_router.patch("/{list_id}", response_model=ListResponseSchema)
async def edit_list(list_model: EditListSchema, session: SessionDep, list_id: UUID, project: AccessibleProjectDep, user: CurrentUserDep) -> EditListSchema:

    # Perm Check Start
    assert_project_permission(project.id, WorkspaceRole.ADMIN, user.id, session)
    # Perm Check End

    repo = ListRepository(session)
    result = repo.edit_list(list_model, list_id, project.id)
    if result is None:
        raise HTTPException(
            status_code=404,
            detail="list not found in this project."
        )
    return result

@list_router.delete("/{list_id}", response_model=DeleteListSchema)
async def delete_list(session: SessionDep, list_id: UUID, project_id: UUID, user: CurrentUserDep) -> DeleteListSchema:

    # Perm Check Start
    assert_project_permission(project_id, WorkspaceRole.ADMIN, user.id, session)
    # Perm Check End

    repo = ListRepository(session)
    result = repo.delete_list(list_id, project_id)
    if result is None:
        raise HTTPException(
            status_code=404,
            detail="list not found in this project."
        )
    return result
