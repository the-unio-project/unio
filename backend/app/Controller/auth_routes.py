from fastapi import APIRouter, Depends, HTTPException, Response

from sqlalchemy.orm import Session

from Database.database import get_session
from Schemas.auth_schemas import RegisterSchema, LoginSchema
from Services.Authentication.auth_methods import auth_user, create_token
from Services.Validation.pwd_validation import validate_password_strength
from Services.Validation.email_validation import validate_email

from Repositories.user_repo import UserRepository

auth_router = APIRouter()

@auth_router.post("/login")
async def verify_token(login_data: LoginSchema, response: Response, session:Session = Depends(get_session)):
    # Email validation
    email_valid = validate_email(login_data.email)
    if not email_valid:
        raise HTTPException(status_code=400, detail="E-mail invalid")

    # Password validation
    pwd_valid = validate_password_strength(login_data.password)
    if not pwd_valid:
        raise HTTPException(status_code=400, detail=f"Password not strong enough")

    # Since email & password valid inputs, send to server
    user = auth_user(login_data.email, login_data.password, session)

    if not user:
        raise HTTPException(status_code=400, detail="Failed to log in, username or password incorrect.")
    else:
        (access_token, timeout) = create_token(user.id)

        response.set_cookie(key="access_token", value=access_token, expires=timeout)

        return {"Message": "Login successful!"}

@auth_router.post("/register")
async def register_user(registerSchema:RegisterSchema, response: Response, session:Session = Depends(get_session)):
    # Email validation
    email_valid = validate_email(registerSchema.email)
    if not email_valid:
        raise HTTPException(status_code=400, detail="E-mail invalid")

    # Password validation
    pwd_valid = validate_password_strength(registerSchema.password)
    if not pwd_valid:
        raise HTTPException(status_code=400, detail=f"Password not strong enough")

    # Since both valid, account creation
    repo = UserRepository(session)
    user = repo.create_user(registerSchema, session)

    (access_token, timeout) = create_token(user.id)

    response.set_cookie(key="access_token", value=access_token, expires=timeout)

    return {"Message": "Registration successful!"}
