from fastapi import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from Repositories.tag_storage import TagRepository

class TagService:
    def __init__(self, session: Session):
        self.session = session

    # def apply_tag(session: Session, task_id: UUID, tag_id: UUID):