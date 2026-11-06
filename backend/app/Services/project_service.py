from fastapi import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from Repositories.project_repo import ProjectRepository
from Repositories.status_repo import StatusRepository
from Repositories.task_repo import TaskRepository
from Repositories.workspace_repo import WorkspaceRepository
from Schemas.project_schema import CreateProjectSchema
from Services.task_service import TaskService

class ProjectService:
    def __init__(self, session: Session):
        self.session = session
        self.project_repo = ProjectRepository(session)
        self.workspace_repo = WorkspaceRepository(session)
        self.status_repo = StatusRepository(session)
        self.task_service = TaskService(session)

    def create_project(self, workspace_id: UUID, project: CreateProjectSchema, user_id: UUID):

        workspace = self.workspace_repo.get_workspace_by_id(workspace_id)

        if workspace is None:
            raise HTTPException(
                status_code=404,
                detail="Workspace not found",
            )

        self.task_service.verify_access(workspace, user_id)
        new_project = self.project_repo.create_project(workspace_id, project)
        self.status_repo.create_default_statuses(new_project.id)
        self.session.commit()
        self.session.refresh(new_project)
        return new_project
    
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
