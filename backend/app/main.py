from fastapi import Depends, FastAPI
from fastapi.security import HTTPBearer, OAuth2PasswordBearer

import os

# Environment Values

SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHM=os.getenv("ALGORITHM")
AT_TIMEOUT=os.getenv("AT_TIMEOUT")

DB_USER = os.getenv("db_user")
DB_PASSWORD = os.getenv("db_password")
DB_HOST = os.getenv("db_host")
DB_NAME = os.getenv("db_name")
DB_SCHEMA = os.getenv("db_schema")

_DB_PORT_ = os.getenv("db_port")
if not _DB_PORT_:
    raise Exception("DB_PORT env value empty")
elif not _DB_PORT_.isnumeric():
    raise Exception("DB_PORT env value invalid")
DB_PORT = int(_DB_PORT_)

# Routing & App

from Controller import list_router, project_router, auth_routes, task_router
from Services.Authentication.auth_methods import verify_token

app = FastAPI()

app.include_router(
        router=project_router.project_router,
        prefix="/workspaces/{workspace_id}/projects",
        tags=["project"],
        dependencies=[Depends(verify_token)]
        )

app.include_router(
        router=list_router.list_router,
        prefix="/projects/{project_id}/lists",
        tags=["list"],
        dependencies=[Depends(verify_token)]
        )

app.include_router(
        router=auth_routes.auth_router,
        prefix="/auth",
        tags=["authentication"]
        )

app.include_router(
        router=task_router.task_router,
        tags=["task"],
        dependencies=[Depends(verify_token)]
        )

app.include_router(
        router=tag_router.tag_router,
        tags=["tag"],
        dependencies=[Depends(verify_token)]
        )

@app.get("/")
async def root():
    return{"message": "Default Path"}
