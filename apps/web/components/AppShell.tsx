import type { ReactNode } from 'react';
import Link from 'next/link';
import { Command, Database, LockKeyhole } from 'lucide-react';
import { Sidebar } from './Sidebar';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="appShell">
      <Sidebar />
      <div className="mainColumn">
        <header className="topbar">
          <Link href="/search" className="commandSearch">
            <Command size={16} aria-hidden="true" />
            <span>Search prompts, principles, failures, code evidence…</span>
            <kbd>⌘ K</kbd>
          </Link>
          <div className="topbarMeta">
            <span><Database size={14} /> fixture</span>
            <span><LockKeyhole size={14} /> private</span>
            <div className="avatar" aria-label="Major Mike workspace">MM</div>
          </div>
        </header>
        <main className="mainContent">{children}</main>
      </div>
    </div>
  );
}
