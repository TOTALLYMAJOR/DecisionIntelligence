# Data Model

## Historical records

- `SourceArtifact`
- `Prompt`
- `PromptOccurrence`
- `EvidenceRecord`

## Versioned knowledge

- `KnowledgeEntity`
- `KnowledgeEntityVersion`
- `KnowledgeEdge`
- `Lineage`
- `LineageStep`
- `ProfileClaim`
- `CompilerModule`

## Governance

- `ReviewTask`
- `CompiledPrompt`
- `CompiledPromptModule`
- `AuditEvent`
- `IngestionRun`

## Search

- `SearchDocument`
- `SearchEmbedding`

PostgreSQL full-text and `pg_trgm` provide lexical/fuzzy retrieval. `pgvector` stores OpenAI
embeddings as a derived projection. Search results must retain source IDs and evidence grades.
