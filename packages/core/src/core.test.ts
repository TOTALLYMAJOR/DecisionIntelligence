import { describe, expect, it } from 'vitest';
import { compileArchitectingPrompt } from './compiler';
import { compilerModules, failures, lineages, patterns, principles, profileClaims, promptRecords } from './fixtures';
import { searchKnowledge } from './search';

describe('walking-skeleton knowledge model', () => {
  it('contains the minimum representative corpus', () => {
    expect(promptRecords).toHaveLength(20);
    expect(principles.length).toBeGreaterThanOrEqual(5);
    expect(patterns.length).toBeGreaterThanOrEqual(5);
    expect(failures.length).toBeGreaterThanOrEqual(3);
    expect(lineages.length).toBeGreaterThanOrEqual(3);
    expect(profileClaims.length).toBeGreaterThanOrEqual(5);
    expect(compilerModules.length).toBeGreaterThanOrEqual(6);
  });

  it('finds authority knowledge with evidence grades', () => {
    const results = searchKnowledge('tenant authority');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((result) => result.title.toLowerCase().includes('authority'))).toBe(true);
  });

  it('compiles selected modules with explicit provenance', () => {
    const result = compileArchitectingPrompt('Audit a multi-tenant integration and produce the smallest safe implementation.', [
      'MODULE-REPOSITORY-REALITY',
      'MODULE-CANONICAL-AUTHORITY',
      'MODULE-PROOF-BOUNDARY',
    ]);
    expect(result.markdown).toContain('Repository Reality First');
    expect(result.markdown).toContain('Canonical Authority');
    expect(result.provenance.some((entry) => entry.moduleIds.includes('MODULE-PROOF-BOUNDARY'))).toBe(true);
  });
});
