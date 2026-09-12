# Authority Model

## Layer 1 — Historical evidence

Historical evidence is immutable:

- Original prompt text
- Source artifacts and hashes
- Commit and pull-request metadata
- Test and runtime evidence
- Original timestamps and provenance

Redaction creates a separate projection. It never rewrites the original evidence record.

## Layer 2 — Bounded repository observation

Decision Studio may inspect eligible static files from a server-controlled repository root. The
result is an ephemeral observation with a manifest hash, relative file paths, content hashes, and
an observation timestamp.

- `VERIFIED` means the scanner observed the listed file bytes and computed their hashes.
- `INFERRED` means lexical matches suggest relevance to the decision brief.
- The current slice does not persist the snapshot as immutable historical evidence.
- A manifest hash identifies that observation; it is not a durable receipt, execution trace, or
  approval.

Repository observations cannot directly modify the repository, promote canonical knowledge, or
authorize an implementation. See [`REPOSITORY_EVIDENCE.md`](REPOSITORY_EVIDENCE.md).

## Layer 3 — Canonical knowledge

Principles, patterns, canonical prompts, failures, controls, lineages, methodology stages, and
creator-profile claims are versioned records. A change creates a new version and a review/audit
receipt.

## Layer 4 — AI candidates

OpenAI and Anthropic may propose classifications, duplicates, principles, patterns, relationships,
lineages, creator-profile claims, and canonical prompt rewrites.

Candidates are not canonical knowledge. `AI_WRITEBACK_ENABLED=false` is the default and no provider
adapter owns a direct promotion path.

## Layer 5 — Derived projections

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

For repository grounding, the narrower ladder is:

```text
Static file bytes observed
  ≠ file relevance proven
  ≠ code path reached or executed
  ≠ runtime impact proven
  ≠ change authorized
```

Every product statement must identify which level it supports.
