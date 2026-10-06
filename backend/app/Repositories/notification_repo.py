from fastapi import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from Models.models import Notification

def list_notifications(user_id: UUID, session:Session):
    return session.query(Notification).filter(Notification.recipient_id == user_id).all()

def read_notification(notif_id: UUID, session:Session):
    notification = session.query(Notification).filter(Notification.id == notif_id).first()

    if not notification:
        raise HTTPException(status_code=400, detail="No valid notification found for given ID.")

    notification.is_read = True

    session.commit()
    session.refresh(notification)

    return notification

def read_all_notifications(user_id: UUID, session:Session):
    notifications = session.query(Notification).filter(Notification.recipient_id == user_id).filter(Notification.is_read == False).all()

    for notification in notifications:
        notification.is_read = True

    session.commit()

    return {"message": "successfully read all the notifications"}
