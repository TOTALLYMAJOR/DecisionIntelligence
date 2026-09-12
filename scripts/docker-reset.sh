#!/usr/bin/env bash
set -euo pipefail
bash scripts/root-guard.sh >/dev/null

if [[ "${1:-}" != "--confirm-data-loss" ]]; then
  cat >&2 <<'MESSAGE'
This command deletes the local PostgreSQL, Redis, and MinIO Docker volumes.
Run it only with explicit confirmation:

  npm run docker:reset -- --confirm-data-loss
MESSAGE
  exit 2
fi

docker compose down --volumes --remove-orphans
echo "Local Docker application containers and data volumes were removed."
