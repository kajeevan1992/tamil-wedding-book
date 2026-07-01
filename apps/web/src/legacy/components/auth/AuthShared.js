'use client';

import Link from 'next/link';

export function AuthFooter() {
  return (
    <div className="col-md-12 mt-4 text-center fs-12px text-muted fw-500">
      <ul className="w-100">
        <li className="inline-block mx-2"><a href="#" className="light-grey-color fw-500">Sign up with Tamil Wedding Book</a></li>
        <li className="inline-block mx-2"><a href="#" className="light-grey-color fw-500">Are You a Wedding Business?</a></li>
        <li className="inline-block mx-2"><a href="#" className="light-grey-color fw-500">Contact Us</a></li>
        <li className="inline-block mx-2"><a href="#" className="light-grey-color fw-500">Terms of Use</a></li>
        <li className="inline-block mx-2"><a href="#" className="light-grey-color fw-500">Privacy Policy</a></li>
        <li className="inline-block mx-2"><a href="#" className="light-grey-color fw-500">Cookies Policy</a></li>
        <li className="inline-block mx-2"><a href="#" className="light-grey-color fw-500">Do Not Sell My Personal Information</a></li>
        <li className="inline-block mx-2"><a href="#" className="light-grey-color fw-500">About Tamile Wedding Book</a></li>
      </ul>
      <p className="layout-auth-footer-copyright">© {new Date().getFullYear()} tamilweddingbook.co.uk</p>
    </div>
  );
}

export function SocialSignin() {
  return (
    <ul className="list-unstyled w-100">
      <li><a href="#" className="btn btn-white px-2 py-1 m-2 d-block no-hr-effect" onClick={(event) => event.preventDefault()}><i className="fa fa-facebook-f text-blue float-left mt-1"></i><span className="login-with">Sign in with Facebook</span></a></li>
      <li><a href="#" className="btn btn-white px-2 py-1 m-2 d-block no-hr-effect" onClick={(event) => event.preventDefault()}><i className="fa fa-google text-theme float-left mt-1"></i><span className="login-with">Sign in with Google</span></a></li>
      <li><a href="#" className="btn btn-white px-2 py-1 m-2 d-block no-hr-effect" onClick={(event) => event.preventDefault()}><i className="fa fa-apple text-dark float-left mt-1"></i><span className="login-with">Sign in with Apple</span></a></li>
    </ul>
  );
}

export function ErrorMessage({ errors, selector }) {
  if (!errors?.[selector]) return null;
  return <div className="invalid-feedback">{errors[selector][0]}</div>;
}

export function AuthInput({ errors, icon, selector, type = 'text', placeholder, value, onChange, allBorders = true, mbClassName = 'mb-4' }) {
  return (
    <div className={mbClassName}>
      <div className="input-group password-hidden">
        <input type={type} name={selector} value={value} id={selector} onChange={onChange} placeholder={placeholder} className={`form-control own-input ${allBorders ? '' : 'only-b-brdr-grey'}`} />
        {icon && <span className="input-group-text cursor-pointer transparent-password-toggle"><i className={icon}></i></span>}
      </div>
      <ErrorMessage errors={errors} selector={selector} />
    </div>
  );
}

export function PasswordInput({ errors, selector, placeholder, value, onChange, mbClassName = 'mb-4' }) {
  return <AuthInput errors={errors} selector={selector} type="password" placeholder={placeholder} value={value} onChange={onChange} icon="bi bi-eye" mbClassName={mbClassName} />;
}

export function LogoLink() {
  return (
    <Link href="/">
      <img src="/assets/images/about/Tamil_Wedding_Book.png" alt="" className="own-pl-image auth-logo" />
    </Link>
  );
}

export function AuthVendorHeader() {
  return (
    <header className="fixed-top header-anim">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid text-nowrap bdr-nav">
          <div className="d-flex mr-auto"><Link href="/" className="navbar-brand"><img src="/assets/images/about/Tamil_Wedding_Book.png" alt="Tamil Wedding Book" className="own-pl-image" /></Link></div>
          <button className="navbar-toggler x collapsed" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation"><span className="icon-bar"></span><span className="icon-bar"></span><span className="icon-bar"></span></button>
          <div className="collapse navbar-collapse ml-3" id="navbarCollapse" data-hover="dropdown" data-animations="slideInUp slideInUp slideInUp slideInUp">
            <ul className="navbar-nav header-menu">
              <li className="nav-item"><Link href="/vendor-login" className="nav-link">BUSINESS LOGIN</Link></li>
              <li className="nav-item"><a className="nav-link" href="login-feature-page.html">FEATURES </a></li>
              <li className="nav-item"><a className="nav-link dropdown-toggle-mob" href="login-premium.html">PREMIUM SERVICE </a></li>
              <li className="nav-item"><a className="nav-link" href="get-app.html">GET THE APP</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export function AuthVendorFooter() {
  return (
    <footer className="bg-light">
      <div className="container"><div className="row no-gutters"><div className="col-lg-12"><div className="row">
        <div className="col-md"><div className="footer-logo"><img src="/assets/images/about/Tamil_Wedding_Book.png" alt="" style={{ padding: '0 0 7px 25px', marginBottom: '2rem', height: '53px' }} /><h6 className="ml-4 mb-3">Information</h6><ul className="list-unstyled ml-4 mb-0 widget-listing arrow"><li className="own-padding"><a href="javascript:"><small>Contact Us</small></a></li><li className="own-padding"><a href="javascript:"><small>Terms of Use</small></a></li><li className="own-padding"><a href="javascript:"><small>Privacy Policy</small></a></li><li className="own-padding"><a href="javascript:"><small>Cookies Policy</small></a></li><li className="own-padding"><a href="javascript:"><small>Are You a Supplier?</small></a></li><li className="own-padding"><a href="javascript:"><small>About Tamil Wedding Book</small></a></li></ul></div></div>
        <div className="col-md"><div className="footer-widget"><h3 className="widget-title" style={{ color: ' #0c0c0c', fontSize: '12px' }}>Download The TamilWeddingBook App</h3><div className="widget-contact"><p className="own-family"><small>Sed ut perspiciatis unde mnis iste natus error sit ptatem accus antium doloremque lauda ntium.</small></p></div><div className="row"><div className="col"><img src="/assets/images/about/app-store.png" alt="" /></div><div className="col"><img src="/assets/images/about/google-play.png" alt="" /></div></div></div></div>
        <div className="col-md ml-5"><div className="footer-widget"><h3 className="widget-title" style={{ color: '#0c0c0c', fontSize: '12px' }}>Follow us on</h3><div className="social-icons-footers"><ul className="list-unstyled"><li><a href="javascript:"><i className="fa fa-facebook-f "></i></a></li><li><a href="javascript:"><i className="fa fa-twitter"></i></a></li><li><a href="javascript:"><i className="fa fa-instagram"></i></a></li><li><a href="javascript:"><i className="fa fa-linkedin"></i></a></li></ul></div></div></div>
        <div className="col-md"><div className="footer-widget"><h3 className="widget-title" style={{ color: '#0c0c0c', fontSize: '12px' }}>Choose a country</h3><div className="mb-3"><input type="text" className="form-control form-light" placeholder="Choose Country" style={{ background: 'white !important' }} /></div></div></div>
      </div></div></div></div>
      <div className="copyrights bg-light" style={{ borderTop: '1px solid rgb(207, 204, 204)' }}><div className="container"><div className="row"><div className="col-md-auto col-12 mt-4 own-family">© 2022 TamilWeddingBook</div></div></div></div>
    </footer>
  );
}
