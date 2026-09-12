import { failures, lineages, patterns, principles, profileClaims, promptRecords } from './fixtures';
import type { EvidenceGrade, SearchResult } from './types';

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (value: string) => new Set(normalize(value).split(' ').filter(Boolean));

const lexicalScore = (query: string, text: string, tags: string[]) => {
  const normalizedQuery = normalize(query);
  const normalizedText = normalize(text);
  if (!normalizedQuery) return 0;
  if (normalizedText === normalizedQuery) return 100;
  if (normalizedText.includes(normalizedQuery)) return 72;
  const queryTokens = tokenize(query);
  const textTokens = tokenize(`${text} ${tags.join(' ')}`);
  let overlap = 0;
  for (const token of queryTokens) if (textTokens.has(token)) overlap += 1;
  return queryTokens.size === 0 ? 0 : Math.round((overlap / queryTokens.size) * 60);
};

const gradeBoost: Record<EvidenceGrade, number> = {
  VERIFIED: 8,
  SUPPORTED: 6,
  INFERRED: 3,
  TENTATIVE: 1,
  UNPROVEN: 0,
  SUPERSEDED: -3,
};

export const searchKnowledge = (query: string, limit = 30): SearchResult[] => {
  const results: SearchResult[] = [];

  for (const prompt of promptRecords) {
    const summary = `${prompt.normalizedIntent} ${prompt.hiddenProblem}`;
    const score = lexicalScore(query, `${prompt.libraryId} ${prompt.title} ${prompt.originalText} ${summary}`, prompt.tags);
    if (score > 0) results.push({ id: prompt.libraryId, kind: 'prompt', title: prompt.title, summary, score: score + gradeBoost[prompt.evidenceGrade], href: `/library/${prompt.libraryId}`, evidenceGrade: prompt.evidenceGrade, tags: prompt.tags });
  }
  for (const entity of [...principles, ...patterns]) {
    const score = lexicalScore(query, `${entity.title} ${entity.statement} ${entity.description}`, entity.tags);
    if (score > 0) results.push({ id: entity.id, kind: entity.kind, title: entity.title, summary: entity.statement, score: score + gradeBoost[entity.evidenceGrade], href: entity.kind === 'principle' ? '/principles' : '/patterns', evidenceGrade: entity.evidenceGrade, tags: entity.tags });
  }
  for (const failure of failures) {
    const score = lexicalScore(query, `${failure.title} ${failure.trigger} ${failure.rootCause} ${failure.control} ${failure.generalizedRule}`, ['failure', 'control']);
    if (score > 0) results.push({ id: failure.failureId, kind: 'failure', title: failure.title, summary: failure.generalizedRule, score: score + gradeBoost[failure.evidenceGrade], href: '/failure-lab', evidenceGrade: failure.evidenceGrade, tags: ['failure', 'control'] });
  }
  for (const claim of profileClaims) {
    const score = lexicalScore(query, `${claim.claim} ${claim.alternativeExplanation}`, ['profile', claim.category]);
    if (score > 0) results.push({ id: claim.claimId, kind: 'profile-claim', title: claim.claim, summary: claim.alternativeExplanation, score: score + gradeBoost[claim.evidenceGrade], href: '/profile', evidenceGrade: claim.evidenceGrade, tags: ['profile', claim.category] });
  }
  for (const lineage of lineages) {
    const score = lexicalScore(query, `${lineage.title} ${lineage.summary} ${lineage.steps.map((step) => `${step.title} ${step.detail}`).join(' ')}`, ['lineage', lineage.project]);
    if (score > 0) results.push({ id: lineage.lineageId, kind: 'lineage', title: lineage.title, summary: lineage.summary, score, href: `/lineages?selected=${lineage.lineageId}`, evidenceGrade: 'SUPPORTED', tags: ['lineage', lineage.project] });
  }

  return results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, limit);
};

export const suggestedQueries = ['tenant authority', 'commercial blast radius', 'accepted is not paid', 'AI advisory boundary', 'smallest safe patch'];
