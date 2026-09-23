from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from Models.models import ListModel
from Schemas.list_schema import CreateListSchema, ListResponseSchema

class ListRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_list(self, project_id: UUID, list: CreateListSchema):
        new_list = ListModel(**list.model_dump(), project_id=project_id)
        self.session.add(new_list)
        self.session.commit()
        self.session.refresh(new_list)
        return new_list

    def get_by_id(self, list_id: UUID, project_id: UUID) -> Optional[ListModel]:
        return self.session.query(ListModel).filter(ListModel.id == list_id, ListModel.project_id == project_id).first()
    
    def get_all_by_project(self, project_id: UUID) -> List[ListModel]:
        return self.session.query(ListModel).filter(ListModel.project_id == project_id).all()
