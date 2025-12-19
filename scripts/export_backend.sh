#!/usr/bin/env bash
set -euo pipefail

echo "Exporting backend data and artifacts..."

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="${1:-$REPO_ROOT/exports}"
mkdir -p "$OUT_DIR"

cd "$REPO_ROOT"

# 1) Dump Django fixtures (all app data) except auth.permission and contenttypes
echo "Creating Django fixture: $OUT_DIR/fixtures_all.json"
python manage.py dumpdata --natural-foreign --indent 2 --exclude auth.permission --exclude contenttypes > "$OUT_DIR/fixtures_all.json"

# 2) Copy sqlite DB if present
if [ -f db.sqlite3 ]; then
  echo "Copying sqlite database to $OUT_DIR/db.sqlite3"
  cp db.sqlite3 "$OUT_DIR/db.sqlite3"
else
  echo "No db.sqlite3 found in repo root. If you use Postgres, export via pg_dump (see README)."
fi

# 3) Export media files (if any)
if [ -d media ]; then
  echo "Archiving media/ to $OUT_DIR/media.tar.gz"
  tar -czf "$OUT_DIR/media.tar.gz" media
fi

echo "Export complete. Files in: $OUT_DIR"
echo "Recommended: transfer the $OUT_DIR contents to the collaborator securely (scp/s3/gh release)."
