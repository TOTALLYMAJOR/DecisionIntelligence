'use client';

import { useState } from 'react';
import { promptRecords } from '@limitless/core';
import { EvidenceBadge } from './EvidenceBadge';

// Local type mirror keeps this component decoupled from provider SDKs.
type ApiResult = {
  mode: string;
  authorityBoundary: string;
  results: Array<{ provider: string; model: string; status: string; rawSummary: string; candidates: Array<{ title: string; statement: string; evidenceGrade: 'VERIFIED'|'SUPPORTED'|'INFERRED'|'TENTATIVE'|'UNPROVEN'|'SUPERSEDED'; confidence: number; alternativeExplanation: string }> }>;
};

export function AiReviewPanel() {
  const [mode, setMode] = useState('mock');
  const [task, setTask] = useState('extract-principles');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState('');

  const analyze = async () => {
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/ai/analyze', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ mode, task, instruction: 'Propose only evidence-grounded review candidates. Do not promote canonical knowledge.', evidenceIds: promptRecords.slice(0, 5).map((prompt) => prompt.libraryId) }) });
      if (!response.ok) throw new Error(`Analysis returned ${response.status}`);
      setResult(await response.json() as ApiResult);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Analysis failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="reviewGrid">
      <section className="panel"><div className="panelHeader"><div><h2>Candidate analysis</h2><p>Provider output is never canonical knowledge.</p></div></div><div className="panelBody">
        <label><span className="fieldLabel">Provider mode</span><select className="selectInput" value={mode} onChange={(event) => setMode(event.target.value)}><option value="mock">Mock · no key required</option><option value="openai">OpenAI</option><option value="anthropic">Claude</option><option value="dual">OpenAI + Claude, separate outputs</option></select></label>
        <label style={{ display: 'block', marginTop: 15 }}><span className="fieldLabel">Analysis task</span><select className="selectInput" value={task} onChange={(event) => setTask(event.target.value)}><option value="extract-principles">Extract candidate principles</option><option value="propose-patterns">Propose patterns</option><option value="profile-claims">Propose profile claims</option><option value="explain-lineage">Explain lineage</option></select></label>
        <div className="callout" style={{ marginTop: 16 }}>Live provider modes require keys in an ignored <code>.env.local</code>. Never paste credentials into source or prompts. Missing keys degrade to an explicit unavailable state.</div>
        <button className="primaryButton" type="button" onClick={analyze} disabled={loading} style={{ marginTop: 16 }}>{loading ? 'Analyzing…' : 'Generate review candidates'}</button>
        {error ? <p style={{ color: 'var(--danger)', fontSize: 11 }}>{error}</p> : null}
      </div></section>
      <section className="panel"><div className="panelHeader"><div><h2>Independent provider results</h2><p>{result?.authorityBoundary ?? 'Run analysis to inspect candidate evidence.'}</p></div></div><div className="panelBody">
        {!result ? <div className="emptyState"><strong>No candidates yet.</strong>Mock mode proves the complete review path without making an external request.</div> : null}
        {result?.results.map((provider) => <article className="providerResult" key={provider.provider}><header><div><strong>{provider.provider}</strong><span className="tableSub">{provider.model}</span></div><span className="tag">{provider.status}</span></header><p>{provider.rawSummary}</p>{provider.candidates.map((candidate, index) => <div className="candidateCard" key={`${candidate.title}-${index}`}><EvidenceBadge grade={candidate.evidenceGrade} /><h3>{candidate.title}</h3><p>{candidate.statement}</p><p><strong>Alternative:</strong> {candidate.alternativeExplanation}</p><div className="compilerActions"><button type="button" className="secondaryButton" disabled>Approve after evidence review</button><button type="button" className="secondaryButton" disabled>Reject</button></div></div>)}</article>)}
      </div></section>
    </div>
  );
}
