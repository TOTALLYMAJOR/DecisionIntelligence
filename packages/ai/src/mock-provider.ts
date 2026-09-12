import type { AiAnalysisProvider, AnalysisRequest, ProviderAnalysisResult } from './types';

export class MockAnalysisProvider implements AiAnalysisProvider {
  readonly id = 'mock' as const;

  async analyze(request: AnalysisRequest): Promise<ProviderAnalysisResult> {
    const evidenceIds = request.evidence.slice(0, 3).map((item) => item.id);
    return {
      provider: this.id,
      model: 'deterministic-fixture-v1',
      status: 'completed',
      candidates: [
        {
          candidateType: request.task === 'profile-claims' ? 'profile-claim' : 'principle',
          title: 'Candidate: evidence must precede promotion',
          statement: 'Analysis output remains a review candidate until a human validates the cited evidence and promotes a canonical version.',
          supportingEvidenceIds: evidenceIds,
          contradictingEvidenceIds: [],
          confidence: evidenceIds.length > 1 ? 0.86 : 0.55,
          alternativeExplanation: 'The supplied sample may overrepresent proof-governance language relative to the complete corpus.',
          evidenceGrade: evidenceIds.length > 1 ? 'SUPPORTED' : 'TENTATIVE',
        },
      ],
      rawSummary: `Mock analysis completed for ${request.task}; no external provider was called.`,
    };
  }
}
