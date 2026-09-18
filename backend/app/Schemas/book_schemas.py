from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

class CreateBookSchema(BaseModel):
    name:str
    author:str
    genre:str
    launch_date:str

class EditBookSchema(BaseModel):
    name:str|None = None
    author:str|None = None
    genre:str|None = None
    launch_date:str|None = None

class BookResponseSchema(CreateBookSchema):
    id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class DeleteBookSchema(BaseModel):
    mensagem: str
    uuid: UUID