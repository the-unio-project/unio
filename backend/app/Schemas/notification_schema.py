from pydantic import BaseModel
from uuid import UUID
from Models.models import NotificationType

class NotificationSchema(BaseModel):
    type: NotificationType
    typed_id: UUID
    sender_id: UUID
