import type { AnalysisCandidate } from '@limitless/core';

export type AiProviderId = 'mock' | 'openai' | 'anthropic';
export type AiProviderMode = AiProviderId | 'dual';

export interface AnalysisEvidenceInput {
  id: string;
  label: string;
  text: string;
  sourceType: 'prompt' | 'code' | 'test' | 'commit' | 'document';
}

export interface AnalysisRequest {
  task: 'extract-principles' | 'propose-patterns' | 'profile-claims' | 'explain-lineage';
  instruction: string;
  evidence: AnalysisEvidenceInput[];
  maxCandidates?: number;
}

export interface ProviderAnalysisResult {
  provider: AiProviderId;
  model: string;
  status: 'completed' | 'unavailable' | 'failed';
  candidates: AnalysisCandidate[];
  rawSummary: string;
  errorCode?: string;
}

export interface RoutedAnalysisResult {
  mode: AiProviderMode;
  authorityBoundary: string;
  results: ProviderAnalysisResult[];
}

export interface AiAnalysisProvider {
  readonly id: AiProviderId;
  analyze(request: AnalysisRequest): Promise<ProviderAnalysisResult>;
}
