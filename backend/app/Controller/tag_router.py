from typing import Annotated
from fastapi import Depends, HTTPException, APIRouter
from uuid import UUID
from sqlalchemy.orm import Session

from Models.models import User
from Schemas.tag_schema import EditTagSchema, TagResponseSchema, CreateTagSchema, DeleteTagSchema
from Database.database import get_session

from Repositories.tag_repo import TagRepository
from Services.Authentication.auth_methods import verify_token
from Services.Permissions.perm_methods import assert_project_member
from Services.Validation.color_validation import validate_color
from Services.tag_service import TagService

tag_router = APIRouter()

SessionDep = Annotated[Session, Depends(get_session)]
CurrentUserDep = Annotated[User, Depends(verify_token)]

@tag_router.post("/projects/{project_id}/tags", response_model=TagResponseSchema)
async def create_tag(project_id: UUID, tag: CreateTagSchema, session: SessionDep) -> TagResponseSchema:
    repo = TagRepository(session)

    if tag.color:
        if not validate_color(tag.color):
            raise HTTPException(status_code=404, detail="Hex Code for colour invalid")


    return repo.create_tag(project_id, tag)

@tag_router.get("/tags/{tag_id}", response_model=TagResponseSchema)
async def read_single_tag(tag_id: UUID, session: SessionDep, current_user: CurrentUserDep) -> TagResponseSchema:
    repo = TagRepository(session)
    tag = repo.get_by_id(tag_id)
    if tag is None:
        raise HTTPException(status_code=404, detail="no tag found for id provided")
    assert_project_member(tag.project_id, current_user.id, session)

    return tag

@tag_router.delete("/tags/{tag_id}", response_model=DeleteTagSchema)
async def delete_tag(tag_id: UUID, session: SessionDep, current_user: CurrentUserDep):
    repo = TagRepository(session)

    tag = repo.get_by_id(tag_id)
    if tag is None:
        raise HTTPException(status_code=404, detail="no tag found for id provided")
    assert_project_member(tag.project_id, current_user.id, session)

    return repo.delete_tag(tag_id)

@tag_router.patch("/tags/{tag_id}")
async def edit_tag(tag_id: UUID, session: SessionDep, schema: EditTagSchema, current_user: CurrentUserDep):
    repo = TagRepository(session)

    tag = repo.get_by_id(tag_id)
    if tag is None:
        raise HTTPException(status_code=404, detail="no tag found for id provided")
    assert_project_member(tag.project_id, current_user.id, session)

    if schema.color:
        if not validate_color(schema.color):
            raise HTTPException(status_code=404, detail="Hex Code for colour invalid")


    return repo.edit_tag(schema, tag_id)

@tag_router.post("/tasks/{task_id}/tags/{tag_id}")
async def apply_tag(task_id: UUID, tag_id: UUID, session: SessionDep, current_user: CurrentUserDep):
    service = TagService(session)
    repo = TagRepository(session)

    tag = repo.get_by_id(tag_id)
    if tag is None:
        raise HTTPException(status_code=404, detail="no tag found for id provided")
    assert_project_member(tag.project_id, current_user.id, session)

    return service.apply_tag(task_id=task_id, tag_id=tag_id)

@tag_router.delete("/tasks/{task_id}/tags/{tag_id}")
async def remove_tag(task_id: UUID, tag_id: UUID, session: SessionDep, current_user: CurrentUserDep):
    service = TagService(session)
    repo = TagRepository(session)

    tag = repo.get_by_id(tag_id)
    if tag is None:
        raise HTTPException(status_code=404, detail="no tag found for id provided")
    assert_project_member(tag.project_id, current_user.id, session)

    return service.remove_tag(task_id=task_id, tag_id=tag_id)
