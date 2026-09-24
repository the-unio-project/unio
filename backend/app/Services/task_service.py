from fastapi import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from Models.models import TaskAssignee
from Repositories.task_storage import TaskRepository
from Repositories.user_repo import UserRepository

class TaskService:
    def __init__(self, session: Session):
        self.session = session
        self.user_repo = UserRepository(session)
        self.task_repo = TaskRepository(session)
            
    def assign_task_to_user(self, task_id: UUID, user_id: UUID):
        task = self.task_repo.get_by_id(task_id)
        user = self.user_repo.get_by_id(user_id)
        if task is None:
            raise HTTPException(
                status_code=404,
                detail="Task not found"
            )

        if user is None:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        if self.user_repo.is_member_of_workspace(user, task) is False:
            return "This user is not member of this workspace"

        if self.user_repo.is_already_assigned(user, task):
            return "This user is already assigned to this task"

        return self.user_repo.assign_task_to_user(user_id, task_id)