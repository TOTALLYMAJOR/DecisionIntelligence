import { z } from 'zod';
import { evidenceGrades, promptFamilies } from './types';

export const evidenceGradeSchema = z.enum(evidenceGrades);
export const promptFamilySchema = z.enum(promptFamilies);

export const analysisCandidateSchema = z.object({
  candidateType: z.enum(['principle', 'pattern', 'lineage', 'profile-claim']),
  title: z.string().min(3).max(160),
  statement: z.string().min(8).max(2_000),
  supportingEvidenceIds: z.array(z.string()).max(30),
  contradictingEvidenceIds: z.array(z.string()).max(30).default([]),
  confidence: z.number().min(0).max(1),
  alternativeExplanation: z.string().max(1_000),
  evidenceGrade: evidenceGradeSchema,
});

export const compilerRequestSchema = z.object({
  problem: z.string().min(20).max(8_000),
  moduleIds: z.array(z.string()).min(1).max(24),
});

export const decisionAnalysisRequestSchema = z.object({
  change: z.string().trim().min(20).max(3_000),
  desiredOutcome: z.string().trim().min(10).max(2_000),
  constraints: z.string().trim().max(2_000).default(''),
  includeRepositoryEvidence: z.boolean().default(true),
});

export type AnalysisCandidate = z.infer<typeof analysisCandidateSchema>;
export type DecisionAnalysisRequest = z.infer<typeof decisionAnalysisRequestSchema>;
