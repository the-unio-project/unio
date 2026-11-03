from typing import Annotated
from fastapi import Depends, HTTPException, APIRouter
from uuid import UUID
from sqlalchemy.orm import Session

from Models.models import User
from Schemas.status_schemas import StatusResponseSchema, CreateStatusSchema, DeleteStatusSchema, UpdateStatusSchema
from Database.database import get_session

from Repositories.status_repo import StatusRepository
from Services.Authentication.auth_methods import verify_token
from Services.Permissions.perm_methods import assert_project_member
from Services.Statuses.status_service import StatusService

status_router = APIRouter()

SessionDep = Annotated[Session, Depends(get_session)]
CurrentUserDep = Annotated[User, Depends(verify_token)]

@status_router.post("/projects/{project_id}/statuses", response_model=StatusResponseSchema)
async def create_status(project_id:UUID, status: CreateStatusSchema, session: SessionDep, user: CurrentUserDep) -> StatusResponseSchema:
    repo = StatusRepository(session)
    service = StatusService(session)

    assert_project_member(project_id, user.id, session)

    position = service.get_position(project_id)
        
    status_obj = repo.create_status(project_id, position, status)

@status_router.get("/statuses/{status_id}", response_model=StatusResponseSchema)
async def read_single_status(status_id: UUID, session: SessionDep, user: CurrentUserDep) -> StatusResponseSchema:
    repo = StatusRepository(session)

    status = repo.get_by_id(status_id)
    
    assert_project_member(status.project_id, user.id, session)

    if status is None:
        raise HTTPException(status_code=404, detail="no status found for id provided")
    return status

@status_router.get("/projects/{project_id}/statuses", response_model=list[StatusResponseSchema])
async def list_status(project_id: UUID, session: SessionDep, user: CurrentUserDep) -> list[StatusResponseSchema]:
    repo = StatusRepository(session)

    assert_project_member(project_id, user.id, session)

    return repo.get_by_project(project_id)

@status_router.put("/status/{status_id}", response_model=StatusResponseSchema)
async def replace_status(status: CreateStatusSchema, status_id: UUID, session: SessionDep, user: CurrentUserDep) -> StatusResponseSchema:
    repo = StatusRepository(session)

    project = repo.get_by_id(status_id)

    assert_project_member(project.id, user.id, session)

    return repo.replace_status(status, status_id)

@status_router.patch("/statuses/{status_id}", response_model=StatusResponseSchema)
async def edit_status(status: UpdateStatusSchema, status_id: UUID, session: SessionDep, user: CurrentUserDep) -> StatusResponseSchema:
    repo = StatusRepository(session)

    project = repo.get_by_id(status_id)
    
    assert_project_member(project.id, user.id, session)

    return repo.edit_status(status, status_id)

@status_router.delete("/statuses/{status_id}", response_model=DeleteStatusSchema)
async def delete_status(status_id: UUID, session: SessionDep, user: CurrentUserDep):
    repo = StatusRepository(session)

    project = repo.get_by_id(status_id)

    assert_project_member(project.id, user.id, session)

    return repo.delete_status(status_id)
