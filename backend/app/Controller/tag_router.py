from datetime import datetime
from typing import Annotated, List
import typing
from fastapi import Body, Depends, HTTPException, APIRouter
from uuid import UUID, uuid4
from sqlalchemy.orm import Session

from Schemas.tag_schema import EditTagSchema, TagResponseSchema, CreateTagSchema, DeleteTagSchema
from Database.database import get_session

from Models.models import Tag
from Repositories.tag_storage import TagRepository

tag_router = APIRouter()

SessionDep = Annotated[Session, Depends(get_session)]

@tag_router.post("/projects/{project_id}/tags", response_model=TagResponseSchema)
async def create_tag(project_id: UUID, tag: CreateTagSchema, session: SessionDep) -> TagResponseSchema:
    repo = TagRepository(session)
    return repo.create_tag(project_id, tag)

@tag_router.delete("/tags/{tag_id}", response_model=DeleteTagSchema)
async def delete_tag(tag_id: UUID, session: SessionDep):
    repo = TagRepository(session)
    return repo.delete_tag(tag_id)

@tag_router.patch("/tags/{tag_id}", response_model=EditTagSchema)
async def edit_tag(tag_id: UUID, session: SessionDep):
    repo = TagRepository(session)
    return repo.edit_tag(tag_id)