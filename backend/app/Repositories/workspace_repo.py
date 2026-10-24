from fastapi import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from Models.models import Project, Task, User, Workspace, WorkspaceInvite, WorkspaceMember, WorkspaceRole
from Schemas.workspace_schema import CreateWorkspaceSchema, DeleteWorkspaceSchema, WorkspaceInviteSchema, WorkspaceMemberSchema
from Services.Tasks.search_methods import search_title

class WorkspaceRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_workspace(self, workspace: CreateWorkspaceSchema, user_id:UUID) -> Workspace:

        new_workspace = Workspace(**workspace.model_dump())
        new_workspace.owner_id = user_id

        self.session.add(new_workspace)
        self.session.commit()
        self.session.refresh(new_workspace)

        owner_schema = WorkspaceMemberSchema(workspace_id=new_workspace.id, user_id=user_id, role=WorkspaceRole.OWNER)
        self.create_member(owner_schema)

        return new_workspace

    def get_workspace_by_id(self, workspace_id: UUID) -> Workspace:
        workspace = self.session.query(Workspace).filter(Workspace.id == workspace_id).first()
        if workspace is None:
            raise HTTPException(status_code=404, detail="No workspace found")
        return workspace

    def get_workspace_by_owner(self, owner_id: UUID) -> list[Workspace]:
        workspaces = self.session.query(Workspace).filter(Workspace.owner_id == owner_id).all()
        return workspaces

    def get_workspace_by_membership(self, member_id: UUID) -> list[Workspace]:
        user = self.session.query(User).filter(User.id == member_id).first()

        if not user:
            raise HTTPException(status_code=400, detail="invalid user")

        memberships = user.workspace_memberships

        if memberships.count == 0:
            raise HTTPException(status_code=401, detail="user isnt a member of any workspaces")

        workspaces = list[Workspace]()

        for workspaceMember in memberships:
            workspaces.append(workspaceMember.workspace)

        return workspaces

    def get_all_workspaces(self) -> list[Workspace]:
        workspaces = self.session.query(Workspace).order_by(Workspace.created_at.asc()).all()
        for workspace in workspaces:
            print(workspace.owner.id)
        return workspaces

    # MEMBER FUNCTIONS

    def create_member(self, member: WorkspaceMemberSchema):
        new_member = WorkspaceMember(**member.model_dump())

        self.session.add(new_member)
        self.session.commit()
        self.session.refresh(new_member)

    def get_members(self, workspace_id: UUID) -> list[WorkspaceMember]:
        members = self.session.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id).all()

        if not members:
            raise HTTPException(status_code=404, detail="No workspace found")

        return members

    def get_member(self, workspace_id: UUID, user_id: UUID) -> WorkspaceMember:
        member = self.session.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id).filter(WorkspaceMember.user_id == user_id).first()

        if not member:
            raise HTTPException(status_code=404, detail="No member found for this workspace, or workspace doesnt exist")

        return member

    def get_users(self, workspace_id: UUID) -> list[User]:
        members = self.session.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id).all()

        if not members:
            raise HTTPException(status_code=404, detail="No workspace found")

        users = list[User]()

        for member in members:
            users.append(member.user)

        return users

    def remove_member(self, workspace_id: UUID, user_id: UUID) -> str:
        member = self.session.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id).filter(WorkspaceMember.user_id == user_id).first()

        if not member:
            raise HTTPException(status_code=404, detail="No membership found")

        self.session.delete(member)
        self.session.commit()

        return "Workspace member deleted successfully"

    # INVITE FUNCTIONS

    def create_invite(self, workspace_id: UUID) -> WorkspaceInvite:
        invite = WorkspaceInviteSchema(workspace_id=workspace_id)
        new_invite = WorkspaceInvite(**invite.model_dump())

        self.session.add(new_invite)
        self.session.commit()
        self.session.refresh(new_invite)

        return new_invite

    def accept_invite(self, invite_id: UUID, user:User) -> WorkspaceMember:
        workspaceInvite = self.session.query(WorkspaceInvite).filter(WorkspaceInvite.id == invite_id).first()

        if not workspaceInvite:
            raise HTTPException(status_code=404, detail="invalid invite")

        workspaceMember = self.session.query(WorkspaceMember).filter(WorkspaceMember.user_id == user.id,WorkspaceMember.workspace_id == workspaceInvite.workspace_id).first()

        if workspaceMember:
            raise HTTPException(status_code=409, detail="User already belongs to this workspace")

        memberSchema = WorkspaceMemberSchema(workspace_id=workspaceInvite.workspace_id, user_id=user.id, role=WorkspaceRole.MEMBER)
        member = WorkspaceMember(**memberSchema.model_dump())

        self.session.add(member)
        self.session.commit()
        self.session.refresh(member)

        return member

    def delete_workspace(self, workspace_id: UUID) -> DeleteWorkspaceSchema:
        workspace = self.get_workspace_by_id(workspace_id)
        if workspace is None:
            return None
        self.session.delete(workspace)
        self.session.commit()
        return DeleteWorkspaceSchema(message=f"Workspace {workspace.name} deletado com sucesso!", id=workspace_id)

    # GLOBAL TASK SEARCH

    def search_task_by_title(self, workspace_id:UUID, query:str) -> list[Task]:
        projects = self.session.query(Project).filter(Project.workspace_id == workspace_id).all()

        final_tasks:list[Task] = []

        for project in projects:
            tasks = self.session.query(Task).filter(Task.project_id == project.id).all()

            final_tasks.extend(search_title(query, tasks))

        return final_tasks
