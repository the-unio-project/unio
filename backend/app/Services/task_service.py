from fastapi import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from Models.models import Status, Task, TaskAssignee
from Repositories.list_storage import ListRepository
from Repositories.status_storage import StatusRepository
from Repositories.task_storage import TaskRepository
from Repositories.user_repo import UserRepository
from Schemas.task_schema import CreateTaskSchema

class TaskService:
    def __init__(self, session: Session):
        self.session = session
        self.user_repo = UserRepository(session)
        self.task_repo = TaskRepository(session)
        self.list_repo = ListRepository(session)
        self.status_repo = StatusRepository(session)
            
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

    def create_task_in_list(self,list_id: UUID,task: CreateTaskSchema):
        list_model = self.list_repo.get_by_id(list_id)

        if list_model is None:
            raise HTTPException(
                status_code=404,
                detail="List not found"
            )

        if task.status_id is not None:
            status = self.status_repo.get_by_id(task.status_id)

            if status is None:
                raise HTTPException(
                    status_code=404,
                    detail="Status not found"
                )

            if status.project_id != list_model.project_id:
                raise HTTPException(
                    status_code=400,
                    detail="Status does not belong to this project"
                )

        return self.task_repo.create_task_in_list(project_id=list_model.project_id, list_id=list_model.id, task=task)
        
    def move_inside_status(self, task: Task, status: Status, new_position: UUID):
        tasks = sorted(status.tasks, key=lambda t: t.position)
        old_position = task.position
        if new_position < old_position:
            for current_task in tasks:
                if (new_position <= current_task.position < old_position and current_task.id != task.id):
                    current_task.position += 1

        if old_position < new_position:
            for current_task in tasks:
                if (new_position >= current_task.position > old_position and current_task.id != task.id):
                    current_task.position -= 1

        task.position = new_position

    def move_between_statuses(self, task: Task, old_status: Status, new_status: Status, new_position: int):
        if old_status is not None:
            for current_task in old_status.tasks:
                if (current_task.id != task.id and current_task.position > task.position):
                    current_task.position -= 1

        for current_task in new_status.tasks:
            if current_task.position >= new_position:
                current_task.position += 1

        task.status = new_status
        task.position = new_position

    def move_task(self, task_id: UUID, status_id: UUID, new_position: int):
        task = self.task_repo.get_by_id(task_id)

        if task is None:
            raise HTTPException(
                status_code=404,
                detail="Task not found"
            )

        new_status = self.status_repo.get_by_id(status_id)

        if new_status is None:
            raise HTTPException(
                status_code=404,
                detail="Status not found"
            )

        if new_status.project_id != task.project_id:
            raise HTTPException(
                status_code=400,
                detail="Status does not belong to this project"
            )

        old_status = task.status

        if old_status is not None and old_status.id == new_status.id:
            self.move_inside_status(task, new_status, new_position)

        else:
            self.move_between_statuses(task, old_status, new_status, new_position)

        self.task_repo.commit()

        return task