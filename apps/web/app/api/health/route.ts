import { fixtureSummary } from '@limitless/core';

export async function GET() {
  return Response.json({
    ok: true,
    service: 'limitless-architecting-os',
    dataMode: process.env.DATA_MODE || 'fixture',
    aiProviderMode: process.env.AI_PROVIDER_MODE || 'mock',
    fixtureSummary,
    authorityBoundary: 'Health confirms process availability only; it does not establish database, provider, or ingestion acceptance.',
  });
}
