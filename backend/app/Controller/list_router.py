from datetime import datetime
from typing import Annotated, List
import typing
from fastapi import Body, Depends, HTTPException, APIRouter
from uuid import UUID, uuid4
from sqlalchemy.orm import Session

from Schemas.list_schema import ListResponseSchema, CreateListSchema
from Database.database import get_session

from Models.models import ListModel
from Repositories.list_storage import ListRepository

list_router = APIRouter()

SessionDep = Annotated[Session, Depends(get_session)]

@list_router.post("/", response_model=ListResponseSchema)
async def create_list(project_id: UUID, list: CreateListSchema, session: SessionDep) -> ListResponseSchema:
    repo = ListRepository(session)
    return repo.create_list(project_id, list)

@list_router.get("/{list_id}", response_model=ListResponseSchema)
async def read_single_list(list_id: UUID, project_id: UUID, session: SessionDep) -> ListResponseSchema:
    repo = ListRepository(session)
    list_model = repo.get_by_id(list_id, project_id)
    if list_model is None:
        raise HTTPException(status_code=404, detail="no list found for id provided")
    return list_model

@list_router.get("/", response_model=list[ListResponseSchema])
async def list_lists(session: SessionDep, project_id: UUID) -> list[ListResponseSchema]:
    repo = ListRepository(session)
    return repo.get_all_by_project(project_id)