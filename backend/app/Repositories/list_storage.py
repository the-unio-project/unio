from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from Models.models import ListModel
from Schemas.list_schema import CreateListSchema, DeleteListSchema, EditListSchema, ListResponseSchema

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

    def get_by_id_only(self, list_id: UUID) -> Optional[ListModel]:
        return self.session.query(ListModel).filter(ListModel.id == list_id).first()
    
    def get_all_by_project(self, project_id: UUID) -> List[ListModel]:
        return self.session.query(ListModel).filter(ListModel.project_id == project_id).all()

    def edit_list(self, new_list: EditListSchema, list_id: UUID, project_id: UUID):
        list_model = self.get_by_id(list_id, project_id)
        if list_model is None:
            return None
        update_data = new_list.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=404, detail="Nenhum dado válido encontrado")
        for field, value in update_data.items():
            setattr(list_model, field, value)
        self.session.commit()
        self.session.refresh(list_model)
        return list_model

    def delete_list(self, list_id: UUID, project_id: UUID):
        list_model = self.get_by_id(list_id, project_id)
        if list_model is None:
            return None
        self.session.delete(list_model)
        self.session.commit()
        return DeleteListSchema(mensagem=f"list {list_model.name} deletada com sucesso!", id=list_id)
