import { searchKnowledge } from '@limitless/core';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q')?.trim() || '';
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || 30), 1), 100);
  return Response.json({ query, results: query ? searchKnowledge(query, limit) : [] });
}
