import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, GitBranch, ShieldCheck } from 'lucide-react';
import { patterns, principles, promptRecords } from '@limitless/core';
import { EvidenceBadge } from '../../../components/EvidenceBadge';
import { PageHeader } from '../../../components/PageHeader';
import { titleCase } from '../../../lib/format';

export function generateStaticParams() { return promptRecords.map((prompt)=>({libraryId:prompt.libraryId})); }

export default async function PromptDnaPage({ params }: { params: Promise<{ libraryId: string }> }) {
  const { libraryId } = await params;
  const prompt = promptRecords.find((entry)=>entry.libraryId===libraryId);
  if (!prompt) notFound();
  const relatedPrinciples = principles.filter((item)=>prompt.principleIds.includes(item.id));
  const relatedPatterns = patterns.filter((item)=>prompt.patternIds.includes(item.id));
  return <><PageHeader eyebrow="Prompt DNA" title={prompt.title} description="Historical wording, architectural consequence, evidence, and reusable knowledge remain visibly separated." actions={<Link href="/library" className="secondaryButton"><ArrowLeft size={14}/> Library</Link>} />
    <div className="promptHero"><section className="promptQuote"><div className="entityCardTop"><span className="entityMeta">Historical evidence · {prompt.libraryId}</span><EvidenceBadge grade={prompt.evidenceGrade}/></div><blockquote>“{prompt.originalText}”</blockquote><div className="tagRow" style={{marginTop:24}}>{prompt.tags.map(tag=><span className="tag" key={tag}>{tag}</span>)}</div></section><aside className="promptFacts"><div className="factCard"><span>Prompt form</span><strong>{titleCase(prompt.form)}</strong></div><div className="factCard"><span>Project</span><strong>{prompt.project}</strong></div><div className="factCard"><span>Impact / reuse</span><strong>{prompt.impactScore} / {prompt.reusabilityScore}</strong></div><div className="factCard"><span>Lineage</span><strong>{prompt.lineageIds.join(', ')}</strong></div></aside></div>
    <div className="contentGrid"><section className="panel prosePanel"><h2>Why it mattered</h2><p><strong>Normalized intent.</strong> {prompt.normalizedIntent}</p><p><strong>Hidden problem discovered.</strong> {prompt.hiddenProblem}</p><div className="callout">The historical prompt is immutable. This interpretation is a derived, evidence-graded projection that may be superseded without rewriting the original.</div></section><aside className="panel"><div className="panelHeader"><div><h2>Evidence</h2><p>Inspectable provenance, not a confidence-only claim.</p></div></div><div className="panelBody">{prompt.evidence.map(evidence=><div className="factCard" key={evidence.id}><span>{evidence.type} · {evidence.grade}</span><strong>{evidence.label}</strong><span className="mono" style={{marginTop:6,textTransform:'none'}}>{evidence.locator}</span></div>)}</div></aside></div>
    <section className="panel" style={{marginTop:16}}><div className="panelHeader"><div><h2>Knowledge derived from this prompt</h2><p>Principles and patterns are versioned canonical knowledge, not edits to history.</p></div></div><div className="panelBody"><div className="entityGrid">{relatedPrinciples.map(item=><article className="entityCard" key={item.id}><div className="entityCardTop"><ShieldCheck size={15}/><EvidenceBadge grade={item.evidenceGrade}/></div><h3>{item.title}</h3><p>{item.statement}</p><span className="entityLink">Principle · {item.id}</span></article>)}{relatedPatterns.map(item=><article className="entityCard" key={item.id}><div className="entityCardTop"><GitBranch size={15}/><EvidenceBadge grade={item.evidenceGrade}/></div><h3>{item.title}</h3><p>{item.statement}</p><span className="entityLink">Pattern · {item.id}</span></article>)}</div></div></section>
  </>;
}
