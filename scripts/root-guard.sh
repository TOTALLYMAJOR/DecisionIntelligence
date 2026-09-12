#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

for marker in package.json AGENTS.md apps packages; do
  if [[ ! -e "$marker" ]]; then
    echo "Repository root guard failed: missing $marker in $ROOT" >&2
    exit 1
  fi
done

printf '%s\n' "$ROOT"
