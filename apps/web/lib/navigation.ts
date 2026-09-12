import {
  Activity,
  BookOpenText,
  Boxes,
  BrainCircuit,
  GitBranch,
  Library,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  UserRoundSearch,
  Workflow,
} from 'lucide-react';

export const primaryNavigation = [
  { href: '/', label: 'Now', icon: Activity },
  { href: '/decisions', label: 'Decision Studio', icon: Scale },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/library', label: 'Library', icon: Library },
  { href: '/lineages', label: 'Lineages', icon: GitBranch },
  { href: '/principles', label: 'Principles', icon: ShieldCheck },
  { href: '/patterns', label: 'Patterns', icon: Boxes },
  { href: '/failure-lab', label: 'Failure Lab', icon: TriangleAlert },
  { href: '/compiler', label: 'Compiler', icon: Workflow },
] as const;

export const secondaryNavigation = [
  { href: '/methodology', label: 'Methodology', icon: BrainCircuit },
  { href: '/profile', label: 'Creator Profile', icon: UserRoundSearch },
  { href: '/projects', label: 'Projects', icon: BookOpenText },
  { href: '/review', label: 'Review Center', icon: Sparkles },
  { href: '/ingestion', label: 'Ingestion', icon: Sparkles },
] as const;
