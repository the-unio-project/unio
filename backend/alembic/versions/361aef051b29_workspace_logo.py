"""Provide a default workspace logo and allow full storage URLs."""
from alembic import op
import sqlalchemy as sa

revision = "361aef051b29"
down_revision = "00da69565310"
branch_labels = None
depends_on = None


def upgrade():
    op.execute("UPDATE workspaces SET logo_url = '/assets/workspace.svg' WHERE logo_url IS NULL")
    op.alter_column("workspaces", "logo_url", type_=sa.String(), nullable=False,
                    server_default="/assets/workspace.svg")


def downgrade():
    op.alter_column("workspaces", "logo_url", nullable=True, server_default=None)
    op.execute("UPDATE workspaces SET logo_url = NULL WHERE logo_url = '/assets/workspace.svg'")
    op.alter_column("workspaces", "logo_url", type_=sa.String(100))

