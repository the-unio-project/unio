from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from uuid import UUID

from Models.models import Status
from Repositories.status_storage import StatusRepository
from Repositories.project_storage import ProjectRepository

class StatusService:

    def __init__(self, session: Session):
        self.session = session
        self.status_repo = StatusRepository(session)
        self.project_storage = ProjectRepository(session)

    def get_position(self, project_id: UUID) -> int:

        project = self.project_storage.get_by_id(project_id)

        if project is None:
            raise HTTPException(status_code=404, detail="Project not found")

        last_position = (self.session.query(func.max(Status.position)).filter(Status.project_id == project_id).scalar())

        return (last_position or 0) + 1

    def move_status(self, project_id: UUID, status_id: UUID, new_position: int):

        project = self.project_storage.get_by_id(project_id)

        if project is None:
            raise HTTPException(
                status_code=404,
                detail="Project not found"
            )

        status = self.status_repo.get_by_id(status_id)

        if status is None:
            raise HTTPException(
                status_code=404,
                detail="Status not found"
            )

        if status.project_id != project_id:
            raise HTTPException(
                status_code=400,
                detail="Status does not belong to this project"
            )

        max_position = len(project.statuses)

        if new_position > max_position:
            raise HTTPException(
                status_code=400,
                detail=f"Position must be at most {max_position}",
            )

        old_position = status.position

        if new_position < old_position:
            for current_status in project.statuses:
                if (new_position <= current_status.position < old_position and current_status.id != status.id):
                    current_status.position += 1

        if old_position < new_position:
            for current_status in project.statuses:
                if (new_position >= current_status.position > old_position and current_status.id != status.id):
                    current_status.position -= 1

        status.position = new_position

        return status
