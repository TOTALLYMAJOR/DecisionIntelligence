#!/usr/bin/env bash
set -euo pipefail
bash scripts/root-guard.sh >/dev/null
exec npm run dev
