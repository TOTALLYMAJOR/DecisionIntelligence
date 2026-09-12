# Limitless Architecting OS

A private, evidence-grounded architecting intelligence workbench that turns prompts,
repository history, decisions, failures, and verification evidence into reusable principles,
patterns, lineages, creator-profile claims, and agent-ready execution prompts.

## What is already implemented in this starter

- Next.js 16 App Router frontend with the complete product information architecture.
- Prompt Library and Prompt DNA views.
- Principle, pattern, Failure Lab, project, methodology, review, and creator-profile surfaces.
- React Flow lineage visualization.
- Working Architecting Compiler with module-level provenance.
- Fixture-mode hybrid search and 20-prompt walking-skeleton dataset.
- OpenAI Responses API and Anthropic Messages API adapters behind one governed interface.
- Mock and dual-provider modes; the app runs without API keys.
- BullMQ worker scaffold for asynchronous prompt analysis.
- PostgreSQL/Prisma 7 schema for historical evidence, versioned knowledge, lineages,
  compiler outputs, reviews, and audit events.
- Prompt archive parser, redaction utilities, and tests.
- One-command Docker Compose runtime for the Next.js web app, BullMQ worker, pgvector PostgreSQL, Redis, MinIO, schema bootstrap, and evidence-bucket initialization.
- WSL-first bootstrap scripts, VS Code tasks, `AGENTS.md`, `CLAUDE.md`, and build prompts.

## Current boundary

This is a runnable **walking skeleton**, not a claim that the complete 7,000+ prompt corpus,
production authentication, hosted storage, or every canonical promotion workflow is finished.
Fixture mode demonstrates the product and preserves the authority model. Prisma mode supplies
its durable backend foundation.

## Fastest start — complete Docker stack

Docker Desktop with WSL integration or Docker Engine with Compose v2 is required.

```bash
unzip limitless-architecting-os-starter.zip
cd limitless-architecting-os-starter
docker compose up --build
```

Open `http://127.0.0.1:3000`.

The root stack starts the web app, BullMQ worker, PostgreSQL with pgvector and pg_trgm, Redis, MinIO, the private evidence bucket, Prisma schema bootstrap, and the 20-prompt seed. It requires no OpenAI or Anthropic keys because `AI_PROVIDER_MODE=mock` is the safe default.

Verify the complete stack with:

```bash
npm run docker:verify
```

See `docs/setup/DOCKER.md` and `DOCKER_AGENT_PROMPT.md`.

## Native Node start — no Docker and no AI keys

```bash
cp .env.example .env.local
npm install
npm run dev
```

`DATA_MODE=fixture` and `AI_PROVIDER_MODE=mock` are the defaults, so the demo UI, search, compiler, lineage graph, and analysis route work without external services.

## Infrastructure-only development

```bash
npm run infra:up
npm run db:generate
npm run db:migrate
npm run db:seed
```

The included UI remains fixture-backed until the Prisma repository wiring slice is completed; do not change `DATA_MODE` merely because the database started.

## Enable OpenAI, Claude, or both

Keep keys only in `.env.local` or your deployment secret manager.

```dotenv
AI_PROVIDER_MODE=openai
OPENAI_API_KEY=<secret>
OPENAI_MODEL=gpt-5
```

```dotenv
AI_PROVIDER_MODE=anthropic
ANTHROPIC_API_KEY=<secret>
ANTHROPIC_MODEL=claude-sonnet-4-6
```

```dotenv
AI_PROVIDER_MODE=dual
OPENAI_API_KEY=<secret>
ANTHROPIC_API_KEY=<secret>
```

Dual mode runs independent analyses and returns both evidence-bounded candidates. It does not
silently merge either model's output into canonical knowledge.

## VS Code / WSL

Use a Linux-native checkout, preferably:

```bash
mkdir -p /home/administrator/projects
cd /home/administrator/projects
unzip /path/to/limitless-architecting-os-starter.zip
cd limitless-architecting-os-starter
code .
```

Run **Terminal → Run Task → Bootstrap repository** or paste the setup prompt in
`docs/prompts/00_SETUP_REPOSITORY.md` into Claude Code or OpenAI Codex.

## Commands

```bash
npm run dev                 # fixture-mode web app
npm run dev:worker          # fixture heartbeat by default; set WORKER_MODE=redis for BullMQ
npm run verify:structure    # dependency-free repository contract check
npm run typecheck
npm test
npm run lint
npm run build
npm run verify
npm run docker:up           # complete stack in detached mode
npm run docker:verify       # build, run, and verify every service
npm run docker:logs
npm run docker:down         # preserve data volumes
```

## Authority model

1. **Historical evidence is immutable.**
2. **Canonical knowledge is versioned and human-reviewed.**
3. **AI outputs are candidates only.**
4. **Search indexes, embeddings, rankings, summaries, and graph layouts are disposable projections.**
5. **Implementation, deployment, provider proof, human acceptance, and business outcomes remain distinct.**

See `docs/architecture/AUTHORITY_MODEL.md`.

## Repository map

```text
apps/web          Next.js product experience and APIs
apps/worker       asynchronous analysis worker
packages/core     domain types, fixtures, search, compiler
packages/ai       OpenAI, Anthropic, mock, and dual-provider adapters
packages/db       Prisma schema, client, repository, migration, seed
packages/ingestion archive parsing, hashing, redaction, ingestion CLI
docs              architecture, product specification, prompts, setup
scripts           WSL-first bootstrap and verification
```

## First recommended execution

Open `START_HERE.md`. For the complete container baseline, give `DOCKER_AGENT_PROMPT.md` to Claude Code or OpenAI Codex. For a native Node baseline, use `SETUP_AGENT_PROMPT.md`. The first dependency installation generates the authoritative `package-lock.json`; commit that lockfile with the initialized repository. After the baseline passes, use the numbered prompts in `docs/prompts/` in order.
