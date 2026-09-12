import { describe, expect, it } from 'vitest';
import { parseCodexPromptArchive } from './archive-parser';
import { redactSensitiveText } from './redaction';

const sample = `# Codex Prompt Archive\n\n## Prompt 0001\n\n- Timestamp: 2026-01-01T00:00:00Z\n- Session: session-1\n- Working directory: /home/alice/project\n- Source: sample.jsonl\n- SHA-256: abc\n\n\`\`\`text\nLOOK TO THE ARCHITECTURE, NOT DOCUMENTS\n\`\`\`\n`;

describe('prompt archive ingestion', () => {
  it('preserves original text and creates a redacted projection', () => {
    const report = parseCodexPromptArchive(sample);
    expect(report.records).toHaveLength(1);
    expect(report.records[0]?.originalText).toContain('ARCHITECTURE');
    expect(report.records[0]?.contentHash).toHaveLength(64);
  });

  it('redacts credentials and private local homes without retaining values', () => {
    const fakeKey = ['sk', 'proj', 'abcdefghijklmnop'].join('-');
    const redacted = redactSensitiveText(`key ${fakeKey} path /home/major/repo email owner@example.com`);
    expect(redacted.text).not.toContain('abcdefghijklmnop');
    expect(redacted.text).not.toContain('/home/major');
    expect(redacted.redactions).toContain('openai-api-key');
    expect(redacted.redactions).toContain('wsl-user-path');
  });
});
