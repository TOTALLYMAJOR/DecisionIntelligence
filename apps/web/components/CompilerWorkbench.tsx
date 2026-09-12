'use client';

import { useMemo, useState } from 'react';
import { Check, Clipboard, Sparkles } from 'lucide-react';
import { compileArchitectingPrompt, compilerModules } from '@limitless/core';
import { EvidenceBadge } from './EvidenceBadge';

const defaultProblem = 'Audit and implement a multi-tenant integration that preserves one canonical authority, handles ambiguous provider outcomes, and delivers the smallest safe slice.';
const defaultModules = ['MODULE-REPOSITORY-REALITY', 'MODULE-BOUNDED-DISCOVERY', 'MODULE-CANONICAL-AUTHORITY', 'MODULE-PROOF-BOUNDARY', 'MODULE-AI-ADVISORY', 'MODULE-ROLLBACK-STOP'];

export function CompilerWorkbench() {
  const [problem, setProblem] = useState(defaultProblem);
  const [selected, setSelected] = useState<string[]>(defaultModules);
  const [copied, setCopied] = useState(false);
  const compiled = useMemo(() => {
    try { return compileArchitectingPrompt(problem, selected); }
    catch { return null; }
  }, [problem, selected]);

  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]);
  const copy = async () => {
    if (!compiled) return;
    await navigator.clipboard.writeText(compiled.markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_500);
  };

  return (
    <div className="compilerLayout">
      <section className="panel">
        <div className="panelHeader"><div><h2>Architecting brief</h2><p>Choose proven modules; the compiler preserves their provenance.</p></div><Sparkles size={17} /></div>
        <div className="panelBody">
          <label><span className="fieldLabel">Problem and desired outcome</span><textarea className="textarea" value={problem} onChange={(event) => setProblem(event.target.value)} /></label>
          <div className="moduleList">
            {compilerModules.map((module) => (
              <label className="moduleOption" key={module.moduleId}>
                <input type="checkbox" checked={selected.includes(module.moduleId)} onChange={() => toggle(module.moduleId)} />
                <span><strong>{module.title}</strong><p>{module.purpose}</p></span>
                <EvidenceBadge grade={module.evidenceGrade} />
              </label>
            ))}
          </div>
        </div>
      </section>
      <section className="panel">
        <div className="panelHeader"><div><h2>Compiled execution contract</h2><p>{selected.length} source modules · disposable output · canonical modules unchanged</p></div><button className="secondaryButton" type="button" onClick={copy} disabled={!compiled}>{copied ? <Check size={15}/> : <Clipboard size={15}/>} {copied ? 'Copied' : 'Copy'}</button></div>
        <pre className="codeOutput">{compiled?.markdown ?? 'Select at least one valid module and describe a material software problem.'}</pre>
      </section>
    </div>
  );
}
