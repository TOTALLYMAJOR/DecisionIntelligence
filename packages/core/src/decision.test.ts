import { describe, expect, it } from 'vitest';
import { analyzeProposedChange, compileDecisionContract } from './decision';

const analysis = analyzeProposedChange({
  change:
    'Replace the payment provider and add tenant-scoped approval before a refund can be submitted.',
  desiredOutcome: 'Keep refund authority explicit while supporting reliable provider retries.',
  constraints: 'Preserve the existing commercial source of truth and require runtime evidence.',
});

describe('decision intelligence', () => {
  it('maps consequential domains without presenting the projection as proof', () => {
    expect(analysis.impacts).toHaveLength(8);
    expect(
      analysis.impacts.find((impact) => impact.domain === 'authority')?.score,
    ).toBeGreaterThanOrEqual(70);
    expect(analysis.impacts.find((impact) => impact.domain === 'commercial')?.level).not.toBe(
      'contained',
    );
    expect(
      analysis.impacts.every((impact) => ['INFERRED', 'TENTATIVE'].includes(impact.evidenceGrade)),
    ).toBe(true);
    expect(analysis.authorityBoundary).toContain('does not prove');
  });

  it('retrieves precedents while keeping relevance separate from source grade', () => {
    expect(analysis.evidence.length).toBeGreaterThan(0);
    expect(analysis.evidence.every((item) => item.relevanceGrade === 'INFERRED')).toBe(true);
    expect(analysis.options).toHaveLength(3);
    expect(analysis.recommendedOptionId).toBe('bounded-orchestration');
  });

  it('compiles a draft contract with authority and proof stop conditions', () => {
    const contract = compileDecisionContract(analysis, 'bounded-orchestration');
    expect(contract.status).toBe('draft');
    expect(contract.markdown).toContain('human authorization required');
    expect(contract.markdown).toContain('Preserve one canonical authority');
    expect(contract.markdown).toContain('Stop conditions');
    expect(contract.provenance.evidenceIds).toEqual(analysis.evidence.map((item) => item.id));
  });
});
