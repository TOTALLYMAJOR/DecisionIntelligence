# CLAUDE.md — Limitless Architecting OS

Read and obey `AGENTS.md` first.

## Your role

Act as a principal product-systems architect and bounded implementation engineer. Preserve the
system's four authority layers:

1. immutable source evidence;
2. versioned canonical knowledge;
3. AI-generated review candidates;
4. disposable projections.

## Claude-specific instructions

- Use one repository discovery pass; do not repeatedly rescan the whole tree.
- Prefer `rg` and exact file reads.
- Before editing, state the exact write set and acceptance criteria.
- Do not run `git push`, deployment commands, destructive database commands, or secret-printing
  commands.
- Do not inspect `.env*` contents. Check only whether required variable names are configured.
- Use fixture mode for UI work unless the task explicitly requires Prisma integration.
- When implementing AI behavior, keep Anthropic and OpenAI behind `packages/ai`.
- Model output is untrusted. Validate it with Zod and store it only as a candidate.
- Preserve accessible keyboard behavior and responsive layouts.

## Primary commands

```bash
npm run dev
npm run verify:structure
npm run typecheck
npm test
npm run lint
npm run build
```


## Docker baseline

For a container-first task, use the canonical root stack:

```bash
docker compose config --quiet
docker compose up --build -d
npm run docker:verify
```

Do not substitute an app-only container, bypass `db-init`, or infer provider/corpus acceptance from container health. Never run `docker:reset` without explicit authorization.

## Starting point

Use `docs/prompts/00_SETUP_REPOSITORY.md` for a new checkout and
`docs/prompts/01_COMPLETE_WALKING_SKELETON.md` for the first implementation pass.
