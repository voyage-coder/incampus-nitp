"""add recruitment date check constraint

Revision ID: 1210cda83e4b
Revises: 9c01327d711c
Create Date: 2026-07-27 20:05:01.341958

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1210cda83e4b'
down_revision: Union[str, Sequence[str], None] = '9c01327d711c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None



def upgrade() -> None:
    op.create_check_constraint(
        "ck_application_dates",
        "recruitment_drives",
        "application_end > application_start",
    )


def downgrade() -> None:
    op.drop_constraint(
        "ck_application_dates",
        "recruitment_drives",
        type_="check",
    )