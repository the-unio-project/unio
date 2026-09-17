from fastapi import Depends, FastAPI
from fastapi.security import OAuth2PasswordBearer

import os

# Environment Values

SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHM=os.getenv("ALGORITHM")
AT_TIMEOUT=os.getenv("AT_TIMEOUT")

DB_USER = os.getenv("db_user")
DB_PASSWORD = os.getenv("db_password")
DB_HOST = os.getenv("db_host")
DB_NAME = os.getenv("db_name")

_DB_PORT_ = os.getenv("db_port")
if not _DB_PORT_:
    raise Exception("DB_PORT env value empty")
elif not _DB_PORT_.isnumeric():
    raise Exception("DB_PORT env value invalid")
DB_PORT = int(_DB_PORT_)

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
