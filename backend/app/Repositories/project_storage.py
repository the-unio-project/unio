from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from Models.models import Project
from Schemas.schemas import CreateProjectSchema, DeleteProjectSchema, EditProjectSchema

class ProjectRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_project(self, project: CreateProjectSchema):
        new_project = Project(**project.model_dump())
        self.session.add(new_project)
        self.session.commit()
        self.session.refresh(new_project)
        return new_project

    def get_by_id(self, project_id: UUID) -> Optional[Project]:
            return self.session.query(Project).filter(Project.id == project_id).first()
    
    def get_all(self) -> List[Project]:
        return self.session.query(Project).order_by(Project.created_at.asc()).all()
    
    def replace_project(self, new_project: CreateProjectSchema, project_id: UUID):
        project = self.get_by_id(project_id)
        if project is None:
                return None
        project.name = new_project.name
        project.author = new_project.author
        project.launch_date = new_project.launch_date
        project.genre = new_project.genre
        self.session.commit()
        self.session.refresh(project)
        return project
    
    def edit_project(self, new_project: EditProjectSchema, project_id: UUID):
        project = self.get_by_id(project_id)
        if project is None:
            return None
        update_data = new_project.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=404, detail="Nenhum dado válido encontrado")
        for field, value in update_data.items():
            setattr(project, field, value)
        self.session.commit()
        self.session.refresh(project)
        return project
    
    def delete_project(self, project_id: UUID):
        project = self.get_by_id(project_id)
        if project is None:
            return None
        self.session.delete(project)
        self.session.commit()
        return DeleteProjectSchema(mensagem=f"Livro {project.name} deletado com sucesso!", uuid=project_id)
    