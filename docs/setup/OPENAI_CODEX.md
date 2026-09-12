# OpenAI Codex Setup

1. Open the Linux-native repository root in VS Code/WSL.
2. Start Codex from that verified root.
3. Codex must read `AGENTS.md` before acting.
4. Paste `docs/prompts/00_SETUP_REPOSITORY.md` for the first run.
5. Keep `OPENAI_API_KEY` in `.env.local` only when the application itself needs API access.

The application works in `AI_PROVIDER_MODE=mock`; repository setup must not be blocked on API-key
creation.
