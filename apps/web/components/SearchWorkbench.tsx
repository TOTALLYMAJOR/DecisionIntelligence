'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { searchKnowledge, suggestedQueries } from '@limitless/core';
import { EvidenceBadge } from './EvidenceBadge';

export function SearchWorkbench({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(() => deferredQuery.trim() ? searchKnowledge(deferredQuery, 40) : [], [deferredQuery]);

  return (
    <section className="searchHero">
      <label className="searchInputWrap">
        <Search size={20} aria-hidden="true" />
        <span className="srOnly">Search architecting knowledge</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “tenant authority” or “commercial blast radius”" autoFocus />
      </label>
      <div className="suggestedQueries" aria-label="Suggested searches">
        {suggestedQueries.map((suggestion) => <button key={suggestion} type="button" onClick={() => setQuery(suggestion)}>{suggestion}</button>)}
      </div>
      <div className="searchResults" aria-live="polite">
        {!deferredQuery.trim() ? <div className="emptyState"><strong>Search the architecture, not only the files.</strong>Results connect prompts, principles, failures, controls, lineages, and profile evidence.</div> : null}
        {deferredQuery.trim() && results.length === 0 ? <div className="emptyState"><strong>No grounded result found.</strong>The system does not invent an adjacent match.</div> : null}
        {results.map((result) => (
          <Link href={result.href} className="searchResult" key={`${result.kind}-${result.id}`}>
            <div>
              <span className="resultKind">{result.kind} · {result.id}</span>
              <h3>{result.title}</h3>
              <p>{result.summary}</p>
              <div className="tagRow" style={{ marginTop: 10 }}>{result.tags.slice(0, 4).map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
            </div>
            <div className="resultScore"><EvidenceBadge grade={result.evidenceGrade} /><div style={{ marginTop: 8 }}>rank {result.score}</div></div>
          </Link>
        ))}
      </div>
    </section>
  );
}
