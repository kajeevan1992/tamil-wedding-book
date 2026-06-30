import type { ReactNode } from 'react';
import { LegacyLayoutShell } from '@/components/migration/LegacyLayoutShell';
import './globals.css';

export const metadata = {
  title: 'Tamil Wedding Book',
  description: 'Tamil Wedding Book migration scaffold'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LegacyLayoutShell>{children}</LegacyLayoutShell>
      </body>
    </html>
  );
}
