from uuid import UUID

from pydantic import BaseModel

class CreateProjectSchema(BaseModel):
    name: str
    description: str | None = None
    color: str | None = None

class EditProjectSchema(BaseModel):
    name: str | None = None
    description: str | None = None
    color: str | None = None

class ProjectResponseSchema(CreateProjectSchema):
    id: UUID
    workspace_id: UUID
    name: str
    description: str | None = None
    model_config = {
        "from_attributes": True
    }
    icon_url: str
    color: str | None
    is_archived: bool

class DeleteProjectSchema(BaseModel):
    id: UUID
    mensagem: str
