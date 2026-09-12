import type { AnalysisRequest } from './types';

export const buildAnalysisPrompt = (request: AnalysisRequest) => {
  const evidence = request.evidence
    .slice(0, 30)
    .map((item) => `EVIDENCE ${item.id} [${item.sourceType}] ${item.label}\n${item.text.slice(0, 6_000)}`)
    .join('\n\n');

  return `You are an evidence-grounded software architecture analyst.\n\n` +
    `Task: ${request.task}\n` +
    `Instruction: ${request.instruction}\n\n` +
    `Authority rules:\n` +
    `- Historical evidence is immutable.\n` +
    `- You are proposing review candidates only.\n` +
    `- Never fabricate prompt-to-code, prompt-to-commit, runtime, or customer-outcome relationships.\n` +
    `- Distinguish supporting evidence from contradicting evidence.\n` +
    `- Include an alternative explanation for every inference.\n` +
    `- Use UNPROVEN when evidence is insufficient.\n\n` +
    `Return strict JSON only with this shape:\n` +
    `{"candidates":[{"candidateType":"principle|pattern|lineage|profile-claim","title":"...","statement":"...","supportingEvidenceIds":["..."],"contradictingEvidenceIds":[],"confidence":0.0,"alternativeExplanation":"...","evidenceGrade":"VERIFIED|SUPPORTED|INFERRED|TENTATIVE|UNPROVEN|SUPERSEDED"}]}\n\n` +
    `Maximum candidates: ${request.maxCandidates ?? 5}\n\n${evidence}`;
};
