import { createHash } from 'node:crypto';
import { redactSensitiveText } from './redaction';
import type { ArchiveParseReport, ArchivePromptRecord } from './types';

const field = (block: string, label: string) => {
  const match = block.match(new RegExp(`^- ${label}:\\s*(.+)$`, 'im'));
  return match?.[1]?.trim() || null;
};

const extractPromptText = (block: string) => {
  const fenced = [...block.matchAll(/```(?:``)?(?:text)?\s*\n([\s\S]*?)\n```(?:``)?/g)];
  if (fenced.length > 0) return fenced.at(-1)?.[1]?.trim() || '';
  const requestMarker = block.match(/## My request for Codex:\s*\n([\s\S]*)/i);
  return requestMarker?.[1]?.trim() || '';
};

export const parseCodexPromptArchive = (source: string, sourceName = 'codex-prompts.md'): ArchiveParseReport => {
  const headings = [...source.matchAll(/^## Prompt\s+(\d+)\s*$/gm)];
  const records: ArchivePromptRecord[] = [];
  const warnings: string[] = [];

  headings.forEach((heading, index) => {
    const start = heading.index ?? 0;
    const end = headings[index + 1]?.index ?? source.length;
    const block = source.slice(start, end);
    const originalPromptId = `Prompt ${heading[1]}`;
    const originalText = extractPromptText(block);
    if (!originalText) {
      warnings.push(`${originalPromptId}: no prompt text extracted.`);
      return;
    }
    const redacted = redactSensitiveText(originalText);
    records.push({
      originalPromptId,
      timestamp: field(block, 'Timestamp'),
      sessionId: field(block, 'Session'),
      workingDirectory: field(block, 'Working directory'),
      source: field(block, 'Source'),
      sha256: field(block, 'SHA-256'),
      originalText,
      redactedText: redacted.text,
      contentHash: createHash('sha256').update(originalText).digest('hex'),
      redactions: redacted.redactions,
    });
  });

  if (headings.length === 0) warnings.push('No "## Prompt <id>" headings were found.');
  return { sourceName, records, warnings };
};
