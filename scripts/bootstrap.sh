#!/usr/bin/env bash
set -euo pipefail

ROOT="$(bash scripts/root-guard.sh)"
cd "$ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required." >&2
  exit 1
fi

NODE_MAJOR="$(node -p 'process.versions.node.split(`.`)[0]')"
if [[ "$NODE_MAJOR" != "22" ]]; then
  echo "Node.js 22 is required; found $(node -v). Run: nvm use" >&2
  exit 1
fi

if [[ ! -f .env.local ]]; then
  cp .env.example .env.local
  echo "Created .env.local from .env.example (no secrets added)."
fi

npm install
npm run verify:structure

echo
echo "Fixture-mode setup complete. Start with: npm run dev"
echo "For PostgreSQL/Redis: npm run infra:up && npm run db:generate && npm run db:migrate && npm run db:seed"
