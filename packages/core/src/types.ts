export const evidenceGrades = [
  'VERIFIED',
  'SUPPORTED',
  'INFERRED',
  'TENTATIVE',
  'UNPROVEN',
  'SUPERSEDED',
] as const;

export type EvidenceGrade = (typeof evidenceGrades)[number];

export const promptFamilies = [
  'visionary',
  'inquisitor',
  'architecture',
  'commercial-spine',
  'authority-and-proof',
  'blast-radius',
  'ai-governance',
  'ux-and-experience',
  'recovery',
  'verification',
  'release-truth',
  'agent-orchestration',
  'methodology',
] as const;

export type PromptFamily = (typeof promptFamilies)[number];
export type PromptForm =
  | 'probe'
  | 'correction'
  | 'challenge'
  | 'reframe'
  | 'constraint'
  | 'authorization'
  | 'stop-command'
  | 'execution-contract';

export interface EvidenceRef {
  id: string;
  label: string;
  type: 'prompt' | 'code' | 'test' | 'commit' | 'adr' | 'runtime' | 'document';
  locator: string;
  grade: EvidenceGrade;
}

export interface PromptRecord {
  libraryId: string;
  originalPromptId: string;
  title: string;
  project: string;
  timestamp: string;
  family: PromptFamily;
  form: PromptForm;
  originalText: string;
  normalizedIntent: string;
  hiddenProblem: string;
  principleIds: string[];
  patternIds: string[];
  lineageIds: string[];
  impactScore: number;
  reusabilityScore: number;
  evidenceGrade: EvidenceGrade;
  tags: string[];
  evidence: EvidenceRef[];
}

export interface KnowledgeEntity {
  id: string;
  kind: 'principle' | 'pattern';
  title: string;
  statement: string;
  description: string;
  evidenceGrade: EvidenceGrade;
  status: 'active' | 'candidate' | 'superseded';
  promptIds: string[];
  projectIds: string[];
  tags: string[];
}

export interface FailureRecord {
  failureId: string;
  title: string;
  observedIn: string;
  trigger: string;
  rootCause: string;
  correction: string;
  control: string;
  generalizedRule: string;
  evidenceGrade: EvidenceGrade;
  relatedPromptIds: string[];
}

export interface LineageStep extends Record<string, unknown> {
  id: string;
  type: 'prompt' | 'contradiction' | 'principle' | 'decision' | 'implementation' | 'failure' | 'control' | 'proof';
  title: string;
  detail: string;
  evidenceGrade: EvidenceGrade;
}

export interface ArchitectingLineage {
  lineageId: string;
  title: string;
  summary: string;
  project: string;
  steps: LineageStep[];
  edges: Array<{ from: string; to: string; label: string }>;
}

export interface ProfileClaim {
  claimId: string;
  claim: string;
  category: 'identity' | 'reasoning' | 'prompting' | 'strength' | 'risk' | 'collaboration';
  evidenceGrade: EvidenceGrade;
  confidence: number;
  evidence: EvidenceRef[];
  alternativeExplanation: string;
}

export interface CompilerModule {
  moduleId: string;
  title: string;
  category: string;
  purpose: string;
  contract: string[];
  conflictsWith: string[];
  sourcePrincipleIds: string[];
  evidenceGrade: EvidenceGrade;
}

export interface CompiledPrompt {
  title: string;
  problem: string;
  moduleIds: string[];
  markdown: string;
  provenance: Array<{ section: string; moduleIds: string[] }>;
}

export interface SearchResult {
  id: string;
  kind: 'prompt' | 'principle' | 'pattern' | 'failure' | 'profile-claim' | 'lineage';
  title: string;
  summary: string;
  score: number;
  href: string;
  evidenceGrade: EvidenceGrade;
  tags: string[];
}
