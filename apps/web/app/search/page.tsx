import { PageHeader } from '../../components/PageHeader';
import { SearchWorkbench } from '../../components/SearchWorkbench';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  return <><PageHeader eyebrow="Hybrid retrieval" title="Search the architecture, not only the files." description="Exact IDs and phrases rank first. Lexical, fuzzy, semantic, and graph-aware retrieval remain derived projections over historical and canonical authority." /><SearchWorkbench initialQuery={q} /></>;
}
