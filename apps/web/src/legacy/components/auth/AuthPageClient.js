'use client';

import dynamic from 'next/dynamic';

const pages = {
  login: dynamic(() => import('./pages/CustomerAuthPages').then((mod) => mod.LoginPage), { ssr: false }),
  register: dynamic(() => import('./pages/CustomerAuthPages').then((mod) => mod.RegisterPage), { ssr: false }),
  requestResetPassword: dynamic(() => import('./pages/CustomerAuthPages').then((mod) => mod.RequestResetPasswordPage), { ssr: false }),
  resetPassword: dynamic(() => import('./pages/CustomerAuthPages').then((mod) => mod.ResetPasswordPage), { ssr: false }),
  vendorLogin: dynamic(() => import('./pages/VendorAuthPages').then((mod) => mod.VendorLoginPage), { ssr: false }),
  vendorRegister: dynamic(() => import('./pages/VendorAuthPages').then((mod) => mod.VendorRegisterPage), { ssr: false }),
};

export default function AuthPageClient({ page }) {
  const Page = pages[page];
  return <Page />;
}
