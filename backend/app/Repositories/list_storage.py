from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from Models.models import ListModel
from Schemas.list_schema import CreateListSchema, ListResponseSchema

class ListRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_List(self, list: CreateListSchema):
        new_list = List(**list.model_dump())
        self.session.add(new_list)
        self.session.commit()
        self.session.refresh(new_list)
        return new_list

    def get_by_id(self, list_id: UUID) -> Optional[ListModel]:
        return self.session.query(ListModel).filter(ListModel.id == list_id).first()
    
    def get_all(self) -> List[ListModel]:
        return self.session.query(ListModel).order_by(ListModel.created_at.asc()).all()