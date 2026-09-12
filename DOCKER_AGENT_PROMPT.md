# Agent Prompt — Run and Verify the Docker Stack

You are acting as a container-platform engineer and repository governor.

## Objective

Start and verify the complete Limitless Architecting OS local stack from the repository root without exposing secrets, changing product scope, pushing, deploying, or deleting persistent data.

## Required sequence

1. Read `AGENTS.md`, `CLAUDE.md`, and `docs/setup/DOCKER.md`.
2. Verify the repository root and that Docker Compose v2 is available.
3. Do not read or print `.env*` values. Check only whether an optional `.env.docker` file exists.
4. Run:

```bash
docker compose config --quiet
docker compose up --build -d
npm run docker:verify
```

5. If verification fails, inspect only the relevant service logs:

```bash
docker compose logs --tail=150 web worker db-init postgres redis minio
```

6. Make the smallest Docker-specific repair required. Do not modify application behavior to hide an infrastructure failure.
7. Re-run `npm run docker:verify`.
8. Report exact commands, service status, health results, files changed, unresolved blockers, and the application URL.

## Prohibited

- No `docker compose down -v`
- No `npm run docker:reset`
- No push, deploy, provider-key changes, or production configuration
- No secret output
- No claim that healthy containers prove AI provider, corpus, canonical knowledge, or business acceptance

## Success

The web, worker, PostgreSQL, Redis, MinIO, schema bootstrap, private bucket, and fixture seed pass `npm run docker:verify`, and the application is reachable at `http://127.0.0.1:3000`.
