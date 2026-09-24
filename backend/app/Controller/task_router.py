from datetime import datetime
from typing import Annotated, List
import typing
from fastapi import Body, Depends, HTTPException, APIRouter
from uuid import UUID, uuid4
from sqlalchemy.orm import Session

from Schemas.task_schema import CreateSubtaskSchema, SubtaskResponseSchema, TaskResponseSchema, CreateTaskSchema, DeleteTaskSchema
from Database.database import get_session

from Models.models import Task
from Repositories.task_storage import TaskRepository

task_router = APIRouter()

SessionDep = Annotated[Session, Depends(get_session)]

@task_router.post("/lists/{list_id}/tasks", response_model=TaskResponseSchema)
async def create_task(list_id: UUID, task: CreateTaskSchema, session: SessionDep) -> TaskResponseSchema:
    repo = TaskRepository(session)
    return repo.create_task(list_id, task)

@task_router.get("/tasks/{task_id}", response_model=TaskResponseSchema)
async def read_single_task(task_id: UUID, session: SessionDep) -> TaskResponseSchema:
    repo = TaskRepository(session)
    task_model = repo.get_by_id(task_id)
    if task_model is None:
        raise HTTPException(status_code=404, detail="no Task found for id provided")
    return task_model

@task_router.get("/projects/{project_id}/tasks", response_model=List[TaskResponseSchema])
async def list_tasks(session: SessionDep, project_id: UUID) -> List[TaskResponseSchema]:
    repo = TaskRepository(session)
    return repo.get_all_by_project(project_id)

@task_router.put("/tasks/{task_id}", response_model=TaskResponseSchema)
async def replace_task(task: CreateTaskSchema, task_id: UUID, session: SessionDep) -> TaskResponseSchema:
    repo = TaskRepository(session)
    return repo.replace_task(task, task_id)

@task_router.delete("/tasks/{task_id}", response_model=DeleteTaskSchema)
async def delete_task(task_id: UUID, session: SessionDep):
    repo = TaskRepository(session)
    return repo.delete_task(task_id)

@task_router.post("/tasks/{task_id}/subtasks", response_model=SubtaskResponseSchema)
async def create_subtask(task_id: UUID, task: CreateSubtaskSchema, session: SessionDep) -> SubtaskResponseSchema:
    repo = TaskRepository(session)
    return repo.create_subtask(task_id, task)