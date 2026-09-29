from fastapi import Depends, FastAPI
from fastapi.security import HTTPBearer, OAuth2PasswordBearer
# Routing & App
from config import (
    SECRET_KEY, ALGORITHM, AT_TIMEOUT,
    DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_SCHEMA, DB_PORT,
    SB_URL, SB_KEY,
    S3_URL, S3_ACCESS_KEY, S3_SECRET_KEY, S3_REGION,
)

from Controller import list_router, project_router, auth_routes, task_router, tag_router, workspace_router, profile_router
from Services.Authentication.auth_methods import verify_token

app = FastAPI()

app.include_router(
        router=auth_routes.auth_router,
        prefix="/auth",
        tags=["Authentication"]
        )

app.include_router(
        router=profile_router.profile_router,
        prefix="/me",
        tags=["Profile Routes"]
        )

app.include_router(
        router=workspace_router.workspace_router,
        prefix="/workspaces",
        tags=["Workspace"],
        dependencies=[Depends(verify_token)]
        )

app.include_router(
        router=project_router.project_router,
        prefix="/workspaces",
        tags=["Project"],
        dependencies=[Depends(verify_token)]
        )

app.include_router(
        router=list_router.list_router,
        prefix="/projects/{project_id}/lists",
        tags=["List"],
        dependencies=[Depends(verify_token)]
        )

app.include_router(
        router=task_router.task_router,
        tags=["Task"],
        dependencies=[Depends(verify_token)]
        )

app.include_router(
        router=tag_router.tag_router,
        tags=["Tag"],
        dependencies=[Depends(verify_token)]
        )

# app.include_router(
#     router=status_router.status_router,
#     tags=["Status"],
#     dependencies=[Depends(verify_token)]
# )
