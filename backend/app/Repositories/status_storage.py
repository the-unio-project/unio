from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from Models.models import Status
from Schemas.status_schemas import CreateStatusSchema, DeleteStatusSchema, UpdateStatusSchema, StatusResponseSchema

class StatusRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_status(self, project_id:UUID, status: CreateStatusSchema):
        new_status = Status(**status.model_dump(), project_id=project_id)
        self.session.add(new_status)
        self.session.commit()
        self.session.refresh(new_status)
        return new_status

    def get_by_id(self, status_id: UUID) -> Optional[StatusResponseSchema]:
        return self.session.query(Status).filter(Status.id == status_id).first()
    
    def get_all(self) -> List[StatusResponseSchema]:
        return self.session.query(Status).all()

    def replace_status(self, new_status: CreateStatusSchema, status_id: UUID):
        status = self.get_by_id(status_id)
        if status is None:
                return None
        status.name = new_status.name
        # status.description = new_status.description
        status.color = new_status.color
        # status.icon_url = new_status.icon_url
        self.session.commit()
        self.session.refresh(status)
        return status
    
    def edit_status(self, new_status: UpdateStatusSchema, status_id: UUID):
        status = self.get_by_id(status_id)
        if status is None:
            return None
        update_data = new_status.model_dump(exclude_unset=True, exclude_none=True)
        if not update_data:
            raise HTTPException(status_code=404, detail="Nenhum dado válido encontrado")
        for field, value in update_data.items():
            setattr(status, field, value)
        self.session.commit()
        self.session.refresh(status)
        return status

    def delete_status(self, status_id: UUID):
        status = self.get_by_id(status_id)
        if status is None:
            raise HTTPException(status_code=404, detail="Status not found")
        for task in list(status.tasks):
            task.status = None
            task.position = None
        self.session.flush()
        self.session.delete(status)
        self.session.commit()
        return DeleteStatusSchema(message=f"Status {status.name} deletado com sucesso!", id=status_id)
    
