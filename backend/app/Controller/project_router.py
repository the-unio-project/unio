from typing import Annotated
from fastapi import Depends, HTTPException, APIRouter
from uuid import UUID
from sqlalchemy.orm import Session

from Services.Authentication.auth_methods import verify_token
from Models.models import Project, User, WorkspaceRole
from Schemas.project_schema import ProjectResponseSchema, CreateProjectSchema, DeleteProjectSchema, EditProjectSchema
from Database.database import get_session

from Repositories.project_repo import ProjectRepository
from Services.Permissions.perm_methods import assert_project_member, assert_workspace_member, assert_workspace_permission
from Services.project_service import ProjectService

project_router = APIRouter()

SessionDep = Annotated[Session, Depends(get_session)]
CurrentUserDep = Annotated[User, Depends(verify_token)]

def get_accessible_project(project_id: UUID, session: SessionDep, user: CurrentUserDep) -> Project:
    repo = ProjectRepository(session)
    project = repo.get_by_id(project_id)

    if project is None:
        raise HTTPException(status_code=404, detail="Project not Found")

    assert_workspace_member(project.workspace_id, user.id, session)
    return project

AccessibleProjectDep = Annotated[Project, Depends(get_accessible_project)]

def get_manageable_project(project_id: UUID, session: SessionDep, user: CurrentUserDep) -> Project:
    repo = ProjectRepository(session)
    project = repo.get_by_id(project_id)

    if project is None:
        raise HTTPException(status_code=404, detail="Project not Found")

    assert_workspace_permission(project.workspace.id, WorkspaceRole.ADMIN, user.id, session)
    return project

ManageableProjectDep = Annotated[Project, Depends(get_manageable_project)]

@project_router.post("/{workspace_id}/project/", response_model=ProjectResponseSchema)
async def create_project(workspace_id: UUID, project: CreateProjectSchema, session: SessionDep, user: CurrentUserDep) -> ProjectResponseSchema:
    assert_workspace_permission(workspace_id, WorkspaceRole.ADMIN, user.id, session)
    service = ProjectService(session)
    return service.create_project(workspace_id, project, user.id)

@project_router.get("/project/{project_id}", response_model=ProjectResponseSchema)
async def read_single_project(project: AccessibleProjectDep):
    return project

@project_router.get("/{workspace_id}/project/", response_model=list[ProjectResponseSchema])
async def get_accessible_projects(workspace_id: UUID, session: SessionDep, user: User = Depends(verify_token)) -> list[ProjectResponseSchema]:
    assert_workspace_member(workspace_id, user.id, session)
    repo = ProjectRepository(session)
    return repo.get_all_workspace(workspace_id)

@project_router.put("/project/{project_id}", response_model=ProjectResponseSchema)
async def replace_project(project: CreateProjectSchema, current_project: ManageableProjectDep, session: SessionDep, user: User = Depends(verify_token)) -> ProjectResponseSchema:
    assert_project_member(current_project.id, user.id, session)
    repo = ProjectRepository(session)
    return repo.replace_project(project, current_project.id)

@project_router.patch("/project/{project_id}", response_model=ProjectResponseSchema)
async def edit_project(project: EditProjectSchema, current_project: ManageableProjectDep, session: SessionDep, user: User = Depends(verify_token)) -> ProjectResponseSchema:
    assert_project_member(current_project.id, user.id, session)
    repo = ProjectRepository(session)
    return repo.edit_project(project, current_project.id)

@project_router.delete("/project/{project_id}", response_model=DeleteProjectSchema)
async def delete_project(current_project: ManageableProjectDep, session: SessionDep, user: User = Depends(verify_token)):
    assert_project_member(current_project.id, user.id, session)
    repo = ProjectRepository(session)
    return repo.delete_project(current_project.id)

@project_router.patch("/project/{project_id}/archive", response_model=ProjectResponseSchema)
async def archive_project(project: ManageableProjectDep, session: SessionDep, user: User = Depends(verify_token)) -> ProjectResponseSchema:
    assert_project_member(project.id, user.id, session)
    service = ProjectService(session)
    return service.archive_project(session, project.id)

@project_router.patch("/project/{project_id}/unarchive", response_model=ProjectResponseSchema)
async def unarchive_project(project: ManageableProjectDep, session: SessionDep, user: User = Depends(verify_token)) -> ProjectResponseSchema:
    assert_project_member(project.id, user.id, session)
    service = ProjectService(session)
    return service.unarchive_project(session, project.id)
