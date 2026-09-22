from datetime import datetime
from typing import Annotated, Task
import typing
from fastapi import Body, Depends, HTTPException, APIRouter
from uuid import UUID, uuid4
from sqlalchemy.orm import Session

from Schemas.task_schema import TaskResponseSchema, CreateTaskSchema, DeleteTaskSchema
from Database.database import get_session

from Models.models import Task
from Repositories.task_storage import TaskRepository

task_router = APIRouter()

SessionDep = Annotated[Session, Depends(get_session)]

@task_router.post("/lists/{list_id}/tasks", response_model=TaskResponseSchema)
async def create_Task(list_id: UUID, task: CreateTaskSchema, session: SessionDep) -> TaskResponseSchema:
    repo = TaskRepository(session)
    return repo.create_task(list_id, task)

@task_router.get("/tasks/{task_id}", response_model=TaskResponseSchema)
async def read_single_Task(Task_id: UUID, project_id: UUID, session: SessionDep) -> TaskResponseSchema:
    repo = TaskRepository(session)
    task_model = repo.get_by_id(task_id, project_id)
    if task_model is None:
        raise HTTPException(status_code=404, detail="no Task found for id provided")
    return task_model

@task_router.get("/projects/{project_id}/tasks", response_model=list)
async def list_tasks(session: SessionDep, project_id: UUID) -> list:
    repo = TaskRepository(session)
    return repo.get_all(project_id)

@task_router.put("/tasks/{task_id}", response_model=TaskResponseSchema)
async def replace_task(project: CreateTaskSchema, project_id: UUID, session: SessionDep) -> TaskResponseSchema:
    repo = TaskRepository(session)
    return repo.replace_task(project, project_id)

@project_router.delete("/tasks/{task_id}", response_model=DeleteTaskSchema)
async def delete_task(task_id: UUID, session: SessionDep):
    repo = TaskRepository(session)
    return repo.delete_task(task_id)