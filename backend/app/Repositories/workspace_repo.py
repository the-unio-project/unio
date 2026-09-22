from sqlalchemy.orm import Session
from uuid import UUID

from Models.models import Workspace, WorkspaceMember, WorkspaceRole
from Schemas.workspace_schema import CreateWorkspaceSchema, WorkspaceMemberSchema

def create_workspace(workspace: CreateWorkspaceSchema, user_id:UUID, session:Session) -> Workspace:

    new_workspace = Workspace(**workspace.model_dump())
    new_workspace.owner_id = user_id

    session.add(new_workspace)
    session.commit()
    session.refresh(new_workspace)

    owner_schema = WorkspaceMemberSchema(workspace_id=new_workspace.id, user_id=user_id, role=WorkspaceRole.OWNER)
    create_member(owner_schema, session)

    return new_workspace
# test

def get_workspace_by_id(workspace_id: UUID, session: Session) -> Workspace | None:
    return session.query(Workspace).filter(Workspace.id == workspace_id).first()

def get_workspace_by_owner(owner_id: UUID, session: Session) -> list[Workspace]:
    workspaces = session.query(Workspace).filter(Workspace.owner_id == owner_id).all()
    for workspace in workspaces:
        print(workspace.members.__sizeof__)
    return workspaces

def get_all_workspaces(session:Session) -> list[Workspace]:
    workspaces = session.query(Workspace).order_by(Workspace.created_at.asc()).all()
    for workspace in workspaces:
        print(workspace.owner.id)
    return workspaces

def create_member(member: WorkspaceMemberSchema, session:Session):
    new_member = WorkspaceMember(**member.model_dump())

    session.add(new_member)
    session.commit()
    session.refresh(new_member)
