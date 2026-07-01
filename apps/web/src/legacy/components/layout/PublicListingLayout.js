'use client';

import Header from './Header';
import Footer from './Footer';
import SearchVendor from '../pages/SearchVendor';
import { homepageAppState } from '../../data/homepageApp';

export default function PublicListingLayout({ title = 'Search Results' }) {
  return (
    <>
      <Header app={homepageAppState} />
      <main id="body-content">
        <SearchVendor routeTitle={title} />
      </main>
      <Footer />
    </>
  );
}
