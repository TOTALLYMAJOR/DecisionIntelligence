import OpenAI from 'openai';
import { buildAnalysisPrompt } from './prompt';
import { parseCandidateResponse } from './parse';
import type { AiAnalysisProvider, AnalysisRequest, ProviderAnalysisResult } from './types';

export class OpenAiAnalysisProvider implements AiAnalysisProvider {
  readonly id = 'openai' as const;

  async analyze(request: AnalysisRequest): Promise<ProviderAnalysisResult> {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    const model = process.env.OPENAI_MODEL?.trim() || 'gpt-5';
    if (!apiKey) {
      return { provider: this.id, model, status: 'unavailable', candidates: [], rawSummary: 'OPENAI_API_KEY is not configured.', errorCode: 'missing-api-key' };
    }

    try {
      const client = new OpenAI({
        apiKey,
        ...(process.env.OPENAI_BASE_URL?.trim() ? { baseURL: process.env.OPENAI_BASE_URL.trim() } : {}),
      });
      const response = await client.responses.create({
        model,
        input: buildAnalysisPrompt(request),
        max_output_tokens: Number(process.env.AI_MAX_OUTPUT_TOKENS || 1_800),
      });
      const text = response.output_text || '';
      const candidates = parseCandidateResponse(text, request.maxCandidates ?? 5);
      return {
        provider: this.id,
        model,
        status: 'completed',
        candidates,
        rawSummary: candidates.length > 0 ? `OpenAI proposed ${candidates.length} review candidate(s).` : 'OpenAI returned no schema-valid candidates; nothing was promoted.',
      };
    } catch (error) {
      return {
        provider: this.id,
        model,
        status: 'failed',
        candidates: [],
        rawSummary: 'OpenAI analysis failed without modifying canonical knowledge.',
        errorCode: error instanceof Error ? error.name : 'unknown-error',
      };
    }
  }
}
