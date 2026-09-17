from datetime import datetime
from typing import Annotated, List
from fastapi import Body, Depends, HTTPException, APIRouter
from uuid import UUID, uuid4
from sqlalchemy.orm import Session

from Schemas.project_schema import ProjectResponseSchema, CreateProjectSchema, DeleteProjectSchema, EditProjectSchema
from database.database import get_session

from Models.models import Project
from Repositories.project_storage import ProjectRepository

CRUD_ROUTER = APIRouter()

router = CRUD_ROUTER(
    prefix="/workspaces/{workspace_id}/projects",
    tags=["Projects"]
)

SessionDep = Annotated[Session, Depends(get_session)]

@CRUD_ROUTER.post("/", response_model=ProjectResponseSchema)
async def create_project(project: CreateProjectSchema, session: SessionDep) -> ProjectResponseSchema:
    repo = ProjectRepository(session)
    return repo.create_project(project)

@CRUD_ROUTER.get("/{project_id}", response_model=ProjectResponseSchema)
async def read_single_project(project_id: UUID, session: SessionDep) -> ProjectResponseSchema:
    repo = ProjectRepository(session)
    project = repo.get_by_id(project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="no project found for id provided")
    return project

@CRUD_ROUTER.get("/", response_model=List[ProjectResponseSchema])
async def list_projects(session: SessionDep) -> List[ProjectResponseSchema]:
    repo = ProjectRepository(session)
    return repo.get_all()

@CRUD_ROUTER.put("/{project_id}", response_model=ProjectResponseSchema)
async def replace_project(project: CreateProjectSchema, project_id: UUID, session: SessionDep) -> ProjectResponseSchema:
    repo = ProjectRepository(session)
    return repo.replace_project(project, project_id)

@CRUD_ROUTER.patch("/{project_id}", response_model=ProjectResponseSchema)
async def edit_project(project: EditProjectSchema, project_id: UUID, session: SessionDep) -> ProjectResponseSchema:
    repo = ProjectRepository(session)
    return repo.edit_project(project, project_id)

@CRUD_ROUTER.delete("/{project_id}", response_model=DeleteProjectSchema)
async def delete_project(project_id: UUID, session: SessionDep):
    repo = ProjectRepository(session)
    return repo.delete_project(project_id)