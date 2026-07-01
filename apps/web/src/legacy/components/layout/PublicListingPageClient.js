'use client';

import dynamic from 'next/dynamic';

const PublicListingLayout = dynamic(() => import('./PublicListingLayout'), {
  ssr: false,
});

export default function PublicListingPageClient(props) {
  return <PublicListingLayout {...props} />;
}
