import type { Metadata } from 'next';

import { AppShell } from '../components/AppShell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Limitless Architecting OS',
  description: 'Evidence-grounded architecting intelligence, prompt lineage, and reusable execution compiler.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AppShell>{children}</AppShell></body></html>;
}
