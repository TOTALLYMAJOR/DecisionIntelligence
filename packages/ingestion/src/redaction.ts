const patterns: Array<{ name: string; regex: RegExp; replacement: string }> = [
  { name: 'openai-api-key', regex: /\bsk-(?:proj-)?[A-Za-z0-9_-]{16,}\b/g, replacement: '[REDACTED_OPENAI_KEY]' },
  { name: 'anthropic-api-key', regex: /\bsk-ant-[A-Za-z0-9_-]{16,}\b/g, replacement: '[REDACTED_ANTHROPIC_KEY]' },
  { name: 'bearer-token', regex: /\bBearer\s+[A-Za-z0-9._~-]{16,}\b/gi, replacement: 'Bearer [REDACTED_TOKEN]' },
  { name: 'private-key', regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g, replacement: '[REDACTED_PRIVATE_KEY]' },
  { name: 'windows-user-path', regex: /[A-Za-z]:\\Users\\[^\\\s]+/g, replacement: '<WINDOWS_HOME>' },
  { name: 'wsl-user-path', regex: /\/home\/[^/\s]+/g, replacement: '<LINUX_HOME>' },
  { name: 'email', regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, replacement: '[REDACTED_EMAIL]' },
  { name: 'github-token', regex: /\b(?:ghp|github_pat)_[A-Za-z0-9_]{20,}\b/g, replacement: '[REDACTED_GITHUB_TOKEN]' },
];

export const redactSensitiveText = (input: string) => {
  let text = input;
  const redactions = new Set<string>();
  for (const pattern of patterns) {
    if (pattern.regex.test(text)) {
      redactions.add(pattern.name);
      pattern.regex.lastIndex = 0;
      text = text.replace(pattern.regex, pattern.replacement);
    }
    pattern.regex.lastIndex = 0;
  }
  return { text, redactions: [...redactions] };
};
