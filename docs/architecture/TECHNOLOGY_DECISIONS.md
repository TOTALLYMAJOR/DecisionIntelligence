# Technology Decisions — August 2026 Baseline

## Application

- **Node.js 22 + npm workspaces** — one Linux/WSL-first toolchain and lockfile.
- **Next.js 16.2.11 + React 19.2 + TypeScript** — App Router workbench, server-rendered research surfaces, and bounded API routes. The baseline uses the July 2026 Active LTS security patch.
- **React Flow** — lineage and causal graph projection; graph layout is never canonical authority.

## Durable backend

- **PostgreSQL + Prisma ORM 7.8** — relational source of truth, versioned knowledge, evidence links, review tasks, compiled prompts, and audit events.
- **pg_trgm + PostgreSQL full-text search** — exact, lexical, and fuzzy retrieval.
- **pgvector** — semantic embeddings as a rebuildable projection.
- **Redis + BullMQ** — asynchronous ingestion, analysis, retry, and export coordination only.
- **S3-compatible object storage / MinIO locally** — original evidence objects and exports.

## AI

- **OpenAI Responses API** through the official `openai` TypeScript SDK.
- **Anthropic Messages API** through the official `@anthropic-ai/sdk` package.
- **Mock mode** for deterministic no-key development.
- **Dual mode** returns independent provider analyses; it never silently synthesizes or promotes them.

## Authority decision

Provider SDKs are isolated in `packages/ai`. Model output is parsed through a strict Zod candidate schema, retains provider/model provenance, and requires human review. Hashing, redaction, exact matching, compilation assembly, promotion authority, and audit receipts remain deterministic.

## Deferred until evidence justifies them

- Separate graph database
- Microservices
- Kubernetes
- Autonomous canonical promotion
- Public multi-user publishing
- A vector-only search architecture
