from fastapi import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from Models.models import User
from Schemas.auth_schemas import RegisterSchema

def create_user(user: RegisterSchema, session: Session) -> User:
    existing_user = session.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="E-mail already registered")

    new_user = User(**user.model_dump())

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return new_user

def get_by_id(User_id: UUID, session: Session) -> User | None:
    return session.query(User).filter(User.id == User_id).first()

def get_all(session:Session) -> list[User]:
    return session.query(User).order_by(User.created_at.asc()).all()
