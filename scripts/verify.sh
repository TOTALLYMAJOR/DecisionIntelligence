#!/usr/bin/env bash
set -euo pipefail
bash scripts/root-guard.sh >/dev/null
npm run verify:structure
npm run check:secrets
npm run check:boundaries
npm run check:docker
npm run typecheck
npm test
npm run lint
npm run build
