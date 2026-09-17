from uuid import UUID
from pydantic import BaseModel

class RegisterSchema(BaseModel):
    name: str
    email: str
    password: str

    class Config:
        from_attribute = True
