from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from Models.models import User
from Services.Authentication.auth_methods import verify_token
from Database.database import get_session
from Repositories import workspace_repo
from Schemas.workspace_schema import CreateWorkspaceSchema

workspace_router = APIRouter()

@workspace_router.get(path="/")
def get_user_workspaces(user:User = Depends(verify_token), session:Session = Depends(get_session)):
    return workspace_repo.get_workspace_by_owner(user.id, session)

@workspace_router.post(path="/")
def create_workspace(schema:CreateWorkspaceSchema, user:User = Depends(verify_token), session:Session = Depends(get_session)):
    workspace = workspace_repo.create_workspace(schema, user.id, session)

    return {
            "Message": "Successfully created workspace!",
            "Workspace": workspace
            }
