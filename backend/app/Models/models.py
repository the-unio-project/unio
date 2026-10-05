from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, UniqueConstraint, Uuid, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.ext.declarative import declarative_base
from uuid import UUID, uuid4
import enum

Base = declarative_base()

class TaskPriority(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class WorkspaceRole(enum.Enum):
    OWNER = 2
    ADMIN = 1
    MEMBER = 0

class NotificationType(enum.Enum):
    WORKSPACE_INVITE = "invited to workspace"
    TASK_ASSIGNMENT = "assigned to task"
    COMMENT_MENTION = "mentioned in a comment"
    ASSIGNEE_COMMENT = "someone commented ur task"
    
class User(Base):
    __tablename__ = "users"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(100), nullable=False)
    workspace_memberships: Mapped[list["WorkspaceMember"]] = relationship(back_populates="user")
    task_assignments: Mapped[list["TaskAssignee"]] = relationship(back_populates="user")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    nickname: Mapped[str] = mapped_column(String(100), nullable=False)
    bio: Mapped[str] = mapped_column(String(300), nullable=False)
    profile_picture: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

class Workspace(Base):
    __tablename__ = "workspaces"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    owner_id: Mapped[UUID] = mapped_column(Uuid, ForeignKey("users.id"), nullable=False)
    owner: Mapped["User"] = relationship()
    members: Mapped[list["WorkspaceMember"]] = relationship("WorkspaceMember",back_populates="workspace", passive_deletes=True)
    invites: Mapped[list["WorkspaceInvite"]] = relationship(back_populates="workspace", passive_deletes=True)
    projects: Mapped[list["Project"]] = relationship("Project", back_populates="workspace", passive_deletes=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    logo_url: Mapped[str] = mapped_column(String(100), nullable=True)

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
    workspace_id: Mapped[UUID] = mapped_column(Uuid, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[UUID] = mapped_column(Uuid, ForeignKey("users.id"), nullable=False)
    role: Mapped[WorkspaceRole] = mapped_column(Enum(WorkspaceRole, name="role_enum"), nullable=False, default=WorkspaceRole.MEMBER)
    workspace: Mapped["Workspace"] = relationship("Workspace", back_populates="members")
    user: Mapped["User"] = relationship(back_populates="workspace_memberships")

class WorkspaceInvite(Base):
    __tablename__ = "workspace_invites"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    workspace_id: Mapped[UUID] = mapped_column(Uuid, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    workspace: Mapped["Workspace"] = relationship(back_populates="invites")

class Project(Base):
    __tablename__ = "projects"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    workspace_id: Mapped[UUID] = mapped_column(Uuid, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    workspace: Mapped["Workspace"] = relationship("Workspace", back_populates="projects")
    lists: Mapped[list["ListModel"]] = relationship(back_populates="project")
    tags: Mapped[list["Tag"]] = relationship(back_populates="project")
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    color: Mapped[str] = mapped_column(String(100), nullable=False)
    icon_url: Mapped[str] = mapped_column(String(100), nullable=True)
    is_archived: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    statuses: Mapped[list["Status"]] = relationship(
        "Status",
        back_populates="project",
        passive_deletes=True
    )

class ListModel(Base):
    __tablename__ = "lists"
    id: Mapped[UUID] = mapped_column(Uuid,primary_key=True,default=uuid4)
    project_id: Mapped[UUID] = mapped_column(Uuid,ForeignKey("projects.id", ondelete="CASCADE"),nullable=False)
    project: Mapped["Project"] = relationship(back_populates="lists")
    tasks: Mapped[list["Task"]] = relationship(back_populates="list_", passive_deletes=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)

class Task(Base):
    __tablename__ = "tasks"
    id: Mapped[UUID] = mapped_column(Uuid,primary_key=True,default=uuid4)
    task_id: Mapped[UUID] = mapped_column(Uuid,ForeignKey("tasks.id"),nullable=True)
    list_id: Mapped[UUID] = mapped_column(Uuid,ForeignKey("lists.id", ondelete="CASCADE"),nullable=False)
    task_tags: Mapped[list["TaskTag"]] = relationship(back_populates="task")
    list_: Mapped["ListModel"] = relationship(back_populates="tasks")
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(100), nullable=True)
    assignees: Mapped[list["TaskAssignee"]] = relationship(back_populates="task")
    term: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    priority: Mapped[TaskPriority] = mapped_column(Enum(TaskPriority, name="task_priority_enum"), nullable=False, default=TaskPriority.MEDIUM)
    status_id: Mapped[UUID | None] = mapped_column(
        Uuid,
        ForeignKey("statuses.id", ondelete="SET NULL"),
        nullable=True
    )
    status: Mapped["Status | None"] = relationship(
        "Status",
        back_populates="tasks"
    )
    comments: Mapped[list["Comment"]] = relationship(back_populates="task")

class TaskAssignee(Base):
    __tablename__ = "task_assignees"
    __table_args__ = (
        UniqueConstraint("task_id", "user_id", name="uq_task_assignee"),
    )
    id: Mapped[UUID] = mapped_column(Uuid,primary_key=True,default=uuid4)
    task_id: Mapped[UUID] = mapped_column(Uuid,ForeignKey("tasks.id"),nullable=False)
    user_id: Mapped[UUID] = mapped_column(Uuid, ForeignKey("users.id"), nullable=False)
    task: Mapped["Task"] = relationship(back_populates="assignees")
    user: Mapped["User"] = relationship(back_populates="task_assignments")

class Tag(Base):
    __tablename__ = "tags"
    id: Mapped[UUID] = mapped_column(Uuid,primary_key=True,default=uuid4)
    project_id: Mapped[UUID] = mapped_column(Uuid, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    project: Mapped["Project"] = relationship(back_populates="tags")
    task_tags: Mapped[list["TaskTag"]] = relationship(back_populates="tag")
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    color: Mapped[str] = mapped_column(String(100), nullable=False)

class TaskTag(Base):
    __tablename__ = "task_tags"
    __table_args__ = (
        UniqueConstraint("task_id", "tag_id", name="uq_task_tag"),
    )
    id: Mapped[UUID] = mapped_column(Uuid,primary_key=True,default=uuid4)
    task_id: Mapped[UUID] = mapped_column(Uuid,ForeignKey("tasks.id", ondelete="CASCADE"),nullable=False)
    tag_id: Mapped[UUID] = mapped_column(Uuid, ForeignKey("tags.id", ondelete="CASCADE"), nullable=False)
    task: Mapped["Task"] = relationship(back_populates="task_tags")
    tag: Mapped["Tag"] = relationship(back_populates="task_tags")

class Status(Base):
    __tablename__ = "statuses"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    project_id: Mapped[UUID] = mapped_column(Uuid, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    color: Mapped[str] = mapped_column( String(20), nullable=False)
    position: Mapped[int] = mapped_column(Integer, nullable=False)
    project: Mapped["Project"] = relationship("Project", back_populates="statuses")
    tasks: Mapped[list["Task"]] = relationship(
        "Task",
        back_populates="status",
        passive_deletes=True
    )
      
class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[UUID] = mapped_column(Uuid,primary_key=True,default=uuid4)
    sender_id: Mapped[UUID] = mapped_column(Uuid, ForeignKey("users.id"), nullable=False)
    task_id: Mapped[UUID] = mapped_column(Uuid,ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    comment: Mapped[str] = mapped_column(String(300), nullable=False)
    task: Mapped["Task"] = relationship(back_populates="comments")

class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    type: Mapped[NotificationType] = mapped_column(Enum(NotificationType, name="notification_type_enum"), nullable=False) # no default, see later if error prone
    type_id: Mapped[UUID] = mapped_column(Uuid, nullable=False)
    recipient_id: Mapped[UUID] = mapped_column(Uuid, nullable=False)
    sender_id: Mapped[UUID] = mapped_column(Uuid, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
