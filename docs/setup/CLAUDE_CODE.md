# Claude Code Setup

1. Install Claude Code using Anthropic's current official method.
2. Open the repository in a WSL terminal.
3. Confirm `pwd` and `git rev-parse --show-toplevel` resolve to the same root.
4. Run `/setup-repo` from `.claude/commands` or paste
   `docs/prompts/00_SETUP_REPOSITORY.md`.
5. Claude must read `AGENTS.md` and `CLAUDE.md` before edits.

The application API key `ANTHROPIC_API_KEY` is separate from repository-agent authentication. Never
paste either credential into prompts or tracked files.
