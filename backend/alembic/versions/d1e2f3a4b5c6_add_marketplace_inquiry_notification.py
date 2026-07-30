"""add marketplace inquiry notification type

Revision ID: d1e2f3a4b5c6
Revises: c8f1a2b3d4e5
Create Date: 2026-07-30 23:58:00.000000

"""
from typing import Sequence, Union

from alembic import op


revision: str = "d1e2f3a4b5c6"
down_revision: Union[str, Sequence[str], None] = "c8f1a2b3d4e5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "ALTER TYPE notificationtype ADD VALUE IF NOT EXISTS 'MARKETPLACE_INQUIRY'"
    )


def downgrade() -> None:
    pass
