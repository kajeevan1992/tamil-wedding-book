'use client';

import dynamic from 'next/dynamic';

const PublicPlanningLayout = dynamic(() => import('./PublicPlanningLayout'), { ssr: false });

export default function PublicPlanningPageClient({ page }) {
  return <PublicPlanningLayout page={page} />;
}
