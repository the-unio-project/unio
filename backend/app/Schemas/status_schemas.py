from pydantic import BaseModel
from uuid import UUID


class CreateStatusSchema(BaseModel):
    name: str
    color: str


class UpdateStatusSchema(BaseModel):
    name: str | None = None
    color: str | None = None

class StatusResponseSchema(BaseModel):
    id: UUID
    project_id: UUID
    name: str
    color: str

    model_config = {
        "from_attributes": True
    }

class DeleteStatusSchema(BaseModel):
    id: UUID
    message: str