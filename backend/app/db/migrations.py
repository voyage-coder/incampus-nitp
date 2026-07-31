import logging
from pathlib import Path

from alembic import command
from alembic.config import Config

logger = logging.getLogger(__name__)


def run_migrations() -> None:
    backend_root = Path(__file__).resolve().parents[2]
    alembic_cfg = Config(str(backend_root / "alembic.ini"))
    logger.info("Running database migrations...")
    command.upgrade(alembic_cfg, "head")
    logger.info("Database migrations complete.")
