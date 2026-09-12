# Start Here

## Recommended: Docker-first

1. Move this folder into a Linux-native WSL path such as `/home/administrator/projects/limitless-architecting-os-starter`.
2. Open it in VS Code with `code .`.
3. Ensure Docker Desktop WSL integration or Docker Engine with Compose v2 is available.
4. Run:

```bash
docker compose up --build
```

5. Open `http://127.0.0.1:3000`.
6. In a second terminal, run `npm run docker:verify`.

The full Docker baseline starts the application, worker, PostgreSQL, Redis, MinIO, schema bootstrap, private evidence bucket, and fixture seed. It uses mock AI and requires no API keys.

The default standalone web image does not include or mount the full repository checkout. The
Decision Studio remains usable, but repository grounding normally reports unavailable and the
analysis continues with the decision brief and fixture precedents.

Give Claude Code or OpenAI Codex the complete contents of `DOCKER_AGENT_PROMPT.md` to execute and repair this baseline.

## Native Node alternative

1. Copy `.env.example` to `.env.local`.
2. Run `npm install`.
3. Run `npm run dev`.
4. Give Claude Code or OpenAI Codex the complete contents of `SETUP_AGENT_PROMPT.md`.

Running the server from the governed checkout also enables the bounded repository snapshot used
by Decision Studio. No browser-provided filesystem path is accepted.

## Try the current product slice

1. Open `http://127.0.0.1:3000/decisions`.
2. Load an example or enter a proposed change, desired outcome, and constraints.
3. Leave **Ground in this repository** enabled for a native checkout, or disable it to exercise the
   explicit opt-out path.
4. Select **Map consequences**.
5. Inspect the repository snapshot status, affected domains, prior evidence, posture comparison,
   and the generated decision-contract draft.
6. Choose a posture and copy the draft for human review.

The snapshot verifies only that eligible static file bytes and matched terms were observed. File
relevance remains inferred, and the result does not prove execution, runtime impact, deployment,
provider acceptance, or authorization. See
[`docs/architecture/REPOSITORY_EVIDENCE.md`](docs/architecture/REPOSITORY_EVIDENCE.md).

After the walking skeleton passes, use the numbered prompts in `docs/prompts/` in order.

Do not put API keys in source, chat transcripts, committed files, Docker images, build arguments, or screenshots.
