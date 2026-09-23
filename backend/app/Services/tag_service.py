from fastapi import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from Repositories.tag_storage import TagRepository
from Repositories.task_storage import TaskRepository

class TagService:
    def __init__(self, session: Session):
        self.session = session
        self.tag_repo = TagRepository(session)
        self.task_repo = TaskRepository(session)

    def apply_tag(self, task_id: UUID, tag_id: UUID):
        task = self.task_repo.get_by_id(task_id)
        tag = self.tag_repo.get_by_id(tag_id)
        if task is None:
            raise HTTPException(
                status_code=404,
                detail="Task not found"
            )

        if tag is None:
            raise HTTPException(
                status_code=404,
                detail="Tag not found"
            )

        if task.list_.project_id != tag.project_id:
            raise HTTPException(
                status_code=400,
                detail="Tag and task must belong to the same project"
            )

        if self.tag_repo.is_applied(task_id, tag_id):
            raise HTTPException(
                status_code=409,
                detail="Tag is already applied to this task"
            )

        return self.tag_repo.apply_tag(task_id, tag_id)

    def remove_tag(self, task_id: UUID, tag_id: UUID):
        task = self.task_repo.get_by_id(task_id)
        tag = self.tag_repo.get_by_id(tag_id)
        if task is None:
            raise HTTPException(
                status_code=404,
                detail="Task not found"
            )

        if tag is None:
            raise HTTPException(
                status_code=404,
                detail="Tag not found"
            )

        if self.tag_repo.is_applied(task_id, tag_id) is False:
            raise HTTPException(
                status_code=409,
                detail="This tag is not applied to this task"
            )

        return self.tag_repo.remove_tag(task_id, tag_id)