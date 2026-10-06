from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.orm import Session
from supabase import Client
from Database.database import get_session
from Database.supabase import get_supabase
from Models.models import User
from Schemas.profile_schemas import SetProfileSchema

from Repositories import notification_repo
from Services.Authentication.auth_methods import verify_token

notification_router = APIRouter()

@notification_router.get("/list")
def get_notifications(user = Depends(verify_token)):
