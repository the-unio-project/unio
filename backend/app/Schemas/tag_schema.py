from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, HttpUrl

from Models.models import Tag

class CreateTagSchema(BaseModel):
    name: str
    color: str

class EditTagSchema(BaseModel):
    name: str | None = None
    color: str | None = None
    
class TagResponseSchema(CreateTagSchema):
    id: UUID
    project_id: UUID
    name: str
    color: str
    model_config = {
        "from_attributes": True
    }
    
class DeleteTagSchema(BaseModel):
    id: UUID
    mensagem: str
