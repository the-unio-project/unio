from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from Database.database import get_session
from Models.models import User

from Repositories import notification_repo
from Services.Authentication.auth_methods import verify_token

notification_router = APIRouter()

@notification_router.get("/list")
def get_notifications(user:User = Depends(verify_token), session:Session = Depends(get_session)):
    return notification_repo.list_notifications(user.id, session)

@notification_router.post("/read/{notification_id}")
def read_notification(notification_id:UUID, _ = Depends(verify_token), session:Session = Depends(get_session)):
    _ = notification_repo.read_notification(notification_id, session)

    return {"message": "notification successfully read"}

@notification_router.post("/read/all")
def read_all_notifications(user:User = Depends(verify_token), session:Session = Depends(get_session)):
    _ = notification_repo.read_all_notifications(user.id, session)

    return {"message": "all notifications successfully read"}
