import Anthropic from '@anthropic-ai/sdk';
import { buildAnalysisPrompt } from './prompt';
import { parseCandidateResponse } from './parse';
import type { AiAnalysisProvider, AnalysisRequest, ProviderAnalysisResult } from './types';

export class AnthropicAnalysisProvider implements AiAnalysisProvider {
  readonly id = 'anthropic' as const;

  async analyze(request: AnalysisRequest): Promise<ProviderAnalysisResult> {
    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
    const model = process.env.ANTHROPIC_MODEL?.trim() || 'claude-sonnet-4-6';
    if (!apiKey) {
      return { provider: this.id, model, status: 'unavailable', candidates: [], rawSummary: 'ANTHROPIC_API_KEY is not configured.', errorCode: 'missing-api-key' };
    }

    try {
      const client = new Anthropic({
        apiKey,
        ...(process.env.ANTHROPIC_BASE_URL?.trim() ? { baseURL: process.env.ANTHROPIC_BASE_URL.trim() } : {}),
      });
      const response = await client.messages.create({
        model,
        max_tokens: Number(process.env.AI_MAX_OUTPUT_TOKENS || 1_800),
        messages: [{ role: 'user', content: buildAnalysisPrompt(request) }],
      });
      const text = response.content
        .map((block) => block.type === 'text' ? block.text : '')
        .filter(Boolean)
        .join('\n');
      const candidates = parseCandidateResponse(text, request.maxCandidates ?? 5);
      return {
        provider: this.id,
        model,
        status: 'completed',
        candidates,
        rawSummary: candidates.length > 0 ? `Claude proposed ${candidates.length} review candidate(s).` : 'Claude returned no schema-valid candidates; nothing was promoted.',
      };
    } catch (error) {
      return {
        provider: this.id,
        model,
        status: 'failed',
        candidates: [],
        rawSummary: 'Anthropic analysis failed without modifying canonical knowledge.',
        errorCode: error instanceof Error ? error.name : 'unknown-error',
      };
    }
  }
}
