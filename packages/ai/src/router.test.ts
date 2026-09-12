import { describe, expect, it } from 'vitest';
import { analyzeWithConfiguredProviders, resolveProviderMode } from './router';

const request = {
  task: 'extract-principles' as const,
  instruction: 'Extract only evidence-grounded candidate principles.',
  evidence: [
    { id: 'P-1', label: 'Prompt one', text: 'Evidence before claims.', sourceType: 'prompt' as const },
    { id: 'T-1', label: 'Test one', text: 'The negative assertion prevents unsupported payment claims.', sourceType: 'test' as const },
  ],
};

describe('AI provider router', () => {
  it('defaults to deterministic mock mode', () => {
    expect(resolveProviderMode(undefined)).toBe('mock');
    expect(resolveProviderMode('nonsense')).toBe('mock');
  });

  it('returns candidate-only mock analysis', async () => {
    const result = await analyzeWithConfiguredProviders(request, 'mock');
    expect(result.results[0]?.status).toBe('completed');
    expect(result.results[0]?.candidates[0]?.supportingEvidenceIds).toContain('P-1');
    expect(result.authorityBoundary).toContain('never mutate');
  });

  it('does not silently merge dual-provider outputs', async () => {
    const result = await analyzeWithConfiguredProviders(request, 'dual');
    expect(result.results.map((entry) => entry.provider)).toEqual(['openai', 'anthropic']);
    expect(result.results.every((entry) => ['unavailable', 'completed', 'failed'].includes(entry.status))).toBe(true);
  });
});
