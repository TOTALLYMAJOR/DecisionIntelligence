# VS Code and WSL Setup

1. Keep the checkout on the Linux filesystem:

```bash
mkdir -p /home/administrator/projects
cd /home/administrator/projects
unzip /path/to/limitless-architecting-os-starter.zip
cd limitless-architecting-os-starter
code .
```

2. In VS Code, install the recommended extensions.
3. Run `nvm use`.
4. Run **Terminal → Run Task → Bootstrap repository**.
5. Start the app with the **Start web** task.
6. Use the integrated terminal for Claude Code or OpenAI Codex.

Avoid active development from `/mnt/c/...` because filesystem watching and dependency operations are
less reliable than a Linux-native checkout.
