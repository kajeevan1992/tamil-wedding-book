import type { ReactNode } from 'react';
import Script from 'next/script';
import './globals.css';
import 'react-multi-carousel/lib/styles.css';

export const metadata = {
  title: 'Tamil Book',
  description: 'tamilweddingbook ',
  keywords: 'bride, business, couple, directory, groom, listing, login, map, marketing, realwedding, registration, rsvp, vendor, wedding, wedding planner',
  icons: {
    icon: '/assets/images/about/Tamil_Wedding_Book_Logo 1.svg',
    apple: '/assets/images/about/Tamil_Wedding_Book_Logo 1.svg'
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="content-type" content="text/html; charset=UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="MobileOptimized" content="320" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/assets/css/base.css" />
      </head>
      <body>
        {children}
        <Script src="/assets/library/jquery/jquery-min.js" strategy="beforeInteractive" />
        <Script src="/assets/library/bootstrap/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
        <Script src="/assets/library/bootstrap/js/bootstrap-dropdownhover.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
