from typing import Annotated, List
from fastapi import Depends, HTTPException, APIRouter
from uuid import UUID
from sqlalchemy.orm import Session

from Schemas.project_schema import ProjectResponseSchema, CreateProjectSchema, DeleteProjectSchema, EditProjectSchema
from Database.database import get_session

from Repositories.project_storage import ProjectRepository
from Services.project_service import ProjectService

project_router = APIRouter()

SessionDep = Annotated[Session, Depends(get_session)]

@project_router.post("/{workspace_id}/project/", response_model=ProjectResponseSchema)
async def create_project(workspace_id:UUID, project: CreateProjectSchema, session: SessionDep) -> ProjectResponseSchema:
    repo = ProjectRepository(session)
    return repo.create_project(workspace_id, project)

@project_router.get("/project/{project_id}", response_model=ProjectResponseSchema)
async def read_single_project(project_id: UUID, session: SessionDep) -> ProjectResponseSchema:
    repo = ProjectRepository(session)
    project = repo.get_by_id(project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="no project found for id provided")
    return project

@project_router.get("/{workspace_id}/project/", response_model=List[ProjectResponseSchema])
async def list_projects(workspace_id: UUID, session: SessionDep) -> List[ProjectResponseSchema]:
    repo = ProjectRepository(session)
    return repo.get_all_workspace(workspace_id)

@project_router.put("/project/{project_id}", response_model=ProjectResponseSchema)
async def replace_project(project: CreateProjectSchema, project_id: UUID, session: SessionDep) -> ProjectResponseSchema:
    repo = ProjectRepository(session)
    return repo.replace_project(project, project_id)

@project_router.patch("/project/{project_id}", response_model=ProjectResponseSchema)
async def edit_project(project: EditProjectSchema, project_id: UUID, session: SessionDep) -> ProjectResponseSchema:
    repo = ProjectRepository(session)
    return repo.edit_project(project, project_id)

@project_router.delete("/project/{project_id}", response_model=DeleteProjectSchema)
async def delete_project(project_id: UUID, session: SessionDep):
    repo = ProjectRepository(session)
    return repo.delete_project(project_id)

@project_router.patch("/project/{project_id}/archive", response_model=ProjectResponseSchema)
async def archive_project(project_id: UUID, session: SessionDep) -> ProjectResponseSchema:
    service = ProjectService(session)
    return service.archive_project(session, project_id)

@project_router.patch("/project/{project_id}/unarchive", response_model=ProjectResponseSchema)
async def archive_project(project_id: UUID, session: SessionDep) -> ProjectResponseSchema:
    service = ProjectService(session)
    return service.unarchive_project(session, project_id)
