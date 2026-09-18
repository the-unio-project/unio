from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, HttpUrl

class CreateListSchema(BaseModel):
    name: str

class EditListSchema(BaseModel):
    name: str | None

class ListResponseSchema(CreateListSchema):
    id: UUID
    workspace_id: UUID
    project_id: UUID
    name: str
    model_config = {
        "from_attributes": True
    }

class DeleteListSchema(BaseModel):
    id: UUID
    mensagem: str
