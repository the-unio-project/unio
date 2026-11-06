from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from Models.models import TaskAssignee, TaskPriority

class CreateTaskSchema(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=100)
    priority: TaskPriority = TaskPriority.MEDIUM
    term: datetime | None = None
    status_id: UUID | None = None

class CreateSubtaskSchema(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=100)
    priority: TaskPriority = TaskPriority.MEDIUM
    term: datetime | None = None

class EditTaskSchema(BaseModel):
    title: str | None
    description: str | None
    priority: TaskPriority | None
    term: datetime | None
    
class TaskResponseSchema(CreateTaskSchema):
    id: UUID
    list_id: UUID | None
    title: str
    description: str | None = None
    priority: TaskPriority | None = None
    assignees: list[TaskAssigneeMiddleSchema] | None = None
    term: datetime | None
    model_config = {
        "from_attributes": True
    }
    position: int | None

class SubtaskResponseSchema(CreateSubtaskSchema):
    task_id: UUID
    id: UUID
    list_id: UUID | None
    title: str
    description: str | None = None
    priority: TaskPriority | None = None
    term: datetime | None
    model_config = {
        "from_attributes": True
    }
    
class DeleteTaskSchema(BaseModel):
    id: UUID
    mensagem: str

class MoveTaskStatusSchema(BaseModel):
    status_id: UUID
    position: int = Field(ge=1)

class DashboardTaskSchema(BaseModel):
    id: UUID
    title: str
    description: str | None
    term: datetime | None
    project_id: UUID
    status_id: UUID | None
    position: int | None
    model_config = ConfigDict(from_attributes=True)

class TaskAssigneeResponseSchema(BaseModel):
    id: UUID
    name: str
    profile_pic: str | None = Field(validation_alias="profile_picture")
    model_config = ConfigDict(from_attributes=True)

class TaskAssigneeMiddleSchema(BaseModel):
    user: TaskAssigneeResponseSchema
