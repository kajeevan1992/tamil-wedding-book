'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { AuthInput, AuthVendorFooter, AuthVendorHeader, ErrorMessage, LogoLink, PasswordInput } from '../AuthShared';

const pendingMessage = 'Vendor auth API migration is pending. This form preserves the legacy UI and expected request shape for the later backend milestone.';

function vendorErrors(fields, values) {
  return fields.reduce((errors, field) => {
    if (!values[field.name]) errors[field.name] = [field.message];
    return errors;
  }, {});
}

export function VendorLoginPage() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState({ email: searchParams.get('email') || '', password: '', vendorLogin: true });
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const handleInputChange = (event) => setUser((current) => ({ ...current, [event.target.name]: event.target.value }));
  const onSubmit = (event) => {
    event.preventDefault();
    const nextErrors = vendorErrors([{ name: 'email', message: 'Email/Username is required' }, { name: 'password', message: 'Password is required' }], user);
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) setPending(true);
  };

  return (
    <>
      <AuthVendorHeader />
      <main id="body-content">
        <section className="callout-main bg-light-gray pb-0">
          <div className="call-out-bg"><div className="overlay"></div><div className="container pt-5"><div className="row">
            <div className="col-lg-8 col-md-8">
              <h3 className="txt-white fw-6 mb-5">Grow Your Business with TamilWeddingBook</h3>
              <ul className="list-unstyled"><li className="text-white own-themify mt-2"><i className="fa fa-check own-color"></i> &nbsp; Grow Your Business with TamilWeddingBook</li><li className="text-white own-themify mt-2"><i className="fa fa-check own-color"></i> &nbsp; Reach local engaged couples and book more weddings. </li><li className="text-white own-themify mt-2"><i className="fa fa-check own-color"></i> &nbsp; Trusted by over 16,000 wedding businesses in the UK.</li></ul>
              <Link href="/vendor-register" className="btn btn-primary own-family mt-4">Create Your Account</Link>
            </div>
            <div className="col-lg-4 col-md-4"><div className="auth-vendor-login-bg"><form role="form" className="w-100" onSubmit={onSubmit}><h4 className="text-white mb-3">BUSINESS LOGIN</h4>{pending && <div className="alert alert-light border">{pendingMessage}</div>}<AuthInput icon="bi bi-envelope" type="text" selector="email" value={user.email} placeholder="Email/Username" onChange={handleInputChange} errors={errors} /><PasswordInput selector="password" value={user.password} placeholder="Password" onChange={handleInputChange} errors={errors} /><button className="btn btn-primary own-family own-btn-login btn-sm btn-block">Log In</button><div className="linkage mt-4"><a href="#" className="forgot-pass-link text-white">Forgot your password?</a></div></form></div></div>
          </div></div></div>
        </section>
        <section className="wide-tb-100"><div className="container"><div className="row">{[['login-icon1.png', 'Reach Engaged Couples'], ['login-icon2.png', 'Reach Engaged Couples'], ['login-icon3.png', 'Reach Engaged Couples']].map(([image, title]) => <div className="col-lg-4" key={image}><div className="ml-2 text-center"><img src={`/assets/images/categories/${image}`} className="" width="26%" alt="" /></div><div className="mt-5"><h3 className="own-color text-center">{title}</h3><p className="mt-5 text-center">Couples can find your listing and request information about your business</p></div></div>)}</div></div></section>
        <section className="own-container-bg"><div className="container"><div className="row"><div className="col-lg-6"><div className="p-5"><h3 className="mt-4 fw-6 own-color">Showcase Your Business</h3><ul className="list-unstyled  mb-0 widget-listing arrow"><li className="own-list-style mt-4"><i className="tamilweddingbook_checklist mt-1 own-icon-2"></i> <span className="ml-3">Be visible to couples on top search engines with your TamilWeddingBook listing</span></li><li className="own-list-style mt-3"><i className="tamilweddingbook_guitar mt-1 own-icon-2"></i> <span className="ml-3">Reach more engaged couples and receive lead details immediately to your email and phone</span></li><li className="own-list-style mt-3"><i className="tamilweddingbook_dove mt-1 own-icon-2"></i> <span className="ml-3">Track performance and get expert advice to help you make the most of your listing</span></li></ul></div></div><div className="col-lg-6"><img src="/assets/images/categories/login-image.png" alt="" /></div></div></div></section>
        <section className="mt-5"><div className="container"><div className="row"><div className="col-lg-6 p-0"><img src="/assets/images/categories/mobile.png" alt="" /></div><div className="col-lg-6"><div className="p-5"><h3 className="mt-4 fw-6 own-color">Manage Your Business Anywhere</h3><p className="mt-4">Keep your TamilWeddingBook storefront close to hand and connect with couples from wherever you are.</p></div></div></div></div></section>
      </main>
      <AuthVendorFooter />
    </>
  );
}

export function VendorRegisterPage() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState({ fullName: '', address: 'Sydney, Australia', role: '', businessCategory: '', email: searchParams.get('email') || '', telephone: '', username: '', password: '', acceptTermAndPrivacyPolicy: '' });
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const handleInputChange = (event) => setUser((current) => ({ ...current, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));
  const onSubmit = (event) => {
    event.preventDefault();
    const nextErrors = vendorErrors([
      { name: 'fullName', message: 'Business name is required' },
      { name: 'address', message: 'Business Location is required' },
      { name: 'role', message: 'Please choose one option' },
      { name: 'businessCategory', message: 'Please choose one option' },
      { name: 'email', message: 'Email is required' },
      { name: 'telephone', message: 'Phone number is required' },
      { name: 'username', message: 'Username is required' },
      { name: 'password', message: 'Password is required' },
      { name: 'acceptTermAndPrivacyPolicy', message: 'You must accept to our terms and privacy policy!' },
    ], user);
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) setPending(true);
  };

  return (
    <div className="row m-0 justify-content-center grey-bg min-h-100vh">
      <div className="col-lg-12"><div className="row">
        <div className="d-none d-lg-flex col-lg-5 align-items-center p-0 bg-blue auth-bg"><div className="w-100 text-center p-0 left-auth-box"><div className="auth-dark-business"><div className="auth-dark-business-inner"><h3>Tamil Wedding Book</h3><h6>Boost your business with us</h6></div></div></div></div>
        <div className="d-flex col-lg-7 col-md-12 white-bg px-5"><div className="col-12 col-lg-12 px-xl-2 mx-auto">
          <div className="d-flex justify-content-between my-4"><LogoLink /><div><strong className="mr-2">Customer service </strong><a href="tel:08002061700"> <span className="bi bi-headset"></span> 08002061700</a></div></div>
          {pending && <div className="alert alert-light border">{pendingMessage}</div>}
          <form className="auth-register-form mt-4" action="#" method="POST" onSubmit={onSubmit}>
            <h3 className="fw-600">Try Tamil Wedding Book for free and grow your business.</h3>
            <div className="mt-5"><h4>Contact details</h4><p>Create your own storefront and be visible to thousands of couples.</p></div>
            <div className="row"><div className="col-md-8"><AuthInput mbClassName="mb-3" icon="bi bi-briefcase" selector="fullName" value={user.fullName} placeholder="Name of the business" onChange={handleInputChange} errors={errors} /><AuthInput mbClassName="mb-3" icon="bi bi-geo-alt" selector="address" value={user.address} placeholder="Business location" onChange={handleInputChange} errors={errors} /><select name="role" className="form-control mb-3" value={user.role} onChange={handleInputChange}><option value="">Business type</option><option value="venue">Venue</option><option value="supplier">Supplier</option></select><ErrorMessage errors={errors} selector="role" /><select name="businessCategory" className="form-control mb-3" value={user.businessCategory} onChange={handleInputChange}><option value="">Business category</option><option value="Venues">Venues</option><option value="Photography">Photography</option><option value="Florist">Florist</option><option value="Music">Music</option></select><ErrorMessage errors={errors} selector="businessCategory" /></div></div>
            <div className="mt-5"><h4>Login details</h4><p>These details will be used to access your supplier dashboard later.</p></div>
            <div className="row"><div className="col-md-8"><AuthInput mbClassName="mb-3" icon="bi bi-envelope" type="email" selector="email" value={user.email} placeholder="Email" onChange={handleInputChange} errors={errors} /><AuthInput mbClassName="mb-3" icon="bi bi-telephone" selector="telephone" value={user.telephone} placeholder="Telephone" onChange={handleInputChange} errors={errors} /><AuthInput mbClassName="mb-3" icon="bi bi-person" selector="username" value={user.username} placeholder="Username" onChange={handleInputChange} errors={errors} /><PasswordInput mbClassName="mb-3" selector="password" value={user.password} placeholder="Password" onChange={handleInputChange} errors={errors} /></div></div>
            <div className="mb-4"><div className="form-group"><div className="form-check"><input type="checkbox" name="acceptTermAndPrivacyPolicy" id="acceptTermAndPrivacyPolicy" onChange={handleInputChange} className="form-check-input w-h-17px theme-color-bg" /><label className="form-check-label" htmlFor="acceptTermAndPrivacyPolicy">&nbsp; <small>I accept Tamil Wedding book <Link href="" className="anchor-deco">Terms of Use</Link> and <Link href="" className="anchor-deco">Privacy Policy</Link></small></label></div></div><ErrorMessage errors={errors} selector="acceptTermAndPrivacyPolicy" /></div>
            <button type="submit" className="btn btn-primary mb-5">Create Your Account</button>
          </form>
        </div></div>
      </div></div>
    </div>
  );
}
