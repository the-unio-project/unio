from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, HttpUrl

from Models.models import TaskPriority


class CreateTaskSchema(BaseModel):
    title: str
    description: str | None = None
    priority: TaskPriority | None = None
    term: datetime | None = None

class CreateSubtaskSchema(BaseModel):
    title: str
    description: str | None = None
    priority: TaskPriority | None = None
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
    term: datetime | None
    model_config = {
        "from_attributes": True
    }

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
    position: int
