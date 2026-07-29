"""change experience description to array

Revision ID: 3c0c050f696a
Revises: 370d45dc3bcc
Create Date: 2026-07-29 15:38:20.728248

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '3c0c050f696a'
down_revision: Union[str, Sequence[str], None] = '370d45dc3bcc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.alter_column(
        "experiences",
        "description",
        existing_type=sa.Text(),
        type_=postgresql.ARRAY(sa.Text()),
        postgresql_using="string_to_array(description, E'\n')",
    )


def downgrade():
    op.alter_column(
        "experiences",
        "description",
        existing_type=postgresql.ARRAY(sa.Text()),
        type_=sa.Text(),
        postgresql_using="array_to_string(description, E'\n')",
    )