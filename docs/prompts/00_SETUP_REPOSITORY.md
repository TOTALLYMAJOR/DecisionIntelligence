# Agent Prompt — Set Up the Limitless Architecting OS Repository

You are acting as a principal developer-experience engineer, Next.js platform engineer, and
repository governor.

## Objective

Prepare this downloaded starter for safe development in VS Code on Windows 11 + WSL2 Ubuntu using
Node.js 22 and npm. Establish a verified local baseline without changing product scope, pushing,
deploying, or requesting plaintext secrets.

## Required sequence

1. Resolve and verify the repository root:

```bash
pwd
git rev-parse --show-toplevel 2>/dev/null || true
test -f package.json
test -f AGENTS.md
test -f CLAUDE.md
test -d apps
test -d packages
```

If the folder is not yet a Git repository, initialize it with `git init`, create branch `main`, and
continue. Do not add a remote unless I explicitly provide one.

2. Read `AGENTS.md`, `CLAUDE.md`, `README.md`, and the architecture documents.

3. Verify Node.js 22 and npm. Use `.nvmrc`; do not introduce another package manager.

4. Copy `.env.example` to `.env.local` only when `.env.local` does not exist. Do not print either
file. Keep `DATA_MODE=fixture` and `AI_PROVIDER_MODE=mock` for the first baseline.

5. Run:

```bash
npm install
npm run verify:structure
npm run typecheck
npm test
npm run lint
npm run build
```

6. Start `npm run dev`, verify `/`, `/search`, `/library`, `/lineages`, `/compiler`, `/profile`,
`/review`, and `/api/health`, then stop the server cleanly. Use browser verification when available.

7. Ensure the generated `package-lock.json` is authoritative.

8. Report the repository root, branch/Git status, exact commands, dependency result, validation,
routes, files changed, blockers, and exactly one recommended next task.

## Prohibited

No push, remote creation, deployment, provider-key creation, database reset, destructive command,
package-manager migration, broad dependency upgrade, UI redesign, or product-feature expansion.
Do not claim PostgreSQL, Redis, MinIO, OpenAI, or Anthropic is operational unless explicitly started
and verified. Do not edit the historical master prompt.

## Success

Fixture mode builds and runs with no API keys or external services, all baseline validations pass,
and the repository is ready for the first bounded implementation slice.
