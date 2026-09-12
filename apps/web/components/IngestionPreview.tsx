'use client';

import { useState } from 'react';

const sample = `# Codex Prompt Archive\n\n## Prompt 0001\n\n- Timestamp: 2026-07-18T13:20:44.401Z\n- Session: sample-session\n- Working directory: /home/administrator/QP/QuietPilot\n\n\`\`\`text\nLOOK TO THE ARCHITECTURE, NOT DOCUMENTS\n\`\`\``;

type Preview = { sourceName: string; records: Array<{ originalPromptId: string; redactedText: string; contentHash: string; redactions: string[] }>; warnings: string[] };

export function IngestionPreview() {
  const [source, setSource] = useState(sample);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    const response = await fetch('/api/ingestion/preview', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ source, sourceName: 'preview.md' }) });
    setPreview(await response.json() as Preview);
    setLoading(false);
  };

  return <div className="compilerLayout"><section className="panel"><div className="panelHeader"><div><h2>Source preview</h2><p>Original evidence stays outside canonical knowledge.</p></div></div><div className="panelBody"><textarea className="textarea" style={{ minHeight: 430 }} value={source} onChange={(event) => setSource(event.target.value)} /><button type="button" className="primaryButton" onClick={run} disabled={loading} style={{ marginTop: 14 }}>{loading ? 'Parsing…' : 'Parse and redact preview'}</button></div></section><section className="panel"><div className="panelHeader"><div><h2>Derived records</h2><p>Nothing is persisted by this preview route.</p></div></div><div className="panelBody">{!preview ? <div className="emptyState"><strong>No preview yet.</strong>Paste an archive segment and inspect its safe projection.</div> : <>{preview.records.map((record) => <article className="providerResult" key={record.contentHash}><strong>{record.originalPromptId}</strong><p className="mono">{record.contentHash.slice(0, 18)}…</p><p>{record.redactedText}</p><div className="tagRow">{record.redactions.map((item) => <span className="tag" key={item}>{item}</span>)}</div></article>)}{preview.warnings.map((warning) => <p key={warning} style={{ color: 'var(--warning)', fontSize: 11 }}>{warning}</p>)}</>}</div></section></div>;
}
