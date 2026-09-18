from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from typing import Annotated
from sqlalchemy.orm import Session

from Database.database import get_session
from Models.models import User
from Schemas.auth_schemas import RegisterSchema
from Services.Authentication.auth_methods import auth_user, create_token, verify_token

auth_router = APIRouter()

@auth_router.get("/")
async def default_path(_ = Depends(verify_token)):
    return {"Message": "root path, nothing here :)"}

@auth_router.post("/login")
async def verify_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session:Session = Depends(get_session)):
    user = auth_user(form_data.username, form_data.password, session)

    if not user:
        raise HTTPException(status_code=400, detail="Failed to log in, username or password incorrect.")
    else:
        access_token = create_token(user.id)
        
        return {
                "access_token": access_token,
                "token_type": "Bearer"
                }

@auth_router.post("/register")
async def register_user(registerSchema:RegisterSchema, session:Session = Depends(get_session)):
    user = session.query(User).filter(User.email == registerSchema.email).first()

    if user:
        raise HTTPException(status_code=400, detail="Account alredy registered.")
