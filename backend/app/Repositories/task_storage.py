from datetime import datetime, timedelta

from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from Models.models import Task, TaskAssignee
from Repositories.status_storage import StatusRepository
from Schemas.task_schema import CreateTaskSchema, DeleteTaskSchema, TaskResponseSchema, EditTaskSchema

class TaskRepository:
    def __init__(self, session: Session):
        self.session = session
        self.status_repo = StatusRepository(session)

    def create_task(self, project_id: UUID, task: CreateTaskSchema, position: int | None, list_id: UUID | None = None):
        new_task = Task(**task.model_dump(), project_id=project_id, position=position, list_id=list_id)
        self.session.add(new_task)
        self.session.commit()
        self.session.refresh(new_task)
        return new_task

    def create_task_in_list(self, project_id: UUID, list_id: UUID, task: CreateTaskSchema, position: int | None):
        return self.create_task(project_id=project_id, task=task, position=position, list_id=list_id)

    def create_subtask(self, task_id: UUID, task: CreateTaskSchema):
        new_subtask = Task(**task.model_dump(), task_id=task_id)
        self.session.add(new_subtask)
        self.session.commit()
        self.session.refresh(new_subtask)
        return new_subtask

    def get_by_id(self, task_id: UUID) -> Optional[Task]:
        return self.session.query(Task).filter(Task.id == task_id).first()
    
    def get_all_by_project(self, project_id: UUID) -> List[Task]:
        return self.session.query(Task).filter(Task.project_id == project_id).order_by(Task.status_id, Task.position, Task.id)
    
    def replace_task(self, new_task: CreateTaskSchema, task_id: UUID):
        task = self.get_by_id(task_id)
        if task is None:
            return None
        task.title = new_task.title
        task.description = new_task.description
        task.term = new_task.term
        task.priority = new_task.priority
        self.session.commit()
        self.session.refresh(task)
        return task
    
    def delete_task(self, task_id: UUID):
        task = self.get_by_id(task_id)
        if task is None:
            return None
        if task.status_id is not None:
            following_tasks = self.session.query(Task).filter(Task.status_id == task.status_id, Task.position > task.position).all()
            for current_task in following_tasks:
                current_task.position -= 1
        self.session.delete(task)
        self.session.commit()
        return DeleteTaskSchema(mensagem=f"Tarefa {task.title} deletada com sucesso!", id=task_id)

    def get_user_tasks(self, user_id: UUID):
        return self.session.query(Task).join(TaskAssignee, TaskAssignee.task_id == Task.id).filter(TaskAssignee.user_id == user_id).all()

    def get_tasks_due_today(self, user_id: UUID):
        today = datetime.now().date
        start = datetime.combine(today, datetime.min.time())
        end = start + timedelta(days=1)
        return self.session.query(Task).join(TaskAssignee, TaskAssignee.task_id == Task.id).filter(TaskAssignee.user_id == user_id, Task.term >= start, Task.term < end)

    def get_overdue_tasks(self, user_id: UUID):
        now = datetime.now()
        return self.session.query(Task).join(TaskAssignee, TaskAssignee.task_id == Task.id).filter(TaskAssignee.user_id == user_id, Task.term < now).all()

    def commit(self):
        self.session.commit()