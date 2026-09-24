from uuid import UUID

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from Database.database import get_session
from Models.models import User, WorkspaceRole
from Repositories import workspace_repo
from Services.Authentication.auth_methods import verify_token

def assert_workspace_permission(workspace_id: UUID, role: WorkspaceRole, user_id: UUID, session:Session):
    caller = workspace_repo.get_member(workspace_id, user_id, session)

    if caller.role.value >= role.value:
        return
    else:
        raise HTTPException(status_code=401, detail="Insufficient Authorization")

def assert_workspace_member(workspace_id: UUID, user_id: UUID, session:Session):
    try:
        _ = workspace_repo.get_member(workspace_id, user_id, session)
    except:
        raise HTTPException(status_code=401, detail="Not a Member or Invalid Workspace")
