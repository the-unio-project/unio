from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from Models.models import Task
from Schemas.task_schema import CreateTaskSchema, DeleteTaskSchema, TaskResponseSchema, EditTaskSchema

class TaskRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_task(self, list_id: UUID, task: CreateTaskSchema):
        new_task = Task(**task.model_dump(), list_id=list_id)
        self.session.add(new_task)
        self.session.commit()
        self.session.refresh(new_task)
        return new_task

    def get_by_id(self, task_id: UUID) -> Optional[Task]:
        return self.session.query(Task).filter(Task.id == task_id).first()
    
    def get_all_by_project(self, project_id: UUID) -> List[Task]:
        return self.session.query(Task).join(Task.list_).filter_by(project_id=project_id).all()
    
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
        self.session.delete(task)
        self.session.commit()
        return DeleteTaskSchema(mensagem=f"Tarefa {task.title} deletada com sucesso!", id=task_id)
