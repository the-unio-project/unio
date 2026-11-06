from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

class UserResponseSchema(BaseModel):
    __tablename__ = "users"
    id: UUID
    name: str
    email:  str
    created_at: datetime
    nickname: str
    bio: str
    profile_picture: str | None
