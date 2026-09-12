import { compileArchitectingPrompt, compilerRequestSchema } from '@limitless/core';

export async function POST(request: Request) {
  const parsed = compilerRequestSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: 'invalid-compiler-request', details: parsed.error.flatten() }, { status: 400 });
  try {
    return Response.json(compileArchitectingPrompt(parsed.data.problem, parsed.data.moduleIds));
  } catch (error) {
    return Response.json({ error: 'compiler-failed', message: error instanceof Error ? error.message : 'Unknown compiler failure.' }, { status: 422 });
  }
}
