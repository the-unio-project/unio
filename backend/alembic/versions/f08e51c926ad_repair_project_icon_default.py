"""Repair databases that applied the initial project icon revision."""
from alembic import op
import sqlalchemy as sa

revision = "f08e51c926ad"
down_revision = "92206779ea87"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column(
        "projects", "icon_url", type_=sa.String(), server_default="/assets/project.svg"
    )
    op.execute(
        "UPDATE projects SET icon_url = DEFAULT "
        "WHERE icon_url IS NULL OR icon_url = 'https://example.com/'"
    )


def downgrade() -> None:
    # The preceding revision already specifies this default and column type.
    pass
