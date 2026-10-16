from uuid import UUID

from sqlalchemy.orm import Session

from Models.models import Notification, NotificationType

def notify(type:NotificationType, type_id:UUID, sender_id:UUID, recipient_id:UUID, session:Session):
    
    new_notification = Notification()

    new_notification.type=type
    new_notification.type_id=type_id
    new_notification.sender_id=sender_id
    new_notification.recipient_id=recipient_id

    session.add(new_notification)
    session.commit()
    session.refresh(new_notification)

    return new_notification

def bulk_notify(type:NotificationType, type_id:UUID, sender_id:UUID, recipient_ids:list[UUID], session:Session):
    
    for recipient_id in recipient_ids:
        new_notification = Notification()

        new_notification.type=type
        new_notification.type_id=type_id
        new_notification.sender_id=sender_id
        new_notification.recipient_id=recipient_id

        session.add(new_notification)

    session.commit()

    return {"message": "notified all users"}
