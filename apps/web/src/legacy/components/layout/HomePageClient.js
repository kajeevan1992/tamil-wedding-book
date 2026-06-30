'use client';

import dynamic from 'next/dynamic';

const HomeLayout = dynamic(() => import('./HomeLayout'), {
  ssr: false,
});

export default function HomePageClient() {
  return <HomeLayout />;
}
