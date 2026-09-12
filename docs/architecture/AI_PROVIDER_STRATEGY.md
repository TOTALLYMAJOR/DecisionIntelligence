# AI Provider Strategy

## Modes

- `mock`: deterministic local analysis; no network or keys.
- `openai`: OpenAI Responses API.
- `anthropic`: Anthropic Messages API.
- `dual`: independent OpenAI and Anthropic analyses returned together for human comparison.

## Governing rule

Model output is untrusted input. It must use a bounded prompt, return JSON text, parse through a
Zod schema, retain provider/model provenance, identify evidence still required, and remain a review
candidate.

Dual mode does not use a third model to silently synthesize truth. The review surface shows both
candidate analyses and records human disposition later.

## Recommended division of labor

- OpenAI: structured extraction, candidate classification, embeddings, compiler assistance.
- Anthropic: independent critique, architectural counterexample generation, lineage challenge.
- Deterministic code: hashing, redaction, exact matching, scoring bounds, promotion authority,
  compilation assembly, and audit receipts.
