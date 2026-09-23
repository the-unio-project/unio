from fastapi import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from Repositories.project_storage import ProjectRepository

class ProjectService:
    def __init__(self, session: Session):
            self.session = session
            
    def archive_project(session: Session, id: UUID):
        project = ProjectRepository.get_by_id(id)
        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found"
            )

        if project.is_archived:
            raise HTTPException(
                status_code=400,
                detail="Project already archived"
            )

        return ProjectRepository.archive(session, id)

    def unarchive_project(session: Session, id: UUID):
        project = ProjectRepository.get_by_id(id)
        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found"
            )

        if project.is_archived:
            raise HTTPException(
                status_code=400,
                detail="Project already archived"
            )

        return ProjectRepository.unarchive(session, id)
