from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from Models.models import User, Workspace, WorkspaceRole
from Services.Authentication.auth_methods import verify_token
from Services.Permissions.perm_methods import assert_workspace_permission, assert_workspace_member
from Database.database import get_session
from Repositories.workspace_repo import WorkspaceRepository
from Schemas.workspace_schema import CreateWorkspaceSchema, WorkspaceResponseSchema, WorkspaceMemberResponseSchema
from uuid import UUID

workspace_router = APIRouter()

# Creation & Reading

@workspace_router.get(path="/", response_model=list[WorkspaceResponseSchema])
def get_user_workspaces(user:User = Depends(verify_token), session:Session = Depends(get_session)):
    return WorkspaceRepository(session).get_workspace_by_membership(user.id)

@workspace_router.post(path="/")
def create_workspace(schema:CreateWorkspaceSchema, user:User = Depends(verify_token), session:Session = Depends(get_session)):
    workspace:Workspace = WorkspaceRepository(session).create_workspace(schema, user.id)

    _ = workspace.id

    return {
            "Message": "Successfully created workspace!",
            "Workspace": workspace
            }

@workspace_router.get(path="/{workspace_id}")
def get_workspace(workspace_id:UUID, _ = Depends(verify_token), session:Session = Depends(get_session)):
    return WorkspaceRepository(session).get_workspace_by_id(workspace_id)

@workspace_router.get(path="/{workspace_id}/search")
def query_workspace_tasks(workspace_id:UUID, q:str | None = None, _ = Depends(verify_token), session:Session = Depends(get_session)):
    return WorkspaceRepository(session).search_task_by_title(workspace_id, q)

# Invites

@workspace_router.get(path="/{workspace_id}/create-invite")
def create_invite(workspace_id:UUID, user = Depends(verify_token), session:Session = Depends(get_session)):
    assert_workspace_permission(workspace_id, WorkspaceRole.ADMIN, user.id, session)

    return WorkspaceRepository(session).create_invite(workspace_id)

@workspace_router.get(path="/invite/{invite_token}")
def accept_invite(invite_token:UUID, user = Depends(verify_token), session:Session = Depends(get_session)):
    return WorkspaceRepository(session).accept_invite(invite_token, user)

# Members

@workspace_router.post(path="/{workspace_id}/member/list", response_model=list[WorkspaceMemberResponseSchema])
def list_members(workspace_id:UUID, user = Depends(verify_token), session:Session = Depends(get_session)):
    assert_workspace_member(workspace_id, user.id, session)

    return WorkspaceRepository(session).get_users(workspace_id)

@workspace_router.delete(path="/{workspace_id}/member/remove")
def remove_member(workspace_id:UUID, target_user_id:UUID, user = Depends(verify_token), session:Session = Depends(get_session)):
    assert_workspace_member(workspace_id, user.id, session)

    target = WorkspaceRepository(session).get_member(workspace_id, target_user_id)

    if target.role == WorkspaceRole.OWNER:
        raise HTTPException(status_code=401, detail="Operation not Allowed")
    elif target.role == WorkspaceRole.ADMIN:
        assert_workspace_permission(workspace_id, WorkspaceRole.OWNER, user.id, session)

        response = WorkspaceRepository(session).remove_member(workspace_id, target_user_id)

        return response
    else:
        assert_workspace_permission(workspace_id, WorkspaceRole.ADMIN, user.id, session)

        response = WorkspaceRepository(session).remove_member(workspace_id, target_user_id)

        return response
      
@workspace_router.delete(path="/{workspace_id}")
def delete_workspace(workspace_id:UUID, _ = Depends(verify_token), session:Session = Depends(get_session)):
    return WorkspaceRepository(session).delete_workspace(workspace_id)
