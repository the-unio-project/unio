from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint, Uuid, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid import UUID, uuid4
from enum import Enum
from app.database.database import Base

class TaskPriority(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class TaskStatus(Enum):
    PENDING = "pending"
    DONE = "done"
    
class User(Base):
    __tablename__ = "users"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(100), nullable=False)
    workspace_memberships: Mapped[list["WorkspaceMember"]] = relationship(back_populates="user")

class Workspace(Base):
    __tablename__ = "workspaces"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    owner_id: Mapped[UUID] = mapped_column(Uuid, ForeignKey("users.id"), nullable=False)
    owner: Mapped["User"] = relationship()
    members: Mapped[list["WorkspaceMember"]] = relationship(back_populates="workspace")
    projects: Mapped[list["Project"]] = relationship(back_populates="workspace")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    logo_url: Mapped[str] = mapped_column(String(100))

class WorkspaceMember(Base):
    __tablename__ = "workspace_members"
    __table_args__ = (
        UniqueConstraint(
            "workspace_id",
            "user_id",
            name="uq_workspace_member"
        ),
    )
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    workspace_id: Mapped[UUID] = mapped_column(Uuid, ForeignKey("workspaces.id"), nullable=False)
    user_id: Mapped[UUID] = mapped_column(Uuid, ForeignKey("users.id"), nullable=False)
    role: Mapped[str] = mapped_column(String(100), nullable=False)
    workspace: Mapped["Workspace"] = relationship(back_populates="members")
    user: Mapped["User"] = relationship(back_populates="workspace_memberships")

class Project(Base):
    __tablename__ = "projects"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    workspace_id: Mapped[UUID] = mapped_column(Uuid, ForeignKey("workspaces.id"), nullable=False)
    workspace: Mapped["Workspace"] = relationship(back_populates="projects")
    lists: Mapped[list["List"]] = relationship(back_populates="project")
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    color: Mapped[str] = mapped_column(String(100), nullable=False)
    icon_url: Mapped[str] = mapped_column(String(100), nullable=True)

class List(Base):
    __tablename__ = "lists"
    id: Mapped[UUID] = mapped_column(Uuid,primary_key=True,default=uuid4)
    project_id: Mapped[UUID] = mapped_column(Uuid,ForeignKey("projects.id"),nullable=False)
    project: Mapped["Project"] = relationship(back_populates="lists")
    tasks: Mapped[list["Task"]] = relationship(back_populates="list")
    name: Mapped[str] = mapped_column(String(100), nullable=False)

class Task(Base):
    __tablename__ = "tasks"
    id: Mapped[UUID] = mapped_column(Uuid,primary_key=True,default=uuid4)
    list_id: Mapped[UUID] = mapped_column(Uuid,ForeignKey("lists.id"),nullable=False)
    task_tags: Mapped[list["TaskTag"]] = relationship(back_populates="task")
    list: Mapped["List"] = relationship(back_populates="tasks")
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(100), nullable=True)
    assignees: Mapped[list["TaskAssignee"]] = relationship(back_populates="task")
    term: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    priority: Mapped[TaskPriority] = mapped_column(Enum(TaskPriority), nullable=False, default=TaskPriority.MEDIUM)
    status: Mapped[TaskStatus] = mapped_column(Enum(TaskStatus), nullable=False, default=TaskStatus.PENDING)

class TaskAssignee(Base):
    __tablename__ = "task_assignees"
    id: Mapped[UUID] = mapped_column(Uuid,primary_key=True,default=uuid4)
    task_id: Mapped[UUID] = mapped_column(Uuid,ForeignKey("tasks.id"),nullable=False)
    user_id: Mapped[UUID] = mapped_column(Uuid, ForeignKey("users.id"), nullable=False)
    task: Mapped["Task"] = relationship(back_populates="assignees")
    user: Mapped["User"] = relationship(back_populates="task_assignments")

class Tag(Base):
    __tablename__ = "tags"
    id: Mapped[UUID] = mapped_column(Uuid,primary_key=True,default=uuid4)
    task_tags: Mapped[list["TaskTag"]] = relationship(back_populates="tag")
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    color: Mapped[str] = mapped_column(String(100), nullable=False)

class TaskTag(Base):
    __tablename__ = "task_tags"
    id: Mapped[UUID] = mapped_column(Uuid,primary_key=True,default=uuid4)
    task_id: Mapped[UUID] = mapped_column(Uuid,ForeignKey("tasks.id"),nullable=False)
    tag_id: Mapped[UUID] = mapped_column(Uuid, ForeignKey("tags.id"), nullable=False)
    task: Mapped["Task"] = relationship(back_populates="task_tags")
    tag: Mapped["Tag"] = relationship(back_populates="task_tags")