#!/usr/bin/env bash
set -euo pipefail

echo "Importing backend data/artifacts..."

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="${1:-$REPO_ROOT/exports}"

if [ ! -d "$SRC_DIR" ]; then
  echo "Source dir $SRC_DIR not found. Provide path to exported files." >&2
  exit 1
fi

cd "$REPO_ROOT"

# 1) If db.sqlite3 present in export, move/backup existing DB and restore
if [ -f "$SRC_DIR/db.sqlite3" ]; then
  echo "Found exported db.sqlite3. Backing up existing db.sqlite3 to db.sqlite3.bak"
  [ -f db.sqlite3 ] && mv db.sqlite3 db.sqlite3.bak
  cp "$SRC_DIR/db.sqlite3" ./db.sqlite3
else
  echo "No sqlite DB in export. Will attempt fixture loaddata if fixtures file present."
fi

# 2) If fixtures json present, load it
if [ -f "$SRC_DIR/fixtures_all.json" ]; then
  echo "Loading fixtures from $SRC_DIR/fixtures_all.json"
  python manage.py loaddata "$SRC_DIR/fixtures_all.json"
fi

# 3) Unpack media
if [ -f "$SRC_DIR/media.tar.gz" ]; then
  echo "Extracting media.tar.gz"
  tar -xzf "$SRC_DIR/media.tar.gz"
fi

echo "Import complete. Run migrations and collectstatic as needed."
echo "Recommended: python manage.py migrate && python manage.py collectstatic --noinput"
