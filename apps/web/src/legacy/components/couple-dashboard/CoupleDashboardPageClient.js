'use client';

import dynamic from 'next/dynamic';

const CoupleDashboardLayout = dynamic(() => import('./CoupleDashboardLayout'), { ssr: false });

export default function CoupleDashboardPageClient({ page }) {
  return <CoupleDashboardLayout page={page} />;
}
