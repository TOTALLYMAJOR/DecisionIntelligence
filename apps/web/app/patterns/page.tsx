import { patterns } from '@limitless/core';
import { EvidenceBadge } from '../../components/EvidenceBadge';
import { PageHeader } from '../../components/PageHeader';

export default function PatternsPage(){return <><PageHeader eyebrow="Reusable architecture" title="Patterns" description="Patterns turn repeated reasoning into named, testable solution structures. They remain linked to their originating prompts and failures."/><div className="entityGrid">{patterns.map(item=><article className="entityCard" style={{minHeight:240}} key={item.id}><div className="entityCardTop"><span className="entityMeta">{item.id}</span><EvidenceBadge grade={item.evidenceGrade}/></div><h3>{item.title}</h3><p style={{color:'var(--text)',fontSize:13}}>{item.statement}</p><p>{item.description}</p><div className="tagRow" style={{marginTop:'auto'}}>{item.tags.map(tag=><span className="tag" key={tag}>{tag}</span>)}</div></article>)}</div></>}
