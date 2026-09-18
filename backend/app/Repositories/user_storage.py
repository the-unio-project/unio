from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from Models.models import User
from Schemas.auth_schemas import RegisterSchema

class UserRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_user(self, user: RegisterSchema):
        new_user = user(**user.model_dump())
        existing_user = self.session.query(User).filter(User.email == RegisterSchema.email).first()
        if existing_user.email == new_user.email:
            return None
        self.session.add(new_user)
        self.session.commit()
        self.session.refresh(new_user)
        return new_user

    def get_by_id(self, User_id: UUID) -> Optional[User]:
        return self.session.query(User).filter(User.id == User_id).first()
    
    def get_all(self) -> List[User]:
        return self.session.query(User).order_by(User.created_at.asc()).all()