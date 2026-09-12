# Docker Full-Stack Runtime

The root Compose stack is the canonical one-command local runtime for Limitless Architecting OS.

## What starts

```text
web            Next.js standalone application on http://127.0.0.1:3000
worker         BullMQ candidate-analysis worker
postgres       PostgreSQL 17 with pgvector and pg_trgm
postgres-init  idempotent extension initialization
redis          BullMQ queue and runtime coordination
minio          private S3-compatible evidence storage
minio-init     private evidence bucket creation
db-init        Prisma schema push and fixture seed
```

The default container baseline uses:

```text
DATA_MODE=fixture
WORKER_MODE=redis
AI_PROVIDER_MODE=mock
```

The UI therefore remains honest about its walking-skeleton data source while the durable database, queue, and object-storage paths are initialized and verified.

## Repository-grounding availability

The current standalone `web` image contains the built Next.js runtime, static assets, and public
assets. It does not contain or mount the full source checkout, and Compose does not set
`REPOSITORY_SCAN_ROOT`. Decision Studio therefore normally degrades to analysis without a
repository snapshot in the default Docker stack.

This is an intentional evidence boundary, not a container health failure. Enabling repository
access in a container requires a separate operator decision about a server-visible, read-only
source mount, root configuration, authorization, and isolation. That capability is not claimed by
the current Compose contract. Native Node execution from the governed checkout is the supported
way to exercise the repository-grounding slice today.

## Prerequisites

- Docker Desktop with WSL integration, or Docker Engine on Linux
- Docker Compose v2 (`docker compose`)
- At least 6 GB of available Docker memory is recommended for the first dependency build

## Run

```bash
docker compose up --build
```

Detached mode:

```bash
npm run docker:up
```

Then open:

```text
Application:   http://127.0.0.1:3000
Health:        http://127.0.0.1:3000/api/health
MinIO console: http://127.0.0.1:9001
```

Default MinIO development credentials are defined in Compose and may be overridden through `.env.docker`. They are local-development values, not production credentials.

## Verify

```bash
npm run docker:verify
```

The verification script checks:

- Compose configuration
- Image build and startup
- Web health
- PostgreSQL schema and 20-prompt seed
- Redis response
- Private MinIO evidence bucket
- Worker readiness
- Host-accessible health endpoint

It does not assert that the web container can inspect the host repository checkout.

## Optional overrides

```bash
cp .env.docker.example .env.docker
# edit only local values; never commit the populated file
docker compose --env-file .env.docker up --build -d
```

## Logs and status

```bash
npm run docker:ps
npm run docker:logs
```

## Stop without deleting data

```bash
npm run docker:down
```

## Destructive reset

This deletes the local PostgreSQL, Redis, and MinIO volumes:

```bash
npm run docker:reset -- --confirm-data-loss
```

Never use the destructive reset when the local evidence vault contains material that has not been backed up.

## Authority boundary

A healthy Docker stack proves that the local processes and dependencies are available. It does not prove:

- Repository-snapshot availability inside the standalone web image
- OpenAI or Anthropic provider acceptance
- Real prompt-corpus ingestion
- Canonical knowledge promotion
- Hosted authentication
- Production deployment
- Customer or business outcomes
