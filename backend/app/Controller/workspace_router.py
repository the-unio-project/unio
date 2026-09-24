from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from Models.models import User, WorkspaceRole
from Services.Authentication.auth_methods import verify_token
from Services.Permissions.perm_methods import assert_workspace_permission, assert_workspace_member
from Database.database import get_session
from Repositories import workspace_repo
from Schemas.workspace_schema import CreateWorkspaceSchema
from uuid import UUID

workspace_router = APIRouter()

# Creation & Reading

@workspace_router.get(path="/")
def get_user_workspaces(user:User = Depends(verify_token), session:Session = Depends(get_session)):
    return workspace_repo.get_workspace_by_membership(user.id, session)

@workspace_router.post(path="/")
def create_workspace(schema:CreateWorkspaceSchema, user:User = Depends(verify_token), session:Session = Depends(get_session)):
    workspace = workspace_repo.create_workspace(schema, user.id, session)

    return {
            "Message": "Successfully created workspace!",
            "Workspace": workspace
            }

@workspace_router.get(path="/{workspace_id}")
def get_workspace(workspace_id:UUID, _ = Depends(verify_token), session:Session = Depends(get_session)):
    return workspace_repo.get_workspace_by_id(workspace_id, session)

# Invites

@workspace_router.get(path="/{workspace_id}/create-invite")
def create_invite(workspace_id:UUID, user = Depends(verify_token), session:Session = Depends(get_session)):
    assert_workspace_permission(workspace_id, WorkspaceRole.ADMIN, user.id, session)

    return workspace_repo.create_invite(workspace_id, session)

@workspace_router.get(path="/invite/{invite_token}")
def accept_invite(invite_token:UUID, user = Depends(verify_token), session:Session = Depends(get_session)):
    return workspace_repo.accept_invite(invite_token, user, session)

# Members

@workspace_router.post(path="/{workspace_id}/member/list")
def list_members(workspace_id:UUID, user = Depends(verify_token), session:Session = Depends(get_session)):
    assert_workspace_member(workspace_id, user.id, session)

    return workspace_repo.get_users(workspace_id, session)

@workspace_router.delete(path="/{workspace_id}/member/remove")
def remove_member(workspace_id:UUID, target_user_id:UUID, user = Depends(verify_token), session:Session = Depends(get_session)):
    assert_workspace_member(workspace_id, user.id, session)

    target = workspace_repo.get_member(workspace_id, target_user_id, session)

    if target.role == WorkspaceRole.OWNER:
        raise HTTPException(status_code=401, detail="Operation not Allowed")
    elif target.role == WorkspaceRole.ADMIN:
        assert_workspace_permission(workspace_id, WorkspaceRole.OWNER, user.id, session)

        response = workspace_repo.remove_member(workspace_id, target_user_id, session)

        return response
    else:
        assert_workspace_permission(workspace_id, WorkspaceRole.ADMIN, user.id, session)

        response = workspace_repo.remove_member(workspace_id, target_user_id, session)

        return response
