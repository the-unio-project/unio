from datetime import datetime
from typing import Annotated, List
import typing
from fastapi import Body, Depends, HTTPException, APIRouter
from uuid import UUID, uuid4
from sqlalchemy.orm import Session

from Schemas.task_schema import CreateSubtaskSchema, MoveTaskStatusSchema, SubtaskResponseSchema, TaskResponseSchema, CreateTaskSchema, DeleteTaskSchema
from Database.database import get_session

from Models.models import Task
from Repositories.task_storage import TaskRepository
from Services.task_service import TaskService

task_router = APIRouter()

SessionDep = Annotated[Session, Depends(get_session)]

@task_router.post("/projects/{project_id}/tasks", response_model=TaskResponseSchema)
async def create_task(project_id: UUID, task: CreateTaskSchema, session: SessionDep) -> TaskResponseSchema:
    repo = TaskRepository(session)
    return repo.create_task(project_id, task)

@task_router.post("/lists/{list_id}/tasks", response_model=TaskResponseSchema)
async def create_task_in_list(list_id: UUID, task: CreateTaskSchema, session: SessionDep) -> TaskResponseSchema:
    service = TaskRepository(session)
    return service.create_task_in_list(list_id, task)

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

@task_router.post("/tasks/{task_id}/user/{user_id}")
async def assign_task_to_user(task_id: UUID, user_id: UUID, session: SessionDep):
    service = TaskService(session)
    return service.assign_task_to_user(task_id, user_id)

@task_router.patch("/tasks/{task_id}/status", response_model=TaskResponseSchema)
async def change_task_status(task_id: UUID, status_id: UUID, session: SessionDep):
    repo = TaskRepository(session)
    return repo.change_task_status(task_id, status_id)

@task_router.patch("/tasks/{task_id}/status", response_model=MoveTaskStatusSchema)
async def move_task(task_id: UUID, session: SessionDep):
    service = TaskService(session)
    return service.move_task(task_id)