import { analysisCandidateSchema, type AnalysisCandidate } from '@limitless/core';

const extractJson = (text: string) => {
  const trimmed = text.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) return trimmed;
  const first = trimmed.indexOf('{');
  const last = trimmed.lastIndexOf('}');
  return first >= 0 && last > first ? trimmed.slice(first, last + 1) : '';
};

export const parseCandidateResponse = (text: string, maximum: number): AnalysisCandidate[] => {
  try {
    const parsed = JSON.parse(extractJson(text)) as { candidates?: unknown[] };
    if (!Array.isArray(parsed.candidates)) return [];
    return parsed.candidates
      .slice(0, maximum)
      .map((candidate) => analysisCandidateSchema.safeParse(candidate))
      .filter((result) => result.success)
      .map((result) => result.data);
  } catch {
    return [];
  }
};
