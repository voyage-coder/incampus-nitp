from __future__ import annotations

import logging
import os
import platform
import shutil
import tarfile
import urllib.request
from pathlib import Path

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parents[2]
BIN_DIR = BASE_DIR / "bin"
BIN_PATH = BIN_DIR / "tectonic"

# Static musl build — works on Render without extra system libraries.
TECTONIC_URL = (
    "https://github.com/tectonic-typesetting/tectonic/releases/download/"
    "tectonic%400.17.0/tectonic-0.17.0-x86_64-unknown-linux-musl.tar.gz"
)

_installed_engine: str | None = None


def resolve_pdf_engine() -> str | None:
    global _installed_engine

    if _installed_engine and Path(_installed_engine).exists():
        return _installed_engine

    candidates = [
        os.environ.get("TECTONIC_PATH"),
        _installed_engine,
        shutil.which("tectonic"),
        str(BIN_PATH),
        "/tmp/incampus-bin/tectonic",
        shutil.which("pdflatex"),
        "/usr/local/bin/tectonic",
    ]

    for candidate in candidates:
        if candidate and Path(candidate).exists():
            _installed_engine = candidate
            return candidate

    return None


def get_pdf_engine_name() -> str | None:
    engine = resolve_pdf_engine()
    if not engine:
        return None

    name = Path(engine).name.lower()
    if "tectonic" in name:
        return "tectonic"
    if "pdflatex" in name:
        return "pdflatex"
    return name


def ensure_pdf_engine() -> str | None:
    """Install Tectonic on Linux servers when it is missing (e.g. Render Python runtime)."""
    existing = resolve_pdf_engine()
    if existing:
        logger.info("PDF engine ready: %s", existing)
        return existing

    if os.getenv("SKIP_TECTONIC_INSTALL", "").lower() in {"1", "true", "yes"}:
        logger.info("Tectonic auto-install skipped via SKIP_TECTONIC_INSTALL")
        return None

    system = platform.system().lower()
    machine = platform.machine().lower()
    if system != "linux" or machine not in {"x86_64", "amd64"}:
        logger.info(
            "Skipping Tectonic auto-install on %s/%s",
            system,
            machine,
        )
        return None

    try:
        install_dir = BIN_DIR
        try:
            install_dir.mkdir(parents=True, exist_ok=True)
            probe = install_dir / ".write_test"
            probe.write_text("ok", encoding="utf-8")
            probe.unlink(missing_ok=True)
        except OSError:
            install_dir = Path("/tmp/incampus-bin")
            install_dir.mkdir(parents=True, exist_ok=True)

        bin_path = install_dir / "tectonic"
        archive = install_dir / "tectonic.tar.gz"
        logger.info("Downloading Tectonic to %s ...", install_dir)
        urllib.request.urlretrieve(TECTONIC_URL, archive)

        with tarfile.open(archive, "r:gz") as tar:
            tar.extractall(path=install_dir)

        archive.unlink(missing_ok=True)

        if not bin_path.exists():
            raise FileNotFoundError(f"Expected binary missing: {bin_path}")

        bin_path.chmod(0o755)
        global _installed_engine
        _installed_engine = str(bin_path)
        logger.info("Tectonic installed at %s", bin_path)
        return _installed_engine
    except Exception:
        logger.exception("Failed to auto-install Tectonic")
        return None
