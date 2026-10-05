from fastapi import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from Models.models import Comment, Notification
from Schemas.comment_schema import CreateCommentSchema
from Schemas.notification_schema import NotificationSchema

def list_notifications(user_id: UUID)
def create_notification(notification: NotificationSchema, session:Session):
    new_notification = Notification(**notification.model_dump())

    session.add(new_notification)
    session.commit()
    session.refresh(new_notification)

    return new_notification

def read_notification(notif_id: UUID, session:Session):
    session.query(Notification).filter(Comment.id == comment_id).first()
