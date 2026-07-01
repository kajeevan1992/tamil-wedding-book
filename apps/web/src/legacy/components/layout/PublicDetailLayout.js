'use client';

import Header from './Header';
import Footer from './Footer';
import VendorDetail from '../pages/VendorDetail';
import { homepageAppState } from '../../data/homepageApp';

export default function PublicDetailLayout() {
  return (
    <>
      <Header app={homepageAppState} />
      <main id="body-content">
        <VendorDetail app={homepageAppState} />
      </main>
      <Footer />
    </>
  );
}
