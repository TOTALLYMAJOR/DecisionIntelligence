'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { primaryNavigation, secondaryNavigation } from '../lib/navigation';

const isActive = (pathname: string, href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="brandBlock">
        <div className="brandMark" aria-hidden="true">L</div>
        <div>
          <strong>LIMITLESS</strong>
          <span>Architecting OS</span>
        </div>
      </div>

      <nav className="navStack">
        <p className="navEyebrow">Workbench</p>
        {primaryNavigation.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={isActive(pathname, href) ? 'navLink active' : 'navLink'}>
            <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <nav className="navStack secondaryNav">
        <p className="navEyebrow">Intelligence</p>
        {secondaryNavigation.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={isActive(pathname, href) ? 'navLink active' : 'navLink'}>
            <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="workspaceCard">
        <span className="statusDot" />
        <div>
          <strong>Fixture authority</strong>
          <span>20 prompts · local mode</span>
        </div>
      </div>
    </aside>
  );
}
