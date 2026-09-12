import { parseCodexPromptArchive } from '@limitless/ingestion';
import { z } from 'zod';

const requestSchema = z.object({
  source: z.string().min(1).max(1_000_000),
  sourceName: z.string().min(1).max(200).default('preview.md'),
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: 'invalid-ingestion-preview', details: parsed.error.flatten() }, { status: 400 });
  const report = parseCodexPromptArchive(parsed.data.source, parsed.data.sourceName);
  return Response.json({
    sourceName: report.sourceName,
    records: report.records.map(({ originalPromptId, redactedText, contentHash, redactions }) => ({ originalPromptId, redactedText, contentHash, redactions })),
    warnings: report.warnings,
    authorityBoundary: 'Preview returns a redacted projection only. It does not persist evidence or create canonical knowledge.',
  }, { headers: { 'cache-control': 'no-store' } });
}
