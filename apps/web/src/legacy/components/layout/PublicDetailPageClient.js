'use client';

import dynamic from 'next/dynamic';

const PublicDetailLayout = dynamic(() => import('./PublicDetailLayout'), {
  ssr: false,
});

export default function PublicDetailPageClient() {
  return <PublicDetailLayout />;
}
