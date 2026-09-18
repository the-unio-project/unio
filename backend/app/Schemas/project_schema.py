from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, HttpUrl

class CreateProjectSchema(BaseModel):
    name: str
    description: str | None = None
    icon_url: HttpUrl | None = None
    color: str | None = None

class EditProjectSchema(BaseModel):
    name: str | None
    description: str | None
    icon_url: HttpUrl | None
    color: str | None

class ProjectResponseSchema(CreateProjectSchema):
    id: UUID
    workspace_id: UUID
    name: str
    description: str | None = None
    model_config = {
        "from_attributes": True
    }

class DeleteProjectSchema(BaseModel):
    id: UUID
    mensagem: str

