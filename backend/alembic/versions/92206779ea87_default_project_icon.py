"""default project icon

Revision ID: 92206779ea87
Revises: 361aef051b29
Create Date: 2026-11-04 01:46:41.696146

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '92206779ea87'
down_revision: Union[str, Sequence[str], None] = '361aef051b29'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "UPDATE projects SET icon_url = '/assets/project.svg' "
        "WHERE icon_url IS NULL OR icon_url = 'https://example.com/'"
    )
    op.alter_column(
        "projects", "icon_url", existing_type=sa.String(100), type_=sa.String(),
        nullable=False, server_default="/assets/project.svg",
    )


def downgrade() -> None:
    op.alter_column("projects", "icon_url", nullable=True, server_default=None)
    op.execute("UPDATE projects SET icon_url = NULL WHERE icon_url = '/assets/project.svg'")
    op.alter_column("projects", "icon_url", existing_type=sa.String(), type_=sa.String(100))
