"""add google oauth fields to users

Revision ID: f2a3b4c5d6e7
Revises: d1e2f3a4b5c6
Create Date: 2026-07-31 22:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "f2a3b4c5d6e7"
down_revision: Union[str, Sequence[str], None] = "d1e2f3a4b5c6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column("users", "password_hash", existing_type=sa.Text(), nullable=True)
    op.add_column("users", sa.Column("google_id", sa.String(length=255), nullable=True))
    op.create_index("ix_users_google_id", "users", ["google_id"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_users_google_id", table_name="users")
    op.drop_column("users", "google_id")
    op.alter_column("users", "password_hash", existing_type=sa.Text(), nullable=False)
