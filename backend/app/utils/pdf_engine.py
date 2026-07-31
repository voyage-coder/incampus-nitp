from __future__ import annotations

import os
import shutil
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]


def resolve_pdf_engine() -> str | None:
    candidates = [
        os.environ.get("TECTONIC_PATH"),
        shutil.which("tectonic"),
        str(BASE_DIR / "bin" / "tectonic"),
        shutil.which("pdflatex"),
        "/usr/local/bin/tectonic",
    ]

    for candidate in candidates:
        if candidate and Path(candidate).exists():
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
