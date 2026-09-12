import { DecisionStudio } from '../../components/DecisionStudio';
import { PageHeader } from '../../components/PageHeader';

export default function DecisionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Change intelligence"
        title="What will this change disturb?"
        description="Map likely consequences, retrieve relevant precedent, compare architecture postures, and compile a draft decision contract before implementation begins."
      />
      <DecisionStudio />
    </>
  );
}
