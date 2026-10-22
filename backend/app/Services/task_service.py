from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from uuid import UUID

from Models.models import Project, Status, Task, Workspace
from Repositories.list_repo import ListRepository
from Repositories.status_repo import StatusRepository
from Repositories.task_repo import TaskRepository
from Repositories.user_repo import UserRepository
from Schemas.task_schema import CreateSubtaskSchema, CreateTaskSchema
from Repositories.project_repo import ProjectRepository

from Models.models import Notification, NotificationType

class TaskService:
    def __init__(self, session: Session):
        self.session = session
        self.user_repo = UserRepository(session)
        self.task_repo = TaskRepository(session)
        self.list_repo = ListRepository(session)
        self.status_repo = StatusRepository(session)
        self.project_repo = ProjectRepository(session)

    def verify_access(self, workspace: Workspace, user_id: UUID):
        has_access = (
            workspace.owner_id == user_id
            or any(
                member.user_id == user_id
                for member in workspace.members
            )
        )

        if not has_access:
            raise HTTPException(
                status_code=403,
                detail="You do not have access to this project",
            )

    def get_accessible_project(self, project_id: UUID, user_id: UUID) -> Project:
        project = self.project_repo.get_by_id(project_id)
        if project is None:
            raise HTTPException(status_code=404, detail="Project not found")

        self.verify_access(project.workspace, user_id)
        return project

    def get_accessible_task(self, task_id: UUID, user_id: UUID) -> Task:
        task = self.task_repo.get_by_id(task_id)
        if task is None:
            raise HTTPException(status_code=404, detail="Task not found")

        self.get_accessible_project(task.project_id, user_id)
        return task

    def get_tasks_by_project(self, project_id: UUID, user_id: UUID):
        self.get_accessible_project(project_id, user_id)
        return self.task_repo.get_all_by_project(project_id)

    def verify_project_active(self, project):
        if project.is_archived:
            raise HTTPException(
                status_code=409,
                detail="Unarchive the project before creating tasks",
            )

    def get_position(self, project_id: UUID, status_id: UUID | None) -> int | None:
        if status_id is None:
            return None

        status = self.status_repo.get_by_id(status_id)

        if status is None:
            raise HTTPException(status_code=404, detail="Status not found")

        if status.project_id != project_id:
            raise HTTPException(
                status_code=400,
                detail="Status does not belong to this project",
            )

        last_position = (self.session.query(func.max(Task.position)).filter(Task.status_id == status_id).scalar())

        return (last_position or 0) + 1

    def assign_task_to_user(self, task_id: UUID, user_id: UUID, actor_id: UUID):
        task = self.get_accessible_task(task_id, actor_id)
        project = self.get_accessible_project(task.project_id, actor_id)
        self.verify_project_active(project)
        user = self.user_repo.get_by_id(user_id)
        if user is None:
            raise HTTPException(
                status_code=404,
                detail="User not found",
            )

        workspace = project.workspace
        can_be_assigned = (
            workspace.owner_id == user.id
            or any(
                member.user_id == user.id
                for member in workspace.members
            )
        )

        if not can_be_assigned:
            raise HTTPException(
                status_code=403,
                detail="User does not belong to this workspace",
            )

        try:
            created = self.task_repo.add_assignee(task.id, user.id)
            if created:
                self.session.add(Notification(type=NotificationType.TASK_ASSIGNMENT,type_id=task.id,sender_id=actor_id,recipient_id=user.id))

            self.session.commit()
        except Exception:
            self.session.rollback()
            raise

    def unassign_task_from_user(self, task_id: UUID, user_id: UUID, actor_id: UUID) -> None:
        task = self.get_accessible_task(task_id, actor_id)
        project = self.get_accessible_project(task.project_id, actor_id)
        self.verify_project_active(project)

        try:
            self.task_repo.remove_assignee(task.id, user_id)
            self.session.commit()
        except Exception:
            self.session.rollback()
            raise

    def create_task(self, project_id: UUID, task: CreateTaskSchema, user_id: UUID):

        project = self.project_repo.get_by_id(project_id)

        if project is None:
            raise HTTPException(
                status_code=404,
                detail="Project not found",
            )

        self.verify_access(project.workspace, user_id)
        self.verify_project_active(project)

        position = self.get_position(project_id, task.status_id)

        return self.task_repo.create_task(project_id, task, position)
    
    def create_subtask(self,task_id: UUID, subtask: CreateSubtaskSchema,user_id: UUID):
        parent_task = self.get_accessible_task(task_id, user_id)

        project = self.get_accessible_project(
            parent_task.project_id,
            user_id,
        )
        self.verify_project_active(project)

        subtask_data = subtask.model_dump()
        if subtask_data["term"] is None:
            subtask_data["term"] = parent_task.term

        return self.task_repo.create_subtask(parent_task=parent_task, subtask=CreateSubtaskSchema(**subtask_data))
            
    def create_task_in_list(self, list_id: UUID, task: CreateTaskSchema, user_id: UUID):
        list_model = self.list_repo.get_by_id_only(list_id)

        if list_model is None:
            raise HTTPException(status_code=404, detail="List not found or status not in list")

        self.verify_access(list_model.project.workspace, user_id)
        self.verify_project_active(list_model.project)

        position = self.get_position(list_model.project_id,task.status_id)

        return self.task_repo.create_task_in_list(list_model.project_id, list_model.id, task, position)
        
    def move_inside_status(self, task: Task, status: Status, new_position: int):
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
        same_status = old_status is not None and old_status.id == new_status.id

        max_position = len(new_status.tasks) + (0 if same_status else 1)

        if new_position > max_position:
            raise HTTPException(
                status_code=400,
                detail=f"Position must be at most {max_position}",
            )

        if old_status is not None and old_status.id == new_status.id:
            self.move_inside_status(task, new_status, new_position)

        else:
            self.move_between_statuses(task, old_status, new_status, new_position)

        self.task_repo.commit()

        return task
