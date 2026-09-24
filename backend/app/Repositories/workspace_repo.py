from fastapi import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from Models.models import User, Workspace, WorkspaceInvite, WorkspaceMember, WorkspaceRole
from Schemas.workspace_schema import CreateWorkspaceSchema, WorkspaceInviteSchema, WorkspaceMemberSchema

def create_workspace(workspace: CreateWorkspaceSchema, user_id:UUID, session:Session) -> Workspace:

    new_workspace = Workspace(**workspace.model_dump())
    new_workspace.owner_id = user_id

    session.add(new_workspace)
    session.commit()
    session.refresh(new_workspace)

    owner_schema = WorkspaceMemberSchema(workspace_id=new_workspace.id, user_id=user_id, role=WorkspaceRole.OWNER)
    create_member(owner_schema, session)

    return new_workspace

def get_workspace_by_id(workspace_id: UUID, session: Session) -> Workspace | None:
    return session.query(Workspace).filter(Workspace.id == workspace_id).first()

def get_workspace_by_owner(owner_id: UUID, session: Session) -> list[Workspace]:
    workspaces = session.query(Workspace).filter(Workspace.owner_id == owner_id).all()
    return workspaces

def get_workspace_by_membership(member_id: UUID, session: Session) -> list[Workspace]:
    user = session.query(User).filter(User.id == member_id).first()

    if not user:
        raise HTTPException(status_code=400, detail="invalid user")

    memberships = user.workspace_memberships
    
    if memberships.count == 0:
        raise HTTPException(status_code=400, detail="user isnt a member of any workspaces")

    workspaces = list[Workspace]()

    for workspaceMember in memberships:
        workspaces.append(workspaceMember.workspace)

    return workspaces

def get_all_workspaces(session:Session) -> list[Workspace]:
    workspaces = session.query(Workspace).order_by(Workspace.created_at.asc()).all()
    for workspace in workspaces:
        print(workspace.owner.id)
    return workspaces

# MEMBER FUNCTIONS

def create_member(member: WorkspaceMemberSchema, session:Session):
    new_member = WorkspaceMember(**member.model_dump())

    session.add(new_member)
    session.commit()
    session.refresh(new_member)

def get_members(workspace_id: UUID, session:Session) -> list[WorkspaceMember]:
    members = session.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id).all()

    if not members:
        raise HTTPException(status_code=400, detail="No workspace found")

    return members

def get_member(workspace_id: UUID, user_id: UUID, session:Session) -> WorkspaceMember:
    members = session.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id).all()

    if not members:
        raise HTTPException(status_code=400, detail="No workspace found'")
    
    for member in members:
        if member.user.id == user_id:
            return member

    raise HTTPException(status_code=400, detail="No member found in workspace")

def get_users(workspace_id: UUID, session:Session) -> list[User]:
    members = session.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id).all()

    if not members:
        raise HTTPException(status_code=400, detail="No workspace found")
    
    users = list[User]()

    for member in members:
        users.append(member.user)

    return users

def remove_member(workspace_id: UUID, user_id: UUID, session:Session) -> str:
    member = session.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id).filter(WorkspaceMember.user_id == user_id).first()

    if not member:
        raise HTTPException(status_code=400, detail="No membership found")

    session.delete(member)
    session.commit()

    return "Workspace member deleted successfully"

# INVITE FUNCTIONS

def create_invite(workspace_id: UUID, session:Session) -> WorkspaceInvite:
    invite = WorkspaceInviteSchema(workspace_id=workspace_id)
    new_invite = WorkspaceInvite(**invite.model_dump())

    session.add(new_invite)
    session.commit()
    session.refresh(new_invite)

    return new_invite

def accept_invite(invite_id: UUID, user:User, session:Session) -> WorkspaceMember:
    workspaceInvite = session.query(WorkspaceInvite).filter(WorkspaceInvite.id == invite_id).first()

    if not workspaceInvite:
        raise HTTPException(status_code=400, detail="invalid invite")

    memberSchema = WorkspaceMemberSchema(workspace_id=workspaceInvite.workspace_id, user_id=user.id, role=WorkspaceRole.MEMBER)
    member = WorkspaceMember(**memberSchema.model_dump())

    session.add(member)
    session.commit()
    session.refresh(member)

    return member
