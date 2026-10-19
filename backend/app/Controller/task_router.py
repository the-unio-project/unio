from datetime import datetime
from typing import Annotated, List, Literal
import typing
from fastapi import Body, Depends, HTTPException, APIRouter
from uuid import UUID, uuid4
from sqlalchemy.orm import Session

from Schemas.task_schema import CreateSubtaskSchema, DashboardTaskSchema, MoveTaskStatusSchema, SubtaskResponseSchema, TaskResponseSchema, CreateTaskSchema, DeleteTaskSchema
from Database.database import get_session

from Models.models import NotificationType, Task, TaskAssignee, User
from Repositories.task_storage import TaskRepository
from Services.Notifications.notification_methods import notify
from Services.task_service import TaskService
from Services.Authentication.auth_methods import verify_token

task_router = APIRouter()

SessionDep = Annotated[Session, Depends(get_session)]
CurrentUserDep = Annotated[User, Depends(verify_token)]

@task_router.post("/projects/{project_id}/tasks", response_model=TaskResponseSchema)
async def create_task(project_id: UUID, task: CreateTaskSchema, session: SessionDep, current_user: CurrentUserDep) -> TaskResponseSchema:
    service = TaskService(session)
    return service.create_task(project_id, task, current_user.id)

@task_router.post("/lists/{list_id}/tasks", response_model=TaskResponseSchema)
async def create_task_in_list(list_id: UUID, task: CreateTaskSchema, session: SessionDep, current_user: CurrentUserDep) -> TaskResponseSchema:
    service = TaskService(session)
    return service.create_task_in_list(list_id, task, current_user.id)

@task_router.get("/tasks/{task_id}", response_model=TaskResponseSchema)
async def read_single_task(task_id: UUID, session: SessionDep, current_user: CurrentUserDep) -> TaskResponseSchema:
    service = TaskService(session)
    return service.get_accessible_task(task_id, current_user.id)

@task_router.get("/projects/{project_id}/tasks", response_model=List[TaskResponseSchema])
async def list_tasks(session: SessionDep, project_id: UUID, current_user: CurrentUserDep) -> List[TaskResponseSchema]:
    service = TaskService(session)
    return service.get_tasks_by_project(project_id, current_user.id)

@task_router.put("/tasks/{task_id}", response_model=TaskResponseSchema)
async def replace_task(task: CreateTaskSchema, task_id: UUID, session: SessionDep) -> TaskResponseSchema:
    repo = TaskRepository(session)
    return repo.replace_task(task, task_id)

@task_router.delete("/tasks/{task_id}", response_model=DeleteTaskSchema)
async def delete_task(task_id: UUID, session: SessionDep):
    repo = TaskRepository(session)
    return repo.delete_task(task_id)

@task_router.post("/tasks/{task_id}/subtasks", response_model=SubtaskResponseSchema)
async def create_subtask(task_id: UUID, subtask: CreateSubtaskSchema,session: SessionDep, current_user: CurrentUserDep) -> SubtaskResponseSchema:
    service = TaskService(session)
    return service.create_subtask(task_id=task_id, subtask=subtask, user_id=current_user.id)

@task_router.post("/tasks/{task_id}/user/{user_id}")
async def assign_task_to_user(task_id: UUID, user_id: UUID, session: SessionDep, current_user: CurrentUserDep):
    service = TaskService(session)
    service.assign_task_to_user(task_id, user_id, current_user.id)

    return {"message": "Successfully assigned task to user."}

@task_router.delete("/tasks/{task_id}/user/{user_id}")
async def unassign_task_from_user(task_id: UUID, user_id: UUID, session: SessionDep, current_user: CurrentUserDep):
    service = TaskService(session)
    service.unassign_task_from_user(task_id, user_id, current_user.id)

    return {"message": "Successfully unassigned task from the user."}

@task_router.patch("/tasks/{task_id}/status", response_model=TaskResponseSchema)
async def move_task(task: MoveTaskStatusSchema, task_id: UUID, session: SessionDep):
    service = TaskService(session)
    return service.move_task(task_id=task_id, status_id=task.status_id, new_position=task.position)

@task_router.get("/me/tasks", response_model=List[DashboardTaskSchema])
async def get_user_tasks(session: SessionDep, current_user: CurrentUserDep, order: Literal["asc", "desc"] = "asc"):
    repo = TaskRepository(session)
    return repo.get_user_tasks(current_user.id, order)

@task_router.get("/me/tasks/due-today", response_model=List[DashboardTaskSchema])
async def get_tasks_due_today(session: SessionDep, current_user: CurrentUserDep):
    repo = TaskRepository(session)
    return repo.get_tasks_due_today(current_user.id)

@task_router.get("/me/tasks/overdue", response_model=List[DashboardTaskSchema])
async def get_tasks_overdue(session: SessionDep, current_user: CurrentUserDep):
    repo = TaskRepository(session)
    return repo.get_overdue_tasks(current_user.id)
