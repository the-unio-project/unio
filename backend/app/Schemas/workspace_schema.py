from enum import Enum
from uuid import UUID
from Models.models import WorkspaceRole

from pydantic import BaseModel

# Workspace
class CreateWorkspaceSchema(BaseModel):
    name: str

# Workspace Member
    
class WorkspaceMemberSchema(BaseModel):
    workspace_id: UUID
    user_id: UUID
    role: WorkspaceRole

# Workspace Invite

class WorkspaceInviteSchema(BaseModel):
    workspace_id: UUID
