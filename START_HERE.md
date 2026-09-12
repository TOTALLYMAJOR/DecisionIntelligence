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

Give Claude Code or OpenAI Codex the complete contents of `DOCKER_AGENT_PROMPT.md` to execute and repair this baseline.

## Native Node alternative

1. Copy `.env.example` to `.env.local`.
2. Run `npm install`.
3. Run `npm run dev`.
4. Give Claude Code or OpenAI Codex the complete contents of `SETUP_AGENT_PROMPT.md`.

After the walking skeleton passes, use the numbered prompts in `docs/prompts/` in order.

Do not put API keys in source, chat transcripts, committed files, Docker images, build arguments, or screenshots.
