# Authority Model

## Layer 1 — Historical evidence

Historical evidence is immutable:

- Original prompt text
- Source artifacts and hashes
- Commit and pull-request metadata
- Test and runtime evidence
- Original timestamps and provenance

Redaction creates a separate projection. It never rewrites the original evidence record.

## Layer 2 — Canonical knowledge

Principles, patterns, canonical prompts, failures, controls, lineages, methodology stages, and
creator-profile claims are versioned records. A change creates a new version and a review/audit
receipt.

## Layer 3 — AI candidates

OpenAI and Anthropic may propose classifications, duplicates, principles, patterns, relationships,
lineages, creator-profile claims, and canonical prompt rewrites.

Candidates are not canonical knowledge. `AI_WRITEBACK_ENABLED=false` is the default and no provider
adapter owns a direct promotion path.

## Layer 4 — Derived projections

Rebuildable projections include lexical/vector indexes, rankings, summaries, graph layouts,
dashboards, and generated display groupings.

Deleting a projection must not destroy source evidence or canonical knowledge.

## Claim ladder

```text
Prompt intent
  ≠ implemented behavior
  ≠ test evidence
  ≠ deployed behavior
  ≠ provider acceptance
  ≠ human acceptance
  ≠ business outcome
```

Every product statement must identify which level it supports.
