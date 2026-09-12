# AGENTS.md — Limitless Architecting OS

## Mission

Build an evidence-grounded architecting intelligence system without allowing model inference,
documentation, or UI state to become historical or canonical authority by implication.

## Environment

- Linux/WSL-first checkout; do not work from `/mnt/c/...` unless explicitly authorized.
- Node.js 22 and npm only. Do not introduce pnpm, Yarn, Bun, or Turbo.
- Resolve the repository root before commands:

```bash
pwd
git rev-parse --show-toplevel
test -f package.json
test -f AGENTS.md
test -d apps
test -d packages
```

Stop on a root mismatch.

## Truth hierarchy

1. Current enforced implementation
2. Executable contracts and tests
3. Commit and pull-request history
4. Runtime/provider/hosted evidence
5. Accepted architecture decisions
6. Canonical documentation
7. Historical documentation
8. Prompt intent
9. Interpretation

## Required workflow

1. Restate the outcome.
2. Perform one bounded discovery pass.
3. Report exact files inspected.
4. Declare the write set, authority boundary, and blocked conditions.
5. Patch the smallest complete slice.
6. Run focused checks, then broader gates.
7. Report exact results, risks, and remaining evidence gaps.
8. Stop when acceptance criteria are met.

## Non-negotiable domain rules

- Historical evidence is append-only and immutable.
- Canonical knowledge changes only through versioned human review.
- AI may propose candidates; AI may not promote them.
- Never fabricate prompt-to-code, prompt-to-commit, or profile-claim relationships.
- Never treat documentation as implementation proof.
- Never treat implementation as deployment proof.
- Never treat deployment as provider proof.
- Never treat provider proof as customer-value proof.
- Preserve founder/product authorship separately from agent-assisted implementation.
- Do not expose secrets, private paths, tenant identifiers, or private source material.

## Repository boundaries

- `packages/core`: pure domain types, compiler, search, fixture truth.
- `packages/ai`: provider adapters and untrusted candidate parsing only.
- `packages/ingestion`: source parsing, checksums, and redaction.
- `packages/db`: durable persistence and migrations.
- `apps/web`: presentation and authenticated request boundaries.
- `apps/worker`: asynchronous execution and retries.

UI code must not call provider SDKs or persistence directly.


## Docker execution rule

- The root `Dockerfile` and `docker-compose.yml` are the canonical full-stack local runtime.
- `docker compose up --build` must start the web app, BullMQ worker, PostgreSQL/pgvector, Redis, MinIO, database bootstrap, and private evidence bucket without requiring AI keys.
- Keep the default Docker baseline at `DATA_MODE=fixture`, `WORKER_MODE=redis`, and `AI_PROVIDER_MODE=mock` until a task explicitly authorizes durable UI wiring or live providers.
- Never bake `.env`, API keys, credentials, prompt archives, or private evidence into an image. Build from the repository root and preserve `.dockerignore`.
- Container health proves process and dependency availability only; it does not prove provider acceptance, corpus ingestion, canonical promotion, or business outcome.
- Use `npm run docker:verify` after Docker-affecting changes when Docker is available.
- `npm run docker:reset -- --confirm-data-loss` is destructive and requires explicit user authorization.
- When workspace package manifests change, keep the dependency-manifest copy list in the root `Dockerfile` synchronized.

## Validation

Minimum for meaningful changes:

```bash
npm run verify:structure
npm run typecheck
npm test
npm run lint
npm run build
```

Do not claim a command passed unless it was executed successfully.

## Git authority

Commit only when explicitly requested. Never push, merge, deploy, rotate secrets, or change
provider configuration without direct authorization.
