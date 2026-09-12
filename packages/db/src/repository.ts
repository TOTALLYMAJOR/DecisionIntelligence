import { createHash } from 'node:crypto';
import type { PromptRecord } from '@limitless/core';
import { db } from './client';

export const upsertPromptFixture = async (workspaceId: string, prompt: PromptRecord) =>
  db.prompt.upsert({
    where: { workspaceId_libraryId: { workspaceId, libraryId: prompt.libraryId } },
    create: {
      workspaceId,
      libraryId: prompt.libraryId,
      originalPromptId: prompt.originalPromptId,
      title: prompt.title,
      family: prompt.family,
      form: prompt.form,
      originalText: prompt.originalText,
      redactedText: prompt.originalText,
      contentHash: createHash('sha256').update(prompt.originalText).digest('hex'),
      originalTimestamp: new Date(prompt.timestamp),
      impactScore: prompt.impactScore,
      reusabilityScore: prompt.reusabilityScore,
      evidenceGrade: prompt.evidenceGrade,
      metadata: { tags: prompt.tags, normalizedIntent: prompt.normalizedIntent, hiddenProblem: prompt.hiddenProblem },
    },
    update: {
      title: prompt.title,
      family: prompt.family,
      form: prompt.form,
      impactScore: prompt.impactScore,
      reusabilityScore: prompt.reusabilityScore,
      evidenceGrade: prompt.evidenceGrade,
      metadata: { tags: prompt.tags, normalizedIntent: prompt.normalizedIntent, hiddenProblem: prompt.hiddenProblem },
    },
  });
