'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { AuthFooter, AuthInput, ErrorMessage, LogoLink, PasswordInput, SocialSignin } from '../AuthShared';

const pendingMessage = 'Auth API migration is pending. This form preserves the legacy UI and expected request shape for the later backend milestone.';

function validateRequired(fields, values) {
  return fields.reduce((errors, field) => {
    if (!values[field.name]) errors[field.name] = [field.message];
    return errors;
  }, {});
}

export function LoginPage() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState({ email: searchParams.get('email') || '', password: '' });
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const handleInputChange = (event) => setUser((current) => ({ ...current, [event.target.name]: event.target.value }));
  const onSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateRequired([{ name: 'email', message: 'Email is required' }, { name: 'password', message: 'Password is required' }], user);
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) setPending(true);
  };

  return (
    <div className="row m-0 justify-content-center grey-bg min-h-100vh">
      <div className="col-lg-8 col-10">
        <div className="text-center my-4"><LogoLink /></div>
        <div className="row grey-border">
          <div className="d-none d-lg-flex col-lg-5 align-items-center p-0 bg-blue auth-bg"><div className="w-100 text-center p-0 left-auth-box"></div></div>
          <div className="d-flex col-lg-7 col-md-12 white-bg">
            <div className="col-12 col-lg-12 px-xl-2 mx-auto">
              <div className="mt-1 pt-5"><h3 className="card-title fw-bold mb-1 text-center ">Log in to your account</h3><p className="text-center fw-500 mt-3"><span className="text-muted">Don't have an account?</span> <Link href="/register" className="text-theme fw-500">Sign up</Link></p></div>
              <div className="mt-3"><SocialSignin /></div>
              {pending && <div className="alert alert-light border text-center">{pendingMessage}</div>}
              <form className="auth-register-form mt-5" action="#" method="POST" onSubmit={onSubmit}>
                <p className="fw-500 text-center">Or log in with your email</p>
                <AuthInput icon="bi bi-envelope" type="email" selector="email" value={user.email} placeholder="Email" onChange={handleInputChange} errors={errors} />
                <PasswordInput selector="password" value={user.password} placeholder="Password" onChange={handleInputChange} errors={errors} />
                <div className="mb-4 text-right"><Link href="/request-reset-password">Forgot your password?</Link></div>
                <button type="submit" className="btn btn-primary w-100">Log in</button>
              </form>
              <div className="text-center my-5"><p className="fw-500">Are you a venue or supplier?</p><Link href="/vendor-login" className="dark-color"><strong>Business Login</strong></Link></div>
            </div>
          </div>
        </div>
      </div>
      <AuthFooter />
    </div>
  );
}

export function RegisterPage() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState({ fullName: searchParams.get('name') || '', email: searchParams.get('email') || '', password: '', address: 'Sydney, Australia', weddingStyle: '', weddingDate: '', telephone: '', acceptTermAndPrivacyPolicy: '' });
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const handleInputChange = (event) => setUser((current) => ({ ...current, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));
  const onSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateRequired([
      { name: 'fullName', message: 'Name and surname is required' },
      { name: 'email', message: 'Email is required' },
      { name: 'password', message: 'Password is required' },
      { name: 'address', message: 'Address field is required' },
      { name: 'weddingStyle', message: 'Wedding style is required' },
      { name: 'weddingDate', message: 'Wedding date is required' },
      { name: 'telephone', message: 'Your phone number is required' },
      { name: 'acceptTermAndPrivacyPolicy', message: 'You must accept to our terms and privacy policy!' },
    ], user);
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) setPending(true);
  };

  return (
    <div className="row m-0 justify-content-center grey-bg min-h-100vh">
      <div className="col-lg-8 col-10">
        <div className="text-center my-4"><LogoLink /></div>
        <div className="row grey-border">
          <div className="d-none d-lg-flex col-lg-5 align-items-center p-0 bg-blue auth-bg"><div className="w-100 text-center p-0 left-auth-box"></div></div>
          <div className="d-flex col-lg-7 col-md-12 white-bg">
            <div className="col-12 col-lg-12 px-xl-2 mx-auto">
              <div className="mt-3"><SocialSignin /></div><hr className="mt-4" />
              {pending && <div className="alert alert-light border text-center">{pendingMessage}</div>}
              <form className="auth-register-form mt-3" action="#" method="POST" onSubmit={onSubmit}>
                <p className="fw-500 text-center">Or sign up using your email</p>
                <AuthInput mbClassName="mb-3" type="text" selector="fullName" value={user.fullName} placeholder="Name and surname" onChange={handleInputChange} errors={errors} icon="bi bi-person" />
                <AuthInput mbClassName="mb-3" type="email" selector="email" value={user.email} placeholder="Email" onChange={handleInputChange} errors={errors} icon="bi bi-envelope" />
                <PasswordInput mbClassName="mb-3" selector="password" value={user.password} placeholder="Your password" onChange={handleInputChange} errors={errors} />
                <AuthInput mbClassName="mb-3" icon="bi bi-geo-alt" selector="address" value={user.address} placeholder="You live in" onChange={handleInputChange} errors={errors} />
                <div className="mb-3"><select name="weddingStyle" className="form-control select-theme-border filter" value={user.weddingStyle} onChange={handleInputChange}><option value="">Choose wedding style</option>{['Traditional Hindu Wedding', 'Brahmin Wedding', 'Christian Wedding', 'Muslim Wedding', 'Arya Vysya Wedding', 'Dravidian (Non-Brahmin) Wedding', 'Destination Weddings', 'Simplified/Elopement Weddings', 'Mixed Faith Weddings'].map((option) => <option key={option} value={option}>{option}</option>)}</select><ErrorMessage errors={errors} selector="weddingStyle" /></div>
                <div className="row"><div className="col-md-6"><AuthInput mbClassName="mb-3" type="date" selector="weddingDate" value={user.weddingDate} placeholder="Wedding Date" onChange={handleInputChange} errors={errors} /></div><div className="col-md-6"><AuthInput mbClassName="mb-3" icon="bi bi-telephone" selector="telephone" value={user.telephone} placeholder="Telephone" onChange={handleInputChange} errors={errors} /></div></div>
                <div className="mb-4"><div className="form-group"><div className="form-check"><input type="checkbox" name="acceptTermAndPrivacyPolicy" id="acceptTermAndPrivacyPolicy" onChange={handleInputChange} className="form-check-input w-h-17px theme-color-bg" /><label className="form-check-label" htmlFor="acceptTermAndPrivacyPolicy">&nbsp; <small>I accept Tamil Wedding book <Link href="" className="anchor-deco">Terms of Use</Link> and <Link href="" className="anchor-deco">Privacy Policy</Link></small></label></div></div><ErrorMessage errors={errors} selector="acceptTermAndPrivacyPolicy" /></div>
                <button type="submit" className="btn btn-primary w-100">Sign up</button>
              </form>
              <div className="text-center my-5"><p className="fw-500"><span className="text-muted">Already have an account?</span> <Link href="/login" className="text-theme fw-500">Log in</Link></p></div>
            </div>
          </div>
        </div>
      </div>
      <AuthFooter />
    </div>
  );
}

export function RequestResetPasswordPage() {
  const [user, setUser] = useState({ email: '' });
  const [errors, setErrors] = useState({});
  const [emailSent, setEmailSent] = useState(false);
  const handleInputChange = (event) => setUser({ email: event.target.value });
  const onSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateRequired([{ name: 'email', message: 'Email is required' }], user);
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) setEmailSent(true);
  };
  return (
    <div className="row m-0 justify-content-center grey-bg min-h-100vh">
      <div className="col-md-4">
        <div className="text-center my-4"><LogoLink /></div>
        <div className="row grey-border"><div className="d-flex col-12 white-bg"><div className="col-12 px-5 mx-auto">
          <div className="mt-1 pt-5"><h3 className="card-title fw-bold mb-1 text-center">Reset Password</h3><p className="text-center fw-500 mt-3">Enter your email address for instructions to reset your password</p></div>
          {emailSent && <div className="alert alert-success text-center">Perfect! We've just sent you an email with instructions to recover your password.</div>}
          <form className="auth-register-form mt-5" action="#" method="POST" onSubmit={onSubmit}><AuthInput mbClassName="mb-5" type="email" selector="email" value={user.email} placeholder="Email" onChange={handleInputChange} errors={errors} icon="bi bi-envelope" />{!emailSent && <div className="text-center"><button type="submit" className="btn btn-primary mb-5">Reset Password</button></div>}</form>
          <div className="text-center mt-2 mb-5"><Link href="/login">Back to login?</Link></div>
        </div></div></div>
      </div>
      <AuthFooter />
    </div>
  );
}

export function ResetPasswordPage() {
  const [user, setUser] = useState({ password: '', passwordConfirmation: '' });
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const handleInputChange = (event) => setUser((current) => ({ ...current, [event.target.name]: event.target.value }));
  const onSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateRequired([{ name: 'password', message: 'Password is required' }, { name: 'passwordConfirmation', message: 'Password confirmation is required' }], user);
    if (user.password && user.passwordConfirmation && user.password !== user.passwordConfirmation) nextErrors.password = ['The password confirmation does not match'];
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) setPending(true);
  };
  return (
    <div className="row m-0 justify-content-center grey-bg min-h-100vh">
      <div className="col-md-4">
        <div className="text-center my-4"><LogoLink /></div>
        <div className="row grey-border"><div className="d-flex col-12 white-bg"><div className="col-12 px-5 mx-auto">
          <div className="mt-1 pt-5"><h3 className="card-title fw-bold mb-1 text-center">Reset Password</h3><p className="text-center fw-500 mt-3">Enter your email address for instructions to reset your password</p></div>
          {pending && <div className="alert alert-light border text-center">{pendingMessage}</div>}
          <form className="auth-register-form mt-5" action="#" method="POST" onSubmit={onSubmit}><PasswordInput mbClassName="mb-4 mt-5" selector="password" value={user.password} placeholder="New password" onChange={handleInputChange} errors={errors} /><PasswordInput mbClassName="mb-4" selector="passwordConfirmation" value={user.passwordConfirmation} placeholder="Confirm password" onChange={handleInputChange} errors={errors} /><div className="text-center"><button type="submit" className="btn btn-primary mb-5">Reset Password</button></div></form>
        </div></div></div>
      </div>
      <AuthFooter />
    </div>
  );
}
