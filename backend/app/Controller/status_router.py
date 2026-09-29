from typing import Annotated, List
from fastapi import Depends, HTTPException, APIRouter
from uuid import UUID
from sqlalchemy.orm import Session

from Schemas.status_schema import statusResponseSchema, CreatestatusSchema, DeletestatusSchema, EditstatusSchema
from Database.database import get_session

from Repositories.status_storage import statusRepository
from Services.status_service import statusService

status_router = APIRouter()

SessionDep = Annotated[Session, Depends(get_session)]

@status_router.post("/projects/{project_id}/statuses", response_model=statusResponseSchema)
async def create_status(project_id:UUID, status: CreatestatusSchema, session: SessionDep) -> statusResponseSchema:
    repo = statusRepository(session)
    return repo.create_status(project_id, status)

@status_router.get("/statuses/{status_id}", response_model=statusResponseSchema)
async def read_single_status(status_id: UUID, session: SessionDep) -> statusResponseSchema:
    repo = statusRepository(session)
    status = repo.get_by_id(status_id)
    if status is None:
        raise HTTPException(status_code=404, detail="no status found for id provided")
    return status

@status_router.get("/projects/{project_id}/statuses", response_model=List[statusResponseSchema])
async def list_status(project_id: UUID, session: SessionDep) -> List[statusResponseSchema]:
    repo = statusRepository(session)
    return repo.get_all_workspace(project_id)

@status_router.put("/status/{status_id}", response_model=statusResponseSchema)
async def replace_status(status: CreateStatusSchema, status_id: UUID, session: SessionDep) -> statusResponseSchema:
    repo = statusRepository(session)
    return repo.replace_status(status, status_id)

@status_router.patch("/statuses/{status_id}", response_model=statusResponseSchema)
async def edit_status(status: EditstatusSchema, status_id: UUID, session: SessionDep) -> statusResponseSchema:
    repo = statusRepository(session)
    return repo.edit_status(status, status_id)

@status_router.delete("/statuses/{status_id}", response_model=DeletestatusSchema)
async def delete_status(status_id: UUID, session: SessionDep):
    repo = statusRepository(session)
    return repo.delete_status(status_id)