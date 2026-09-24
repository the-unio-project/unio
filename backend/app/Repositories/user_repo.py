from fastapi import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from Models.models import Task, TaskAssignee, User
from Schemas.auth_schemas import RegisterSchema
from Services.Authentication import pwd_handler

class UserRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_user(self, user: RegisterSchema, session: Session) -> User:

        existing_user = session.query(User).filter(User.email == user.email).first()

        if existing_user:
            raise HTTPException(status_code=400, detail="E-mail already registered")

        new_user = User(**user.model_dump())

        new_user.password = pwd_handler.hash_password(new_user.password)

        self.session.add(new_user)
        self.session.commit()
        self.session.refresh(new_user)

        return new_user

    def get_by_id(self, user_id: UUID) -> User | None:
        return self.session.query(User).filter(User.id == user_id).first()

    def get_all(self) -> list[User]:
        return self.session.query(User).order_by(User.created_at.asc()).all()

    def assign_task_to_user(self, user_id: UUID, task_id: UUID) -> TaskAssignee:
        task_assignee = TaskAssignee(
            task_id=task_id,
            user_id=user_id
        )

        self.session.add(task_assignee)
        self.session.commit()
        self.session.refresh(task_assignee)
        return task_assignee

    def is_member_of_workspace(self, user: User, task: Task) -> bool:
        for member in task.list_.project.workspace.members:
            if member.user_id == user.id:
                return True
        return False

    def is_already_assigned(self, user: User, task) -> bool:
        for assignee in task.assignees:
            if assignee.user_id == user.id and assignee.task_id == task.id:
                return True
        return False
