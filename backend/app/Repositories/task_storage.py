from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from Models.models import task
from Schemas.task_schema import CreatetaskSchema, DeleteTaskSchema, DeletetaskSchema, EdittaskSchema

class taskRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_task(self, list_id: UUID, task: CreateTaskSchema):
        new_task = task(**task.model_dump(), list_id=list_id)
        self.session.add(new_task)
        self.session.commit()
        self.session.refresh(new_task)
        return new_task

    def get_by_id(self, task_id: UUID) -> Optional[task]:
        return self.session.query(task).filter(task.id == task_id).first()
    
    def get_all(self) -> List[task]:
        return self.session.query(task).order_by(task.created_at.asc()).all()
    
    def replace_task(self, new_task: CreateTaskSchema, task_id: UUID):
        task = self.get_by_id(task_id)
        if task is None:
                return None
        task.name = new_task.name
        task.description = new_task.description
        task.color = new_task.color
        task.icon_url = new_task.icon_url
        self.session.commit()
        self.session.refresh(task)
        return task
    
    def edit_task(self, new_task: EditTaskSchema, task_id: UUID):
        task = self.get_by_id(task_id)
        if task is None:
            return None
        update_data = new_task.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=404, detail="Nenhum dado válido encontrado")
        for field, value in update_data.items():
            setattr(task, field, value)
        self.session.commit()
        self.session.refresh(task)
        return task
    
    def delete_task(self, task_id: UUID):
        task = self.get_by_id(task_id)
        if task is None:
            return None
        self.session.delete(task)
        self.session.commit()
        return DeleteTaskSchema(mensagem=f"Tarefa {task.name} deletado com sucesso!", uuid=task_id)