"""Allow tasks without a list while retaining their project.

Revision ID: 4013868ff98f
Revises: 41c0e1539085
Create Date: 2026-10-03 15:34:27.796256

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '4013868ff98f'
down_revision: Union[str, Sequence[str], None] = '41c0e1539085'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Populate projects before allowing tasks without lists."""
    op.add_column('tasks', sa.Column('project_id', sa.Uuid(), nullable=True))
    op.execute("""
        UPDATE tasks
        SET project_id = lists.project_id
        FROM lists
        WHERE tasks.list_id = lists.id
    """)
    op.alter_column('tasks', 'project_id', existing_type=sa.Uuid(), nullable=False)
    op.create_foreign_key(
        'fk_tasks_project_id', 'tasks', 'projects',
        ['project_id'], ['id'], ondelete='CASCADE',
    )
    op.alter_column('tasks', 'list_id', existing_type=sa.Uuid(), nullable=True)


def downgrade() -> None:
    """Require lists again before removing the direct project reference.

    Tasks without lists must be assigned to a list before downgrading.
    PostgreSQL rejects the NOT NULL change otherwise, preserving their data.
    """
    op.alter_column('tasks', 'list_id', existing_type=sa.Uuid(), nullable=False)
    op.drop_constraint('fk_tasks_project_id', 'tasks', type_='foreignkey')
    op.drop_column('tasks', 'project_id')
