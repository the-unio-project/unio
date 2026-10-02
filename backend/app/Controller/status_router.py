from typing import Annotated, List
from fastapi import Depends, HTTPException, APIRouter
from uuid import UUID
from sqlalchemy.orm import Session

from Schemas.status_schemas import StatusResponseSchema, CreateStatusSchema, DeleteStatusSchema, UpdateStatusSchema
from Database.database import get_session

from Repositories.status_storage import StatusRepository

status_router = APIRouter()

SessionDep = Annotated[Session, Depends(get_session)]

@status_router.post("/projects/{project_id}/statuses", response_model=StatusResponseSchema)
async def create_status(project_id:UUID, status: CreateStatusSchema, session: SessionDep) -> StatusResponseSchema:
    repo = StatusRepository(session)
    return repo.create_status(project_id, status)

@status_router.get("/statuses/{status_id}", response_model=StatusResponseSchema)
async def read_single_status(status_id: UUID, session: SessionDep) -> StatusResponseSchema:
    repo = StatusRepository(session)
    status = repo.get_by_id(status_id)
    if status is None:
        raise HTTPException(status_code=404, detail="no status found for id provided")
    return status

@status_router.get("/projects/{project_id}/statuses", response_model=List[StatusResponseSchema])
async def list_status(project_id: UUID, session: SessionDep) -> List[StatusResponseSchema]:
    repo = StatusRepository(session)
    return repo.get_all()

@status_router.put("/status/{status_id}", response_model=StatusResponseSchema)
async def replace_status(status: CreateStatusSchema, status_id: UUID, session: SessionDep) -> StatusResponseSchema:
    repo = StatusRepository(session)
    return repo.replace_status(status, status_id)

@status_router.patch("/statuses/{status_id}", response_model=StatusResponseSchema)
async def edit_status(status: UpdateStatusSchema, status_id: UUID, session: SessionDep) -> StatusResponseSchema:
    repo = StatusRepository(session)
    return repo.edit_status(status, status_id)

@status_router.delete("/statuses/{status_id}", response_model=DeleteStatusSchema)
async def delete_status(status_id: UUID, session: SessionDep):
    repo = StatusRepository(session)
    return repo.delete_status(status_id)
