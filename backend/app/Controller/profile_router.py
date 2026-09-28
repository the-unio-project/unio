from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.orm import Session
from supabase import Client
from Database.database import get_session
from Database.supabase import get_supabase
from Models.models import User
from Schemas.profile_schemas import SetProfileSchema

from Repositories import profile_repo
from Services.Authentication.auth_methods import verify_token

profile_router = APIRouter()

@profile_router.get("/")
def get_profile(user:User = Depends(verify_token)):
    return {
            "name": user.name,
            "nickname": user.nickname,
            "bio": user.bio,
            "profile_picture_url": user.profile_picture
            }

@profile_router.put("/")
def update_profile(nickname:str, bio:str, profile_picture:UploadFile, user:User = Depends(verify_token), session:Session = Depends(get_session), supabase:Client = Depends(get_supabase)):
    profile_schema = SetProfileSchema(nickname=nickname, bio=bio)

    profile_repo.update_profile(user.id, profile_schema, profile_picture, session, supabase)

    return {"message": "Profile updated successfully"}
