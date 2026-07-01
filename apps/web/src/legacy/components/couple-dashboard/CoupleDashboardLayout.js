'use client';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import CoupleDashboardPage from './CoupleDashboardPage';
import { homepageAppState } from '../../data/homepageApp';
import { coupleLinks } from '../../data/coupleDashboardData';
import Link from 'next/link';

function CoupleLinks() {
  return (
    <section className="vendor-nav-sticky pb-1px-grey bg-white-full">
      <div className="container"><div className="row"><div className="col-lg-12">
        <ul className="nav nav-pills my-listing-tab justify-content-center nav-fill pt-2 pb-0" id="pills-tab1" role="tablist">
          {coupleLinks.map((link) => <li className="nav-item nav-bottom-link" role="presentation" key={link.href}><Link href={link.href} className="nav-link"><i className={`${link.icon} fn-35`}></i><small className="d-block mt-2 fn-bold">{link.name}</small></Link></li>)}
        </ul>
      </div></div></div>
    </section>
  );
}

export default function CoupleDashboardLayout({ page }) {
  return (
    <>
      <Header app={{ ...homepageAppState, isLoggedIn: true }} />
      <main id="body-content">
        <CoupleLinks />
        <section><div><CoupleDashboardPage page={page} /></div></section>
      </main>
      <Footer />
    </>
  );
}
