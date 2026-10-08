from fastapi import Depends, HTTPException, APIRouter
from uuid import UUID
from sqlalchemy.orm import Session

from Controller.auth_routes import verify_token
from Models.models import NotificationType
from Schemas.comment_schema import CreateCommentSchema
from Database.database import get_session

from Services.Comments.mention_methods import get_comment_mentions
from Services.Notifications.notification_methods import bulk_notify

from Repositories import comment_repo

comment_router = APIRouter()

@comment_router.post("/tasks/{task_id}/comments")
def create_comment(comment_schema: CreateCommentSchema, task_id:UUID, user=Depends(verify_token), session=Depends(get_session)):
    comment = comment_repo.create_comment(comment_schema, task_id, session)

    valid_ids = get_comment_mentions(comment.comment)

    if valid_ids.count != 0:
        bulk_notify(NotificationType.COMMENT_MENTION, comment.id, user.id, valid_ids, session)

    return comment

@comment_router.get("/tasks/{task_id}/comments")
def get_comments(task_id:UUID, session=Depends(get_session)):
    return comment_repo.get_comments(task_id, session)

@comment_router.delete("/comments/{comment_id}")
def remove_comment(comment_id:UUID, session=Depends(get_session)):
    result = comment_repo.delete_comment(comment_id, session)

    if not result:
        raise HTTPException(status_code=400, detail="Comment not found")

    return {"message": "Comment deleted successfully"}
