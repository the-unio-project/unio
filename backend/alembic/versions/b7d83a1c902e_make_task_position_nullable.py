from alembic import op
import sqlalchemy as sa

revision = "b7d83a1c902e"
down_revision = "041e7d56b3c0"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column(
        "tasks",
        "position",
        existing_type=sa.Integer(),
        nullable=True,
    )

    op.execute("""
        UPDATE tasks
        SET position = NULL
        WHERE status_id IS NULL
    """)

    op.execute("""
        WITH ordered_tasks AS (
            SELECT
                id,
                ROW_NUMBER() OVER (
                    PARTITION BY status_id
                    ORDER BY position NULLS LAST, id
                ) AS new_position
            FROM tasks
            WHERE status_id IS NOT NULL
        )
        UPDATE tasks
        SET position = ordered_tasks.new_position
        FROM ordered_tasks
        WHERE tasks.id = ordered_tasks.id
    """)


def downgrade() -> None:
    # O esquema anterior exige posição até para tasks sem status.
    op.execute("UPDATE tasks SET position = 1 WHERE position IS NULL")

    op.alter_column(
        "tasks",
        "position",
        existing_type=sa.Integer(),
        nullable=False,
    )