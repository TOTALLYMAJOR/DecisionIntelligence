import { searchKnowledge } from './search';
import type {
  DecisionAnalysis,
  DecisionBrief,
  DecisionContract,
  DecisionImpact,
  DecisionImpactDomain,
  DecisionImpactLevel,
  DecisionOption,
  RepositorySnapshot,
} from './types';

type DomainDefinition = {
  domain: DecisionImpactDomain;
  title: string;
  terms: string[];
  inspect: string;
  question: string;
};

const domainDefinitions: DomainDefinition[] = [
  {
    domain: 'authority',
    title: 'Authority',
    terms: [
      'authority',
      'source of truth',
      'canonical',
      'owner',
      'approval',
      'tenant',
      'state transition',
      'promotion',
    ],
    inspect: 'who may establish the resulting state and where that state is recorded',
    question: 'Which exact record and service are allowed to establish the new truth?',
  },
  {
    domain: 'data',
    title: 'Data',
    terms: [
      'database',
      'schema',
      'migration',
      'record',
      'storage',
      'cache',
      'event',
      'tenant',
      'sync',
    ],
    inspect: 'schema ownership, migrations, retention, and rebuildable projections',
    question: 'What data becomes durable, and what remains a disposable projection?',
  },
  {
    domain: 'workflow',
    title: 'Workflow',
    terms: [
      'workflow',
      'approval',
      'status',
      'lifecycle',
      'process',
      'handoff',
      'queue',
      'review',
      'step',
    ],
    inspect: 'states, blockers, retries, and the next action for each actor',
    question: 'What state transition occurs, who authorizes it, and what blocks progression?',
  },
  {
    domain: 'interfaces',
    title: 'Interfaces',
    terms: [
      'api',
      'webhook',
      'provider',
      'integration',
      'route',
      'interface',
      'contract',
      'client',
      'ui',
    ],
    inspect: 'request contracts, ambiguous outcomes, and downstream compatibility',
    question:
      'Which interface contracts change, and how are partial or ambiguous outcomes reconciled?',
  },
  {
    domain: 'security',
    title: 'Security',
    terms: [
      'auth',
      'authentication',
      'authorization',
      'permission',
      'tenant',
      'secret',
      'token',
      'privacy',
      'credential',
    ],
    inspect: 'identity, authorization, tenancy, secrets, and negative access paths',
    question: 'Which identity and tenant checks must deny access before any privileged operation?',
  },
  {
    domain: 'operations',
    title: 'Operations',
    terms: [
      'deploy',
      'queue',
      'retry',
      'worker',
      'observability',
      'rollback',
      'failure',
      'incident',
      'recovery',
    ],
    inspect: 'deployment, retries, monitoring, recovery, and rollback behavior',
    question: 'How will operators detect, contain, retry, and reverse a failed change?',
  },
  {
    domain: 'commercial',
    title: 'Commercial',
    terms: [
      'payment',
      'price',
      'quote',
      'invoice',
      'revenue',
      'margin',
      'deposit',
      'tax',
      'refund',
      'subscription',
    ],
    inspect: 'money movement, pricing truth, acceptance, and downstream commercial obligations',
    question: 'Could this change alter money, acceptance, margin, or a customer obligation?',
  },
  {
    domain: 'evidence',
    title: 'Evidence',
    terms: [
      'test',
      'prove',
      'verify',
      'evidence',
      'receipt',
      'runtime',
      'accepted',
      'outcome',
      'audit',
    ],
    inspect: 'the proof required for implementation, runtime, provider, human, and outcome claims',
    question: 'What durable evidence would prove the decision worked at each claim level?',
  },
];

const consequentialTerms = new Set([
  'authentication',
  'authorization',
  'canonical',
  'migration',
  'payment',
  'promotion',
  'replace',
  'source of truth',
  'tenant',
]);

const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, ' ').trim();

const impactLevel = (score: number): DecisionImpactLevel => {
  if (score >= 70) return 'critical';
  if (score >= 48) return 'material';
  if (score >= 30) return 'watch';
  return 'contained';
};

const scoreDomain = (definition: DomainDefinition, source: string): DecisionImpact => {
  const matchedTerms = definition.terms.filter((term) => source.includes(term));
  const consequenceBoost = matchedTerms.some((term) => consequentialTerms.has(term)) ? 12 : 0;
  const score = Math.min(96, 16 + matchedTerms.length * 18 + consequenceBoost);
  const level = impactLevel(score);

  return {
    domain: definition.domain,
    title: definition.title,
    score,
    level,
    matchedTerms,
    repositoryEvidenceIds: [],
    evidenceGrade: matchedTerms.length >= 2 ? 'INFERRED' : 'TENTATIVE',
    rationale:
      matchedTerms.length > 0
        ? 'The brief signals ' +
          definition.title.toLowerCase() +
          ' impact through ' +
          matchedTerms.join(', ') +
          '. Inspect ' +
          definition.inspect +
          '.'
        : 'The brief does not name a ' +
          definition.title.toLowerCase() +
          ' change. That absence is not evidence of no impact; inspect ' +
          definition.inspect +
          '.',
    question: definition.question,
  };
};

const stableAnalysisId = (brief: DecisionBrief) => {
  const value = [brief.change, brief.desiredOutcome, brief.constraints].join('|');
  let hash = 2_166_136_261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16_777_619);
  }
  return 'DI-' + (hash >>> 0).toString(16).padStart(8, '0').toUpperCase();
};

const recommendedOption = (source: string): DecisionOption['optionId'] => {
  if (/(separate product|independent owner|different lifecycle|bounded context)/.test(source))
    return 'new-bounded-context';
  if (/(provider|webhook|external system|third-party|integration|synchroni[sz]e)/.test(source))
    return 'bounded-orchestration';
  return 'extend-authority';
};

const architectureOptions = (recommendation: DecisionOption['optionId']): DecisionOption[] => {
  const options: Omit<DecisionOption, 'recommended'>[] = [
    {
      optionId: 'extend-authority',
      title: 'Extend the canonical authority',
      posture: 'One owner, one mutation path',
      summary:
        'Add the capability inside the existing authoritative boundary and preserve its current state machine.',
      whenItFits:
        'Use when the existing owner legitimately controls the new truth and the change does not require an independent lifecycle.',
      tradeoffs: [
        'Lowest coordination overhead',
        'Keeps reads and writes attributable',
        'May increase pressure on the existing domain model',
      ],
      risks: [
        'The authority root may be overloaded',
        'A convenience path could bypass the canonical mutation',
      ],
      requiredEvidence: [
        'Name the authoritative record and service',
        'Prove every mutation reaches the same authority',
        'Add a negative test for bypass paths',
      ],
      complexity: 'lower',
      reversibility: 'higher',
    },
    {
      optionId: 'bounded-orchestration',
      title: 'Add bounded orchestration',
      posture: 'Coordinate without owning truth',
      summary:
        'Introduce a coordinator for sequencing, retries, or provider interaction while the existing domain remains authoritative.',
      whenItFits:
        'Use when external systems or asynchronous work must be coordinated without creating a second source of truth.',
      tradeoffs: [
        'Isolates integration complexity',
        'Supports retries and reconciliation',
        'Adds operational state and failure modes',
      ],
      risks: [
        'The coordinator can become shadow authority',
        'Ambiguous provider outcomes can create duplicate work',
      ],
      requiredEvidence: [
        'Prove orchestration cannot establish canonical state',
        'Define idempotency and reconciliation receipts',
        'Test timeout and ambiguous-success paths',
      ],
      complexity: 'medium',
      reversibility: 'medium',
    },
    {
      optionId: 'new-bounded-context',
      title: 'Create a bounded context',
      posture: 'Independent truth, explicit handoff',
      summary:
        'Give the capability an independent authority and connect it through a versioned, immutable handoff contract.',
      whenItFits:
        'Use only when ownership, lifecycle, invariants, or scaling needs are genuinely independent.',
      tradeoffs: [
        'Clear ownership and isolation',
        'Independent evolution',
        'Highest contract and operating cost',
      ],
      risks: [
        'Cross-context consistency becomes explicit work',
        'A weak boundary can duplicate business truth',
      ],
      requiredEvidence: [
        'Demonstrate an independent owner and lifecycle',
        'Specify the immutable handoff contract',
        'Rehearse reconciliation and recovery',
      ],
      complexity: 'higher',
      reversibility: 'lower',
    },
  ];

  return options.map((option) => ({ ...option, recommended: option.optionId === recommendation }));
};

const retrieveEvidence = (impacts: DecisionImpact[]) => {
  const queries = [
    ...impacts.slice(0, 4).flatMap((impact) => impact.matchedTerms.slice(0, 2)),
    ...impacts.slice(0, 3).map((impact) => impact.domain),
    'canonical authority',
    'proof boundary',
  ].filter((query, index, all) => query && all.indexOf(query) === index);

  const seen = new Set<string>();
  return queries
    .flatMap((query) => searchKnowledge(query, 4).map((result) => ({ result, query })))
    .filter(({ result }) => {
      const key = result.kind + ':' + result.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 8)
    .map(({ result, query }) => ({
      id: result.id,
      kind: result.kind,
      title: result.title,
      summary: result.summary,
      href: result.href,
      sourceGrade: result.evidenceGrade,
      relevanceGrade: 'INFERRED' as const,
      matchedOn: query,
    }));
};

export const analyzeProposedChange = (
  brief: DecisionBrief,
  repositorySnapshot: RepositorySnapshot | null = null,
): DecisionAnalysis => {
  const normalizedBrief: DecisionBrief = {
    change: brief.change.trim(),
    desiredOutcome: brief.desiredOutcome.trim(),
    constraints: brief.constraints.trim(),
  };
  const source = normalize(
    [normalizedBrief.change, normalizedBrief.desiredOutcome, normalizedBrief.constraints].join(' '),
  );
  const impacts = domainDefinitions
    .map((definition) => scoreDomain(definition, source))
    .map((impact) => ({
      ...impact,
      repositoryEvidenceIds:
        repositorySnapshot?.evidence
          .filter((evidence) => evidence.domains.includes(impact.domain))
          .map((evidence) => evidence.id) ?? [],
    }))
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title));
  const recommendedOptionId = recommendedOption(source);

  return {
    analysisId: stableAnalysisId(normalizedBrief),
    brief: normalizedBrief,
    generatedBy: 'deterministic-fixture-analysis',
    authorityBoundary:
      'Projection only. This analysis prioritizes investigation; it does not prove an impact exists, authorize implementation, or change canonical knowledge.',
    strongestImpact: impacts[0]?.domain ?? 'evidence',
    impacts,
    evidence: retrieveEvidence(impacts),
    assumptions: [
      'The submitted brief is complete enough to prioritize investigation.',
      repositorySnapshot
        ? 'The repository snapshot observes bounded static files only; Git history, execution, runtime, provider, customer, and production evidence remain uninspected.'
        : 'No repository, runtime, provider, customer, or production evidence was inspected.',
      'Retrieved records retain their original source grade; their relevance to this change remains inferred.',
    ],
    openQuestions: impacts.slice(0, 5).map((impact) => impact.question),
    options: architectureOptions(recommendedOptionId),
    recommendedOptionId,
    repositorySnapshot,
  };
};

export const compileDecisionContract = (
  analysis: DecisionAnalysis,
  optionId: DecisionOption['optionId'],
): DecisionContract => {
  const option = analysis.options.find((candidate) => candidate.optionId === optionId);
  if (!option) throw new Error('Unknown decision option: ' + optionId);
  const obligations = analysis.impacts.filter(
    (impact) => impact.level === 'critical' || impact.level === 'material',
  );
  const requiredImpacts = obligations.length > 0 ? obligations : analysis.impacts.slice(0, 3);
  const title =
    analysis.brief.change.split(/[.!?]/)[0]?.trim().slice(0, 100) || 'Proposed architecture change';
  const bullets = (items: string[]) => items.map((item) => '- ' + item).join('\n');
  const impactLines = requiredImpacts.map(
    (impact) =>
      '- **' +
      impact.title +
      ' · ' +
      impact.level.toUpperCase() +
      ' · ' +
      impact.evidenceGrade +
      ':** ' +
      impact.rationale,
  );
  const precedentLines = analysis.evidence.map(
    (item) =>
      '- ' +
      item.id +
      ' · ' +
      item.sourceGrade +
      ': ' +
      item.title +
      ' (relevance ' +
      item.relevanceGrade.toLowerCase() +
      ', matched on "' +
      item.matchedOn +
      '")',
  );
  const repositoryLines = analysis.repositorySnapshot?.evidence.map(
    (item) =>
      '- ' +
      item.relativePath +
      ' · ' +
      item.kind.toUpperCase() +
      ' · ' +
      item.sourceGrade +
      ' source / ' +
      item.relevanceGrade +
      ' relevance · matched ' +
      (item.matchedTerms.join(', ') || 'structural signals'),
  );

  const markdown = [
    '# Draft Decision Contract — ' + title,
    '',
    '**Status:** DRAFT — human authorization required',
    '**Analysis:** ' + analysis.analysisId,
    '**Authority boundary:** ' + analysis.authorityBoundary,
    '',
    '## Proposed change',
    '',
    analysis.brief.change,
    '',
    '## Desired outcome',
    '',
    analysis.brief.desiredOutcome,
    '',
    '## Selected architecture posture',
    '',
    '### ' + option.title,
    '',
    option.summary,
    '',
    '**Use when:** ' + option.whenItFits,
    '',
    '## Governing invariants',
    '',
    '- Preserve one canonical authority for each business truth.',
    '- Treat model output and this analysis as advisory candidate material.',
    '- Separate implementation, test, deployment, provider, human, and outcome evidence.',
    '- Do not advance when a named authority, tenant boundary, or proof obligation remains ambiguous.',
    '',
    '## Impact obligations',
    '',
    impactLines.join('\n'),
    '',
    '## Questions that must be resolved',
    '',
    bullets(analysis.openQuestions),
    '',
    '## Required evidence',
    '',
    bullets(option.requiredEvidence),
    '',
    '## Repository snapshot',
    '',
    analysis.repositorySnapshot
      ? '- **Manifest:** ' +
        analysis.repositorySnapshot.manifestHash +
        '\n- **Observed:** ' +
        analysis.repositorySnapshot.observedAt +
        '\n- **Boundary:** ' +
        analysis.repositorySnapshot.authorityBoundary +
        '\n' +
        (repositoryLines?.join('\n') || '- No relevant static files were matched.')
      : '- No repository snapshot was attached. Repository impact remains uninspected.',
    '',
    '## Retrieved precedent',
    '',
    precedentLines.join('\n') ||
      '- No grounded precedent was retrieved. Stop and perform repository discovery.',
    '',
    '## Stop conditions',
    '',
    '- Stop if the proposed change introduces a second mutation authority.',
    '- Stop if a required relationship is inferred but presented as implemented fact.',
    '- Stop if validation cannot distinguish a local pass from runtime or production proof.',
    '- Stop before destructive migration, deployment, provider configuration, or canonical promotion without explicit authorization.',
    '',
    '## Constraints supplied with the brief',
    '',
    analysis.brief.constraints || 'No additional constraints supplied.',
    '',
  ].join('\n');

  return {
    status: 'draft',
    optionId,
    markdown,
    provenance: {
      analysisId: analysis.analysisId,
      evidenceIds: analysis.evidence.map((item) => item.id),
      impactDomains: requiredImpacts.map((impact) => impact.domain),
      repositoryManifestHash: analysis.repositorySnapshot?.manifestHash ?? null,
    },
  };
};
