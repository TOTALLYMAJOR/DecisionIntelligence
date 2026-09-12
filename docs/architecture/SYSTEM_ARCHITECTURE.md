# System Architecture

```text
Durable knowledge path                  Ephemeral decision path

Prompt archives / uploaded evidence     Decision brief
                │                              │
                ▼                              ├───────────────┐
      Ingestion and redaction                   ▼               ▼
                │                       Fixture precedents  Bounded repository scan
     ┌──────────┴──────────┐                    │               │
     ▼                     ▼                    └───────┬───────┘
Immutable evidence   Candidate analysis                 ▼
     │                OpenAI / Anthropic        Decision analysis projection
     └──────────┬──────────┘                            │
                ▼                                       │
    Versioned knowledge authority                       │
                │                                       │
     ┌──────────┼───────────────┐                       │
     ▼          ▼               ▼                       ▼
Hybrid search  Compiler   Creator profile        Decision Studio
     └──────────┼───────────────┘
                ▼
         Next.js workbench
```

The ephemeral decision path does not write into immutable evidence or versioned knowledge. A
human-reviewed promotion workflow would be a separate, audited capability.

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

Repository scanning also belongs in `packages/ingestion`, but is invoked by the server-only
Decision Studio route. The browser sends only the brief and an include/omit flag. Root selection,
file access, limits, hashing, and exclusions remain server controlled.

Canonical domain behavior belongs in `packages/core` and persistence adapters in `packages/db`.

The resulting decision analysis is a derived projection. Repository source observation may be
`VERIFIED`; its relevance and all change consequences remain `INFERRED` until stronger evidence is
attached.
