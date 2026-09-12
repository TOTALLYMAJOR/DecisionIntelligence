import Link from 'next/link';
import type { EvidenceGrade } from '@limitless/core';
import { ArrowUpRight } from 'lucide-react';
import { EvidenceBadge } from './EvidenceBadge';

export function EntityCard({ title, summary, href, grade, meta }: { title: string; summary: string; href: string; grade: EvidenceGrade; meta: string }) {
  return (
    <Link href={href} className="entityCard">
      <div className="entityCardTop"><span className="entityMeta">{meta}</span><EvidenceBadge grade={grade} /></div>
      <h3>{title}</h3>
      <p>{summary}</p>
      <span className="entityLink">Inspect evidence <ArrowUpRight size={14} /></span>
    </Link>
  );
}
