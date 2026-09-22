from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from Models.models import Tag
from Schemas.tag_schema import CreateTagSchema, DeleteTagSchema, EditTagSchema, TagResponseSchema

class TagRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_tag(self, project_id: UUID, tag: CreateTagSchema):
        new_tag = Tag(**tag.model_dump(), project_id=project_id)
        self.session.add(new_tag)
        self.session.commit()
        self.session.refresh(new_tag)
        return new_tag

    def get_by_id(self, tag_id: UUID) -> Optional[Tag]:
        return self.session.query(Tag).filter(Tag.id == tag_id).first()

    def delete_tag(self, tag_id: UUID):
        tag = self.get_by_id(tag_id)
        if tag is None:
            return None
        self.session.delete(tag)
        self.session.commit()
        return DeleteTagSchema(mensagem=f"Tag {tag.name} deletada com sucesso!", uuid=tag_id)

    def edit_project(self, new_tag: EditTagSchema, tag_id: UUID):
        tag = self.get_by_id(tag_id)
        if tag is None:
            return None
        update_data = new_tag.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=404, detail="Nenhum dado válido encontrado")
        for field, value in update_data.items():
            setattr(tag, field, value)
        self.session.commit()
        self.session.refresh(tag)
        return tag