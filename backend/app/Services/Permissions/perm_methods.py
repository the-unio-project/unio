from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.orm import Session

from Models.models import WorkspaceRole
from Repositories.workspace_repo import WorkspaceRepository

def assert_workspace_permission(workspace_id: UUID, role: WorkspaceRole, user_id: UUID, session:Session):
    caller = WorkspaceRepository(session).get_member(workspace_id, user_id)

    if caller.role.value >= role.value:
        return
    else:
        raise HTTPException(status_code=401, detail="Insufficient Authorization")

def assert_workspace_member(workspace_id: UUID, user_id: UUID, session:Session):
    try:
        _ = WorkspaceRepository(session).get_member(workspace_id, user_id)
    except:
        raise HTTPException(status_code=401, detail="Not a Member or Invalid Workspace")
