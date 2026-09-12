import { lineages } from '@limitless/core';
import { LineageGraph } from '../../components/LineageGraph';
import { PageHeader } from '../../components/PageHeader';

export default async function LineagesPage({ searchParams }: { searchParams: Promise<{ selected?: string }> }) {
  const { selected } = await searchParams;
  const lineage = lineages.find((item)=>item.lineageId===selected) ?? lineages[1] ?? lineages[0];
  if (!lineage) return null;
  return <><PageHeader eyebrow="Causal architecture" title="Lineage Atlas" description="The core unit is not an isolated prompt. It is the chain from question to contradiction, principle, decision, implementation, failure, repair, and reusable control." /><div className="tagRow" style={{marginBottom:14}}>{lineages.map(item=><a className="tag" href={`/lineages?selected=${item.lineageId}`} key={item.lineageId}>{item.title}</a>)}</div><LineageGraph lineage={lineage}/><section className="panel prosePanel" style={{marginTop:16}}><h2>{lineage.title}</h2><p>{lineage.summary}</p><p><code>{lineage.project}</code> · {lineage.steps.length} evidence-graded steps · {lineage.edges.length} causal relationships</p><div className="timeline" style={{marginTop:20}}>{lineage.steps.map((step,index)=><div className="timelineItem" key={step.id}><div className="timelineRail"><span className="timelineDot"/></div><div className="timelineContent"><span>{String(index+1).padStart(2,'0')} · {step.type} · {step.evidenceGrade}</span><h3>{step.title}</h3><p>{step.detail}</p></div></div>)}</div></section></>;
}
