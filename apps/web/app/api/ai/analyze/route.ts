import { analyzeWithConfiguredProviders, type AiProviderMode } from '@limitless/ai';
import { promptRecords } from '@limitless/core';
import { z } from 'zod';

const requestSchema = z.object({
  mode: z.enum(['mock', 'openai', 'anthropic', 'dual']).default('mock'),
  task: z.enum(['extract-principles', 'propose-patterns', 'profile-claims', 'explain-lineage']),
  instruction: z.string().min(10).max(3_000),
  evidenceIds: z.array(z.string()).min(1).max(30),
});

export async function POST(request: Request) {
  // A production deployment must replace this local-owner gate with authenticated
  // workspace authorization before accepting external traffic.
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: 'invalid-analysis-request', details: parsed.error.flatten() }, { status: 400 });

  const evidence = promptRecords
    .filter((prompt) => parsed.data.evidenceIds.includes(prompt.libraryId))
    .map((prompt) => ({ id: prompt.libraryId, label: prompt.title, text: prompt.originalText, sourceType: 'prompt' as const }));
  if (evidence.length === 0) return Response.json({ error: 'no-known-evidence' }, { status: 404 });

  const result = await analyzeWithConfiguredProviders({
    task: parsed.data.task,
    instruction: parsed.data.instruction,
    evidence,
    maxCandidates: 5,
  }, parsed.data.mode as AiProviderMode);

  return Response.json(result, {
    headers: { 'cache-control': 'no-store' },
  });
}
