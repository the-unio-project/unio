from datetime import datetime
from typing import Annotated, List
from fastapi import Body, Depends, HTTPException, APIRouter
from uuid import UUID, uuid4
from sqlalchemy.orm import Session

from Schemas.list_schema import ListResponseSchema, CreateListSchema
from database.database import get_session

from Models.models import List
from Repositories.list_storage import ListRepository

CRUD_ROUTER = APIRouter()

router = CRUD_ROUTER(
    prefix="/projects/{project_id}/lists",
    tags=["Lists"]
)

SessionDep = Annotated[Session, Depends(get_session)]

@CRUD_ROUTER.post("/", response_model=ListResponseSchema)
async def create_list(list: CreateListSchema, session: SessionDep) -> ListResponseSchema:
    repo = ListRepository(session)
    return repo.create_list(list)

@CRUD_ROUTER.get("/{list_id}", response_model=ListResponseSchema)
async def read_single_list(list_id: UUID, session: SessionDep) -> ListResponseSchema:
    repo = ListRepository(session)
    list = repo.get_by_id(list_id)
    if list is None:
        raise HTTPException(status_code=404, detail="no list found for id provided")
    return list

@CRUD_ROUTER.get("/", response_model=List[ListResponseSchema])
async def list_lists(session: SessionDep) -> List[ListResponseSchema]:
    repo = ListRepository(session)
    return repo.get_all()