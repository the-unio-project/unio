from datetime import datetime
from typing import Annotated, List
from fastapi import Body, Depends, HTTPException, APIRouter
from uuid import UUID, uuid4
from sqlalchemy.orm import Session

from Schemas.schemas import ProjectResponseSchema, ProjectBookSchema, DeleteProjectSchema, EditProjectSchema
from database.database import get_session

from Models.models import Project
from Repositories.static_storage import ProjectRepository

CRUD_ROUTER = APIRouter()
SessionDep = Annotated[Session, Depends(get_session)]


