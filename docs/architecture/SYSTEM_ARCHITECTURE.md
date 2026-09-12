# System Architecture

```text
Prompt archives / Git repositories / uploaded evidence
                    │
                    ▼
          Ingestion and redaction
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
Immutable evidence        Candidate analysis
        │                  OpenAI / Anthropic
        └───────────┬───────────┘
                    ▼
        Versioned knowledge authority
                    │
        ┌───────────┼───────────────┐
        ▼           ▼               ▼
Hybrid search   Compiler       Creator profile
        └───────────┼───────────────┘
                    ▼
             Next.js workbench
```

## Runtime allocation

- **Next.js web/API:** interactive reads, search, compiler, review, and bounded mutations.
- **BullMQ worker:** ingestion, redaction, classification, embedding, lineage analysis, and exports.
- **PostgreSQL:** durable evidence metadata, canonical knowledge, relationships, reviews, audit.
- **Redis:** queue coordination and retry state only.
- **S3-compatible storage:** original source archives, screenshots, and export packages.

## Process boundaries

Provider calls belong in `packages/ai`. Browser components never receive provider secrets and do
not import provider SDKs.

Historical parsing and redaction belong in `packages/ingestion`.

Canonical domain behavior belongs in `packages/core` and persistence adapters in `packages/db`.
