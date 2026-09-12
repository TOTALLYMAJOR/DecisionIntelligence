import type { EvidenceGrade } from '@limitless/core';

export function EvidenceBadge({ grade }: { grade: EvidenceGrade }) {
  return <span className={`evidenceBadge grade-${grade.toLowerCase()}`}>{grade}</span>;
}
