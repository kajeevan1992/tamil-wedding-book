'use client';

import Header from './Header';
import Footer from './Footer';
import Home from '../pages/Home';
import { homepageAppState } from '../../data/homepageApp';

export default function HomeLayout() {
  return (
    <>
      <Header app={homepageAppState} />
      <main id="body-content">
        <Home app={homepageAppState} />
      </main>
      <Footer />
    </>
  );
}
