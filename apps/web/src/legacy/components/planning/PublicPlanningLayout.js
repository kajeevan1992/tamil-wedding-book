'use client';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import PlanningPage from './PublicPlanningPage';
import { homepageAppState } from '../../data/homepageApp';

export default function PublicPlanningLayout({ page }) {
  return (
    <>
      <Header app={homepageAppState} />
      <main id="body-content">
        <PlanningPage page={page} />
      </main>
      <Footer />
    </>
  );
}
