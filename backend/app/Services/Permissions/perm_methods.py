from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.orm import Session

from Models.models import WorkspaceRole
from Repositories import workspace_repo

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
