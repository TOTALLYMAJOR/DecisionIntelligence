# Starter Validation Report

## Current local verification — 2026-09-12

The repository-grounded Decision Studio slice was verified from the Linux-native WSL checkout with
Node.js 22.22.2. `npm run verify` completed successfully and covered:

- the repository structure, secret scan, architecture boundaries, and static Docker contract;
- workspace TypeScript checks;
- 5 Vitest files and 15 passing tests, including repository-root discovery, scan exclusions,
  evidence grades, request validation, and decision-analysis behavior;
- ESLint, with the existing non-blocking Next.js App Router warning about the pages-directory rule;
- Prisma client generation; and
- the Next.js production build, including `/decisions` and `/api/decisions/analyze`.

Native browser verification covered desktop and mobile layouts, a successful repository-grounded
analysis, the explicit repository-evidence opt-out, and the absence of visible error overlays or
horizontal overflow. The observed snapshot recorded 143 eligible files at that time, was not
capped, and returned 12 ranked evidence records.

This proves focused local behavior in that working tree. It does not prove a Docker runtime scan,
hosted deployment, live provider acceptance, persistence, canonical promotion, human acceptance,
or business outcomes. `npm run verify` checks the Docker contract statically; it does not execute
`npm run docker:verify`.

## Original artifact verification

## Docker conversion result

The starter now has one canonical root Docker runtime.

`docker compose up --build` is designed to start:

- Next.js standalone web application
- BullMQ candidate-analysis worker
- PostgreSQL 17 with pgvector and pg_trgm
- Idempotent PostgreSQL extension initialization
- Redis
- MinIO
- Private MinIO evidence-bucket initialization
- Prisma schema bootstrap and the 20-prompt fixture seed

The default container authority boundary remains:

```text
DATA_MODE=fixture
WORKER_MODE=redis
AI_PROVIDER_MODE=mock
AI_WRITEBACK_ENABLED=false
```

This initializes the durable backend services while keeping the current UI honest about its fixture-backed walking-skeleton data source.

### Executed successfully in the artifact environment

- `node scripts/verify-structure.mjs`
- `node scripts/check-secrets.mjs`
- `node scripts/check-boundaries.mjs`
- `node scripts/check-docker-contract.mjs`
- JSON parsing for package and VS Code configuration
- YAML parsing for both Compose files
- Bash syntax validation for all repository shell scripts
- JavaScript syntax validation for repository scripts
- TypeScript/TSX syntax transpilation for 63 non-generated source files
- Static verification of the eight required Compose services
- Static verification of Docker build stages, workspace manifest copies, health boundaries, backend network isolation, AI writeback default, and build-context secret exclusions

### Not executed in the artifact environment

The current artifact environment does not contain a Docker, Podman, Buildah, or compatible container runtime. Network access to the npm registry is also unavailable (`EAI_AGAIN`). Therefore the following could not be honestly executed here:

- `docker compose config --quiet`
- Docker image builds
- `docker compose up --build`
- Container health checks
- PostgreSQL schema creation and seed inside containers
- Redis and MinIO runtime checks
- `npm install`
- Prisma client generation through installed dependencies
- Framework type checking
- Vitest
- ESLint
- Next.js production build
- Live OpenAI or Anthropic requests

`DOCKER_AGENT_PROMPT.md` and `npm run docker:verify` make these checks mandatory on the first Docker-capable VS Code/WSL run.

### Authority statement

The successful checks prove the repository’s Docker contract, Compose topology, source syntax, security exclusions, and dependency-free structural behavior. They do not prove container runtime compatibility, installed dependency compatibility, database connectivity, AI-provider acceptance, real corpus ingestion, hosted deployment, human acceptance, or business outcome.
