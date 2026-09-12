import { analyzeProposedChange, decisionAnalysisRequestSchema } from '@limitless/core';
import { findRepositoryRoot, scanRepositoryEvidence } from '@limitless/ingestion';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = decisionAnalysisRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: 'invalid-decision-brief', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  let repositorySnapshot = null;
  if (parsed.data.includeRepositoryEvidence) {
    try {
      const repositoryRoot =
        process.env.REPOSITORY_SCAN_ROOT || (await findRepositoryRoot(process.cwd()));
      repositorySnapshot = await scanRepositoryEvidence(
        repositoryRoot,
        [parsed.data.change, parsed.data.desiredOutcome, parsed.data.constraints].join(' '),
      );
    } catch {
      repositorySnapshot = null;
    }
  }

  return Response.json(analyzeProposedChange(parsed.data, repositorySnapshot), {
    headers: { 'cache-control': 'no-store' },
  });
}
