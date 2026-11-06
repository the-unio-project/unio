from datetime import datetime
from uuid import UUID
from Models.models import WorkspaceRole
from Schemas.user_schema import UserResponseSchema

from pydantic import BaseModel

# Workspace
class CreateWorkspaceSchema(BaseModel):
    name: str

class WorkspaceResponseSchema(BaseModel):
    id: UUID
    name: str
    owner_id: UUID
    created_at: datetime
    logo_url: str | None
    current_user_role: WorkspaceRole

class WorkspaceMemberResponseSchema(UserResponseSchema):
    role: WorkspaceRole

# Workspace Member
    
class WorkspaceMemberSchema(BaseModel):
    workspace_id: UUID
    user_id: UUID
    role: WorkspaceRole

# Workspace Invite

class WorkspaceInviteSchema(BaseModel):
    workspace_id: UUID

class DeleteWorkspaceSchema(BaseModel):
    message: str
    id: UUID
