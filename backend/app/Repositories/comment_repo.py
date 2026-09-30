from fastapi import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from Models.models import Comment
from Schemas.comment_schema import CreateCommentSchema

def create_comment(comment: CreateCommentSchema, task_id:UUID, session:Session) -> Comment:
    new_comment = Comment(**comment.model_dump())
    new_comment.task_id = task_id

    session.add(new_comment)
    session.commit()
    session.refresh(new_comment)

    return new_comment

def delete_comment(comment_id: UUID, session:Session):
    comment = session.query(Comment).filter(Comment.id == comment_id).first()

    if not comment:
        raise HTTPException(status_code=400, detail="Comment not found")

    session.delete(comment)
    session.commit()

    return True

def get_comments(task_id:UUID, session:Session) -> list[Comment]:
    return session.query(Comment).filter(Comment.task_id == task_id).all()
