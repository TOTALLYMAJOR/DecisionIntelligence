'use client';

import { useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { AlertTriangle, Check, Clipboard, Gauge, RotateCcw, Scale } from 'lucide-react';
import {
  compileDecisionContract,
  type DecisionAnalysis,
  type DecisionBrief,
  type DecisionOption,
} from '@limitless/core';
import { EvidenceBadge } from './EvidenceBadge';

const initialBrief: DecisionBrief = {
  change:
    'Add a workspace-level approval step before an AI-generated architecture recommendation can become an execution work order.',
  desiredOutcome:
    'Prevent unreviewed model output from changing canonical project direction while keeping routine decisions fast.',
  constraints:
    'Local fixture mode. Preserve one canonical authority and make every promotion attributable.',
};

const examples: Array<{ label: string; brief: DecisionBrief }> = [
  {
    label: 'AI work orders',
    brief: initialBrief,
  },
  {
    label: 'Payment provider',
    brief: {
      change:
        'Replace the payment provider while preserving the current invoice and refund authority.',
      desiredOutcome: 'Gain reliable provider retries without duplicating commercial state.',
      constraints:
        'Every ambiguous provider outcome needs reconciliation evidence and an operator-visible recovery path.',
    },
  },
  {
    label: 'Tenant approvals',
    brief: {
      change:
        'Introduce tenant-scoped approval for changes that alter a published operational configuration.',
      desiredOutcome:
        'Keep privileged changes attributable and prevent cross-workspace authorization leaks.',
      constraints:
        'Existing configuration remains canonical. Negative tenant-isolation proof is required.',
    },
  },
];

export function DecisionStudio() {
  const [brief, setBrief] = useState<DecisionBrief>(initialBrief);
  const [analysis, setAnalysis] = useState<DecisionAnalysis | null>(null);
  const [selectedOption, setSelectedOption] =
    useState<DecisionOption['optionId']>('extend-authority');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const contract = useMemo(
    () => (analysis ? compileDecisionContract(analysis, selectedOption) : null),
    [analysis, selectedOption],
  );

  const updateBrief = (field: keyof DecisionBrief, value: string) => {
    setBrief((current) => ({ ...current, [field]: value }));
    setAnalysis(null);
    setError('');
  };

  const applyExample = (example: DecisionBrief) => {
    setBrief(example);
    setAnalysis(null);
    setError('');
  };

  const analyze = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/decisions/analyze', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(brief),
      });
      if (!response.ok) throw new Error('Decision analysis returned ' + response.status + '.');
      const result = (await response.json()) as DecisionAnalysis;
      setAnalysis(result);
      setSelectedOption(result.recommendedOptionId);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Decision analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const copyContract = async () => {
    if (!contract) return;
    await navigator.clipboard.writeText(contract.markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_500);
  };

  return (
    <div className="decisionStudio">
      <form className="panel decisionIntake" onSubmit={analyze}>
        <div className="panelHeader">
          <div>
            <h2>Decision brief</h2>
            <p>
              Name the proposed change and the outcome—not the implementation you already assume.
            </p>
          </div>
          <span className="projectionPill">
            <Gauge size={13} /> deterministic projection
          </span>
        </div>
        <div className="panelBody">
          <div className="decisionExamples" aria-label="Example decision briefs">
            <span>Load example</span>
            {examples.map((example) => (
              <button type="button" key={example.label} onClick={() => applyExample(example.brief)}>
                {example.label}
              </button>
            ))}
          </div>
          <div className="decisionBriefGrid">
            <label className="decisionChangeField">
              <span className="fieldLabel">Proposed change</span>
              <textarea
                className="textarea"
                value={brief.change}
                onChange={(event) => updateBrief('change', event.target.value)}
                minLength={20}
                required
              />
            </label>
            <div className="decisionBriefSide">
              <label>
                <span className="fieldLabel">Desired outcome</span>
                <textarea
                  className="textarea compactTextarea"
                  value={brief.desiredOutcome}
                  onChange={(event) => updateBrief('desiredOutcome', event.target.value)}
                  minLength={10}
                  required
                />
              </label>
              <label>
                <span className="fieldLabel">Constraints and known boundaries</span>
                <textarea
                  className="textarea compactTextarea"
                  value={brief.constraints}
                  onChange={(event) => updateBrief('constraints', event.target.value)}
                />
              </label>
            </div>
          </div>
          <div className="decisionActions">
            <button className="primaryButton" type="submit" disabled={loading}>
              <Scale size={15} />
              {loading ? 'Mapping consequences…' : 'Map consequences'}
            </button>
            <span>This does not inspect a repository or authorize implementation.</span>
          </div>
          {error ? (
            <p className="decisionError" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </form>

      {!analysis ? (
        <section className="decisionEmpty" aria-label="Decision analysis preview">
          <div>
            <strong>01</strong>
            <span>Impact map</span>
            <p>Eight consequence domains prioritized for investigation.</p>
          </div>
          <div>
            <strong>02</strong>
            <span>Prior evidence</span>
            <p>Relevant prompts, failures, principles, and lineages with source grades intact.</p>
          </div>
          <div>
            <strong>03</strong>
            <span>Architecture options</span>
            <p>Three distinct postures with risk, reversibility, and proof obligations.</p>
          </div>
          <div>
            <strong>04</strong>
            <span>Decision contract</span>
            <p>A draft work boundary ready for human authorization.</p>
          </div>
        </section>
      ) : (
        <div className="decisionResults">
          <section className="decisionSummary" aria-live="polite">
            <div>
              <span>Analysis</span>
              <strong className="mono">{analysis.analysisId}</strong>
            </div>
            <div>
              <span>Strongest vector</span>
              <strong>{analysis.impacts[0]?.title}</strong>
            </div>
            <div>
              <span>Open questions</span>
              <strong>{analysis.openQuestions.length}</strong>
            </div>
            <div>
              <span>Retrieved records</span>
              <strong>{analysis.evidence.length}</strong>
            </div>
          </section>

          <div className="decisionAnalysisGrid">
            <section className="panel">
              <div className="panelHeader">
                <div>
                  <h2>Impact map</h2>
                  <p>
                    Priority indicates investigation urgency, not probability or proven blast
                    radius.
                  </p>
                </div>
              </div>
              <div className="impactMap">
                {analysis.impacts.map((impact) => (
                  <article className={'impactRow impact-' + impact.level} key={impact.domain}>
                    <div className="impactIdentity">
                      <span>{impact.domain}</span>
                      <strong>{impact.title}</strong>
                    </div>
                    <div className="impactReading">
                      <div className="impactMeasure">
                        <div className="impactTrack">
                          <span style={{ width: impact.score + '%' }} />
                        </div>
                        <span className="mono">{impact.score}</span>
                        <span className="impactLevel">{impact.level}</span>
                      </div>
                      <p>{impact.rationale}</p>
                      <small>{impact.question}</small>
                    </div>
                    <EvidenceBadge grade={impact.evidenceGrade} />
                  </article>
                ))}
              </div>
            </section>

            <aside className="decisionEvidenceColumn">
              <section className="panel">
                <div className="panelHeader">
                  <div>
                    <h2>Retrieved precedent</h2>
                    <p>Source grade and relevance are deliberately separate.</p>
                  </div>
                </div>
                <div className="decisionEvidenceList">
                  {analysis.evidence.map((item) => (
                    <Link
                      href={item.href}
                      key={item.kind + '-' + item.id}
                      className="decisionEvidence"
                    >
                      <div>
                        <span className="entityMeta">
                          {item.kind} · {item.id}
                        </span>
                        <strong>{item.title}</strong>
                        <p>Matched on “{item.matchedOn}” · relevance inferred</p>
                      </div>
                      <EvidenceBadge grade={item.sourceGrade} />
                    </Link>
                  ))}
                </div>
              </section>
              <section className="panel">
                <div className="panelHeader">
                  <div>
                    <h2>Unknowns to resolve</h2>
                    <p>The contract cannot make these true.</p>
                  </div>
                </div>
                <ol className="decisionQuestions">
                  {analysis.openQuestions.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ol>
              </section>
            </aside>
          </div>

          <fieldset className="decisionOptionFieldset">
            <legend>Choose an architecture posture</legend>
            <p>Selection changes the draft contract. It does not approve the decision.</p>
            <div className="decisionOptions">
              {analysis.options.map((option) => (
                <label
                  className={
                    'decisionOption ' + (selectedOption === option.optionId ? 'selected' : '')
                  }
                  key={option.optionId}
                >
                  <input
                    type="radio"
                    name="decision-option"
                    value={option.optionId}
                    checked={selectedOption === option.optionId}
                    onChange={() => setSelectedOption(option.optionId)}
                  />
                  <div className="decisionOptionTop">
                    <span className="entityMeta">{option.posture}</span>
                    {option.recommended ? (
                      <span className="recommendedTag">recommended</span>
                    ) : null}
                  </div>
                  <h3>{option.title}</h3>
                  <p>{option.summary}</p>
                  <dl>
                    <div>
                      <dt>Complexity</dt>
                      <dd>{option.complexity}</dd>
                    </div>
                    <div>
                      <dt>Reversibility</dt>
                      <dd>{option.reversibility}</dd>
                    </div>
                  </dl>
                  <span className="decisionOptionAction">
                    {selectedOption === option.optionId ? 'Selected for draft' : 'Select posture'}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <section className="panel decisionContract">
            <div className="panelHeader">
              <div>
                <h2>Draft decision contract</h2>
                <p>
                  {contract?.provenance.evidenceIds.length ?? 0} evidence references · human
                  authorization still required
                </p>
              </div>
              <button
                className="secondaryButton"
                type="button"
                onClick={copyContract}
                disabled={!contract}
              >
                {copied ? <Check size={15} /> : <Clipboard size={15} />}
                {copied ? 'Copied' : 'Copy contract'}
              </button>
            </div>
            <div className="decisionContractGrid">
              <aside>
                <div className="decisionBoundary">
                  <AlertTriangle size={17} />
                  <div>
                    <strong>Projection boundary</strong>
                    <p>{analysis.authorityBoundary}</p>
                  </div>
                </div>
                <h3>Assumptions carried forward</h3>
                <ul>
                  {analysis.assumptions.map((assumption) => (
                    <li key={assumption}>{assumption}</li>
                  ))}
                </ul>
                <button className="textButton" type="button" onClick={() => setAnalysis(null)}>
                  <RotateCcw size={14} /> Revise the brief
                </button>
              </aside>
              <pre className="decisionContractOutput">{contract?.markdown}</pre>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
