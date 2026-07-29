"""change project description to text array

Revision ID: 370d45dc3bcc
Revises: 090dea1d5eef
Create Date: 2026-07-29 15:10:50.529487

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from sqlalchemy.dialects import postgresql
# revision identifiers, used by Alembic.
revision: str = '370d45dc3bcc'
down_revision: Union[str, Sequence[str], None] = '090dea1d5eef'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.alter_column(
        "projects",
        "description",
        existing_type=sa.Text(),
        type_=postgresql.ARRAY(sa.Text()),
        postgresql_using="string_to_array(description, E'\n')"
    )

def downgrade():
    op.alter_column(
        "projects",
        "description",
        existing_type=postgresql.ARRAY(sa.Text()),
        type_=sa.Text(),
        postgresql_using="array_to_string(description, E'\n')"
    )