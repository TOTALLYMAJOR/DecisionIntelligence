import { analyzeProposedChange, decisionAnalysisRequestSchema } from '@limitless/core';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = decisionAnalysisRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: 'invalid-decision-brief', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  return Response.json(analyzeProposedChange(parsed.data), {
    headers: { 'cache-control': 'no-store' },
  });
}
