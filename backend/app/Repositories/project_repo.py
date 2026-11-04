from hashlib import sha256

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from uuid import UUID

from supabase import Client

from Models.models import Project
from Repositories.profile_repo import validate_image_upload
from Repositories.status_repo import StatusRepository
from Schemas.project_schema import CreateProjectSchema, DeleteProjectSchema, EditProjectSchema

class ProjectRepository:
    def __init__(self, session: Session):
        self.session = session
        self.status_repo = StatusRepository(session)

    def create_project(self, workspace_id:UUID, project: CreateProjectSchema):
        new_project = Project(**project.model_dump(), workspace_id=workspace_id)
        self.session.add(new_project)
        self.session.flush()
        self.session.refresh(new_project)
        return new_project

    def get_by_id(self, project_id: UUID) -> Project:
        project =  self.session.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="No project found")
        return project
    
    def get_all(self) -> list[Project]:
        return self.session.query(Project).order_by(Project.created_at.asc()).all()

    def get_all_workspace(self, workspace_id: UUID):
        return self.session.query(Project).filter(Project.workspace_id == workspace_id).order_by(Project.created_at.asc()).all()
    
    def replace_project(self, new_project: CreateProjectSchema, project_id: UUID):
        project = self.get_by_id(project_id)
        if project is None:
                return None
        project.name = new_project.name
        project.description = new_project.description
        project.color = new_project.color
        self.session.commit()
        self.session.refresh(project)
        return project
    
    def edit_project(self, new_project: EditProjectSchema, project_id: UUID):
        project = self.get_by_id(project_id)
        if project is None:
            return None
        update_data = new_project.model_dump(exclude_unset=True, exclude_none=True)
        if not update_data:
            raise HTTPException(status_code=404, detail="No valid data found")
        for field, value in update_data.items():
            setattr(project, field, value)
        self.session.commit()
        self.session.refresh(project)
        return project

    def update_icon(self, project_id: UUID, logo: UploadFile, supabase: Client):
        project = self.get_by_id(project_id)
        extension = validate_image_upload(logo)
        content = logo.file.read()
        digest = sha256(content).hexdigest()
        path = f"projects/{project_id}/{digest}.{extension}"
        bucket = supabase.storage.from_("profilepictures")
        media_type = "image/png" if extension == "png" else "image/jpeg"
        bucket.upload(path, content, file_options={"content-type": media_type, "upsert": "true"})
        project.icon_url = bucket.get_public_url(path)
        self.session.commit()
        return {"icon_url": project.icon_url}
    
    def delete_project(self, project_id: UUID):
        project = self.get_by_id(project_id)
        if project is None:
            return None
        self.session.delete(project)
        self.session.commit()
        return DeleteProjectSchema(mensagem=f"Project {project.name} deleted successfully!", id=project_id)

    def archive(self, project: Project):
        project.is_archived = True

        self.session.commit()
        self.session.refresh(project)

        return project

    def unarchive(self, project: Project):
        project.is_archived = False
    
        self.session.commit()
        self.session.refresh(project)
    
        return project
