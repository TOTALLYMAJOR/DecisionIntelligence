import Link from 'next/link';
import { ArrowRight, BookOpenText, GitBranch, Scale, ShieldCheck, Sparkles } from 'lucide-react';
import { fixtureSummary, lineages, principles, promptRecords } from '@limitless/core';
import { EntityCard } from '../components/EntityCard';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';

export default function NowPage() {
  const recent = promptRecords
    .toSorted((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 4);
  return (
    <>
      <PageHeader
        eyebrow="Architecting intelligence"
        title="What are you trying to solve?"
        description="Start with a consequential software problem. Limitless retrieves the prompts, principles, failures, controls, and lineages your previous projects have already proven."
        actions={
          <Link className="primaryButton" href="/decisions">
            <Scale size={15} /> Simulate a change
          </Link>
        }
      />
      <section className="metricGrid" aria-label="Knowledge summary">
        <MetricCard
          label="Historical prompts"
          value={String(fixtureSummary.prompts)}
          detail="Immutable representative evidence in the walking skeleton."
          icon={<BookOpenText size={16} />}
        />
        <MetricCard
          label="Active principles"
          value={String(fixtureSummary.principles)}
          detail="Versioned constitutional rules with evidence grades."
          icon={<ShieldCheck size={16} />}
        />
        <MetricCard
          label="Lineages"
          value={String(fixtureSummary.lineages)}
          detail="Question-to-architecture causal chains."
          icon={<GitBranch size={16} />}
        />
        <MetricCard
          label="Review queue"
          value="1"
          detail="Mock candidate ready to prove human promotion."
          icon={<Sparkles size={16} />}
        />
      </section>
      <div className="contentGrid">
        <section className="panel">
          <div className="panelHeader">
            <div>
              <h2>High-signal architecting DNA</h2>
              <p>Recent prompts ordered by evidence, impact, and reuse value.</p>
            </div>
            <Link className="textButton" href="/library">
              Open library <ArrowRight size={13} />
            </Link>
          </div>
          <div className="panelBody">
            <div className="entityGrid">
              {recent.map((prompt) => (
                <EntityCard
                  key={prompt.libraryId}
                  title={prompt.title}
                  summary={prompt.normalizedIntent}
                  href={`/library/${prompt.libraryId}`}
                  grade={prompt.evidenceGrade}
                  meta={`${prompt.family} · ${prompt.libraryId}`}
                />
              ))}
            </div>
          </div>
        </section>
        <aside className="panel">
          <div className="panelHeader">
            <div>
              <h2>Architecting loop</h2>
              <p>How a question becomes reusable control.</p>
            </div>
          </div>
          <div className="panelBody">
            <div className="timeline">
              {[
                'Vision',
                'Probe',
                'Contradiction',
                'Authority',
                'Evidence',
                'Dependency',
                'Bounded implementation',
                'Adversarial test',
                'Repair',
                'Receipt',
                'Reusable pattern',
              ].map((stage, index) => (
                <div className="timelineItem" key={stage}>
                  <div className="timelineRail">
                    <span className="timelineDot" />
                  </div>
                  <div className="timelineContent">
                    <span>Stage {String(index + 1).padStart(2, '0')}</span>
                    <h3>{stage}</h3>
                    <p>
                      {index === 0
                        ? 'Define the category and customer outcome.'
                        : index === 8
                          ? 'Convert verified failure into a durable prevention control.'
                          : 'Advance only when the preceding claim has attributable evidence.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
      <section className="panel" style={{ marginTop: 16 }}>
        <div className="panelHeader">
          <div>
            <h2>Constitution under active evidence</h2>
            <p>The principles most reinforced across QuietPilot and QuotePilot.</p>
          </div>
        </div>
        <div className="panelBody">
          <div className="entityGrid">
            {principles.slice(0, 4).map((principle) => (
              <EntityCard
                key={principle.id}
                title={principle.title}
                summary={principle.statement}
                href="/principles"
                grade={principle.evidenceGrade}
                meta={`principle · ${principle.promptIds.length} prompts`}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="panel" style={{ marginTop: 16 }}>
        <div className="panelHeader">
          <div>
            <h2>Featured lineage</h2>
            <p>{lineages[1]?.summary}</p>
          </div>
          <Link className="textButton" href="/lineages">
            Trace lineage <ArrowRight size={13} />
          </Link>
        </div>
      </section>
    </>
  );
}
