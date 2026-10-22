from fastapi import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from Repositories.project_repo import ProjectRepository

class ProjectService:
    def __init__(self, session: Session):
        self.session = session
        self.project_repo = ProjectRepository(session)
                
    def archive_project(self, session: Session, id: UUID):
        project = self.project_repo.get_by_id(id)
        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found"
            )

        if project.is_archived:
            raise HTTPException(
                status_code=400,
                detail="Project already archived",
            )

        return self.project_repo.archive(project)

    def unarchive_project(self, session: Session, id: UUID):
        project = self.project_repo.get_by_id(id)
        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found"
            )

        if not project.is_archived:
            raise HTTPException(
                status_code=400,
                detail="Project is not archived",
            )

        return self.project_repo.unarchive(project)
