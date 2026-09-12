# Repository Evidence Contract

Decision Studio can attach a bounded, read-only observation of repository-relative static files to
a decision brief. This is an investigation aid: it connects a proposed change to likely affected
code, tests, schemas, configuration, governance, and documentation without pretending that static
inspection proves runtime behavior.

## Request and data flow

```text
Decision brief + include/omit flag
              │
              ▼
POST /api/decisions/analyze
              │
              ▼
Resolve server-controlled scan root
              │
              ▼
Bounded static scan in @limitless/ingestion
              │
              ▼
Repository snapshot + fixture precedents
              │
              ▼
Deterministic analysis projection in @limitless/core
              │
              ▼
Decision Studio consequences, postures, and contract draft
```

The route does not write to the repository, persist the snapshot, promote canonical knowledge, or
invoke an AI provider for this deterministic analysis.

## Root selection

Root selection is controlled by the server, never by a browser-provided path:

1. If `REPOSITORY_SCAN_ROOT` is set, its value is used as the server-visible directory.
2. Otherwise, discovery starts at the server working directory and searches up to eight levels for
   a directory containing both `package.json` and `AGENTS.md`.
3. If no usable directory is found, repository grounding is unavailable and the analysis continues
   without a snapshot.

An explicit `REPOSITORY_SCAN_ROOT` is an operator trust decision and bypasses marker-based root
discovery. Point it only at a directory the server process is authorized to inspect.

## Bounded scan defaults

| Control                   | Default | Hard bound |
| ------------------------- | ------: | ---------: |
| Eligible files inspected  |     500 |      2,000 |
| Bytes read per file       | 192,000 |  1,000,000 |
| Evidence records returned |      12 |         50 |
| Meaningful query terms    |      32 |         32 |

Reaching the file cap marks the snapshot partial and adds a warning. Files larger than the
configured per-file limit are skipped.

### Eligible extensions

`.cjs`, `.css`, `.js`, `.json`, `.jsx`, `.md`, `.mjs`, `.prisma`, `.sql`, `.toml`, `.ts`, `.tsx`,
`.yaml`, and `.yml`.

### Exclusions

- Directories: `.git`, `.next`, `.turbo`, `.cache`, `build`, `coverage`, `dist`, `generated`,
  `node_modules`, and `out`.
- Private paths: `var/evidence/**` and `var/exports/**`.
- Lockfiles: `package-lock.json`, `pnpm-lock.yaml`, and `yarn.lock`.
- Sensitive-looking files: `.env*`, filenames containing `credential` or `secret`, `id_rsa`, and
  `.key`, `.p12`, `.pem`, or `.pfx` files.
- Symbolic links and unsupported file types.

The scan order is deterministic. Evidence ranking uses meaningful brief terms, path matches,
governed impact-domain vocabulary, and a small file-kind boost. Ranking is lexical and remains an
inference.

## Snapshot contents and grades

The browser receives repository name, observation time, manifest hash, inspected-file count, cap
state, warnings, and a ranked evidence list. Each evidence record contains:

- a stable identifier for its path and content hash;
- repository-relative path, byte size, line count, and SHA-256 content hash;
- classified file kind and matched brief terms;
- impact domains detected only from the governed domain vocabulary; and
- separate source and relevance grades.

| Grade                         | Meaning                                                                |
| ----------------------------- | ---------------------------------------------------------------------- |
| Source `VERIFIED`             | The listed static file bytes were read and hashed in this observation. |
| Relevance `INFERRED`          | Lexical matches suggest the file may matter to the decision.           |
| Runtime or implementation     | Not established by the snapshot.                                       |
| Authorization or canonicality | Not established by the snapshot.                                       |

The manifest is SHA-256 over the sorted set of `relativePath:contentHash` entries for all eligible
inspected files, not only the returned evidence records. It identifies observed content but is not
a durable evidence receipt because the current slice does not persist or sign it.

No source excerpts, file bodies, absolute paths, Git history, diffs, branches, commits, execution
traces, or provider responses are returned.

## Failure and opt-out behavior

- The user can disable **Ground in this repository** before mapping consequences.
- If grounding is requested but root discovery or scanning fails, the route returns the analysis
  without a snapshot rather than failing the entire request.
- The UI distinguishes an omitted or unavailable snapshot from a successful observation.
- No snapshot must be interpreted as no repository impact; it means no repository evidence was
  attached.

## Security and privacy boundary

The exclusion policy reduces accidental exposure but is not a secret scanner or publication
guarantee. Eligible source files can contain sensitive data, and the server reads their contents in
memory to hash and match them. Only run the scanner against an authorized root. A multi-user or
hosted version requires explicit tenant authorization, path isolation, audit receipts, rate and
resource controls, and review of what metadata may leave the server.

## Native and Docker availability

- **Native Node from the governed checkout:** default root discovery can find the repository and is
  the supported way to exercise this slice.
- **Default Docker Compose stack:** the standalone web image does not contain or mount the full
  checkout and does not configure `REPOSITORY_SCAN_ROOT`, so analysis normally continues without a
  repository snapshot.

A healthy Docker stack does not prove repository-snapshot availability. Container access to a host
checkout must be designed and validated separately as an explicit read-only security boundary.

## Verification

Focused coverage lives in:

- `packages/ingestion/src/repository-scanner.test.ts`
- `packages/core/src/decision.test.ts`
- `apps/web/app/api/decisions/analyze/route.ts`

Run the local gates from the governed WSL checkout with Node.js 22:

```bash
npm run verify:structure
npm run check:secrets
npm run typecheck
npm test
npm run lint
npm run build
```

Browser verification should cover a successful grounded request, the opt-out path, an unavailable
snapshot, desktop and mobile layout, and visible separation between `VERIFIED` source observation
and `INFERRED` relevance.
