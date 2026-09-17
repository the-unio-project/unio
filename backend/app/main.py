from fastapi import Depends, FastAPI
from fastapi.security import OAuth2PasswordBearer

import os

# Environment Values

SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHM=os.getenv("ALGORITHM")
AT_TIMEOUT=os.getenv("AT_TIMEOUT")

# Auth Variables

oauth2_schema = OAuth2PasswordBearer(tokenUrl="") # todo : change url to the form path

# Routing & App

from Controller import book_crud, auth_routes
from Services.Authentication.auth_methods import verify_token

app = FastAPI()

app.include_router(
        router=book_crud.CRUD_ROUTER,
        prefix="/books",
        tags=["books"],
        dependencies=[Depends(verify_token)]
        )

app.include_router(
        router=auth_routes.auth_router,
        prefix="/auth",
        tags=["authentication"]
        )

@app.get("/")
async def root():
    return{"message": "Default Path"}
