#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN_DIR="$ROOT_DIR/bin"
TECTONIC_URL="https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.17.0/tectonic-0.17.0-x86_64-unknown-linux-gnu.tar.gz"

mkdir -p "$BIN_DIR"

if [ ! -x "$BIN_DIR/tectonic" ]; then
  echo "Installing Tectonic PDF engine..."
  curl -fsSL -o /tmp/tectonic.tar.gz "$TECTONIC_URL"
  tar xzf /tmp/tectonic.tar.gz -C "$BIN_DIR"
  chmod +x "$BIN_DIR/tectonic"
  rm -f /tmp/tectonic.tar.gz
  "$BIN_DIR/tectonic" --version
fi

pip install -r requirements.txt
