'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function PlanningHeader({ title, body, image }) {
  const [user, setUser] = useState({ fullName: '', email: '' });
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    setUser((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!user.fullName) nextErrors.fullName = ['Name and surname is required'];
    if (!user.email) nextErrors.email = ['Email is required'];
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) {
      window.location.href = `/register?name=${encodeURIComponent(user.fullName)}&email=${encodeURIComponent(user.email)}`;
    }
  };

  return (
    <section className="callout-main border-bottom pb-0">
      <div className="container">
        <div className="row">
          <div className="col-md-7">
            <h2 className="text-theme my-4 text-sm-center">{title}</h2>
            <p className="text-sm-center">{body}</p>
            <div>
              <form onSubmit={onSubmit}>
                <p className="mt-0">Get Started:</p>
                <div className="row">
                  <div className="col-md-4 mb-3"><input className="form-control own-input bg-white" type="text" name="fullName" value={user.fullName} placeholder="Name" onChange={handleInputChange} />{errors.fullName && <div className="invalid-feedback">{errors.fullName[0]}</div>}</div>
                  <div className="col-md-4 mb-3"><input className="form-control own-input bg-white" type="email" name="email" value={user.email} placeholder="Email" onChange={handleInputChange} />{errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}</div>
                  <div className="col-md-4 text-sm-center"><button type="submit" className="btn btn-primary mt-1">Start Planning</button></div>
                </div>
              </form>
            </div>
            <div className="text-sm-center my-4"><span>Already have an account? <Link href="/login" style={{ textDecoration: 'underline' }}>Login</Link></span></div>
          </div>
          <div className="col-md-1 d-none d-md-block"></div>
          <div className="col-md-4 d-none d-md-block my-4"><div className="card"><div className="card-body p-1"><img src={image} alt="Tamil wedding book guest list" className="w-100" /></div></div></div>
        </div>
      </div>
    </section>
  );
}
