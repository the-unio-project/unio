from fastapi import APIRouter, Depends, HTTPException, Response

from sqlalchemy.orm import Session

from Database.database import get_session
from Schemas.auth_schemas import RegisterSchema, LoginSchema
from Services.Authentication.auth_methods import auth_user, create_token, verify_token  # pyright: ignore[reportAssignmentType]

from Repositories import user_repo

auth_router = APIRouter()

@auth_router.post("/login")
async def verify_token(login_data: LoginSchema, response: Response, session:Session = Depends(get_session)):
    user = auth_user(login_data.email, login_data.password, session)

    if not user:
        raise HTTPException(status_code=400, detail="Failed to log in, username or password incorrect.")
    else:
        (access_token, timeout) = create_token(user.id)

        response.set_cookie(key="access_token", value=access_token, expires=timeout)

        return {"Message": "Login successful!"}

# @auth_router.post("/register")
@auth_router.post("/register")
async def register_user(registerSchema:RegisterSchema, response: Response, session:Session = Depends(get_session)):
    user = user_repo.create_user(registerSchema, session)

    (access_token, timeout) = create_token(user.id)

    response.set_cookie(key="access_token", value=access_token, expires=timeout)

    return {"Message": "Registration successful!"}
