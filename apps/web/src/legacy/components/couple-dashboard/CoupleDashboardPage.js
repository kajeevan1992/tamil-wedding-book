'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  coupleProfile,
  coupleStats,
  notifications,
} from '../../data/coupleDashboardData';
import CoupleChecklistPage from './CoupleChecklistPage';
import CoupleGuestListPage from './CoupleGuestListPage';
import CoupleBudgetPlannerPage from './CoupleBudgetPlannerPage';
import CoupleSeatingChartPage from './CoupleSeatingChartPage';
import CoupleVendorsPage from './CoupleVendorsPage';

function DashboardBanner() {
  return (
    <section className="slider-wrap bg-gradient" style={{ backgroundColor: coupleProfile.themeColor }}>
      <div id="photoLoading" className="dash-hero-wrapper wrapper">
        <div id="uploadContainer" className="pure-g-r dash-heroContainer">
          <div id="pickfiles" className="pure-u-1-3 dash-cover app-spinner-container app-pencil-profile cursor-defult">
            <img className="block app-tools-main-front-img dash-img" src="/assets/images/pages/guestlist.png" alt="Tamil Wedding BooK" />
            <div className="dash-coverTopSection"><label className="dash-coverTopSectionButton app-croppie-browse-button-front app-ua-track-event-multiple"><span className="bi bi-camera"></span> Change photo </label><label className="dash-coverTopSectionButton app-countdown-share app-ua-track-event-multiple"><span className="bi bi-upload"></span> Share </label></div>
          </div>
          <div className="pure-u-2-3 dash-summaryContainer">
            <div className="dash-summary">
              <button type="button" className="btn btn-sm btn-outline-primary btn-rt-15px">Edit</button>
              <div className="dash-summary-info text-center"><ul className="avatar-group reverse avatar-group-medium p-0"><li className="avatar-group-item app-marriage-layer-open"><div className="avatar-alias size-avatar-xmedium avatar-center"><span className="avatar-initials">K</span><div className="camera-bg"><span className="bi bi-camera"></span></div></div></li><li className="avatar-group-item app-marriage-layer-open"><div className="avatar-alias size-avatar-xmedium avatar-center"><span className="avatar-initials">P</span><div className="camera-bg"><span className="bi bi-camera"></span></div></div></li></ul><p className="dash-couple-names"><span className="app-owner-name">{coupleProfile.fullName} & {coupleProfile.partnerName}</span></p><div className="dash-couple-personal"><div className="dash-couple-personal-date"><p className="dash-couple-subtitle"><span>{coupleProfile.weddingDate}</span></p></div></div></div>
              <hr />
              <div className="row">{coupleStats.map((stat) => <div className="col mb-3" key={stat.label}><Link href={stat.href}><div className="card"><div className="card-body p-2 text-center"><div className="rounded-circle border mx-auto d-flex align-items-center justify-content-center" style={{ width: 58, height: 58 }}><small>{stat.value}</small></div><small className="mt-2 d-block m-0"><strong>{stat.label}</strong></small></div></div></Link></div>)}</div>
            </div>
            <div className="dash-summary-wedsite"><div className="icon-tools icon-tools-wedsite-small"><span className="ml5"><strong>From '<span className="text-theme">yes</span>' to '<span className="text-theme">I do,</span>' we've got you covered.</strong></span></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AccountSidebar({ active = 'information' }) {
  const links = [
    { key: 'information', href: '/couple/account', label: 'User Information' },
    { key: 'settings', href: '/couple/account/settings', label: 'Account Settings' },
    { key: 'notifications', href: '/couple/account/notifications', label: 'Notifications' },
  ];

  return (
    <>
      <h3 className="mb-3 fw-600">Settings</h3>
      <ul className="nav flex-column couple-account">
        {links.map((link) => (
          <li className="nav-item" key={link.key}>
            <Link href={link.href} className={`nav-link${active === link.key ? ' active' : ''}`}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function ProfileField({ label, name, value, type = 'text', editing, onChange }) {
  return (
    <div className="col-md-6 mb-3">
      <label className="form-label small text-muted mb-1">{label}</label>
      <input className="form-control" type={type} name={name} value={value || ''} onChange={onChange} disabled={!editing} />
    </div>
  );
}

function ColourSwatch({ label, value }) {
  return (
    <div className="d-flex align-items-center mr-4 mb-2">
      <span className="rounded-circle border mr-2" style={{ width: 22, height: 22, backgroundColor: value }}></span>
      <small className="text-muted">{label}</small>
    </div>
  );
}

function AccountInformationPage() {
  const [savedProfile, setSavedProfile] = useState(coupleProfile);
  const [draftProfile, setDraftProfile] = useState(coupleProfile);
  const [editing, setEditing] = useState(false);

  const changeDraft = (event) => {
    const { name, value } = event.target;
    setDraftProfile((current) => ({ ...current, [name]: value }));
  };

  const saveDraft = () => {
    setSavedProfile(draftProfile);
    setEditing(false);
  };

  const cancelDraft = () => {
    setDraftProfile(savedProfile);
    setEditing(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">User Information</h3>
        {!editing && <button type="button" className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>Edit</button>}
      </div>
      <div className="card custom-card">
        <div className="card-body">
          <div className="d-flex align-items-center mb-4">
            <div className="avatar-alias size-avatar-xmedium avatar-center mr-3">
              <span className="avatar-initials">{savedProfile.fullName.charAt(0)}{savedProfile.partnerName.charAt(0)}</span>
            </div>
            <div>
              <h5 className="mb-1">{savedProfile.fullName} & {savedProfile.partnerName}</h5>
              <small className="text-muted">{savedProfile.email}</small>
            </div>
          </div>
          <form>
            <div className="row">
              <ProfileField label="Name and surname" name="fullName" value={draftProfile.fullName} editing={editing} onChange={changeDraft} />
              <ProfileField label="Partner name" name="partnerName" value={draftProfile.partnerName} editing={editing} onChange={changeDraft} />
              <ProfileField label="Email" name="email" value={draftProfile.email} type="email" editing={editing} onChange={changeDraft} />
              <ProfileField label="Phone" name="phone" value={draftProfile.phone} editing={editing} onChange={changeDraft} />
            </div>
            <hr />
            <h5 className="mb-3">Wedding Details</h5>
            <div className="row">
              <ProfileField label="Wedding date" name="weddingDateValue" value={draftProfile.weddingDateValue} type="date" editing={editing} onChange={changeDraft} />
              <ProfileField label="Wedding location" name="weddingLocation" value={draftProfile.weddingLocation} editing={editing} onChange={changeDraft} />
              <ProfileField label="Venue" name="venueName" value={draftProfile.venueName} editing={editing} onChange={changeDraft} />
              <ProfileField label="Wedding start time" name="weddingStartTime" value={draftProfile.weddingStartTime} type="time" editing={editing} onChange={changeDraft} />
              <ProfileField label="Wedding end time" name="weddingEndTime" value={draftProfile.weddingEndTime} type="time" editing={editing} onChange={changeDraft} />
              <ProfileField label="Bride side" name="brideSide" value={draftProfile.brideSide} editing={editing} onChange={changeDraft} />
              <ProfileField label="Groom side" name="groomSide" value={draftProfile.groomSide} editing={editing} onChange={changeDraft} />
            </div>
            <div className="d-flex flex-wrap mt-2">
              <ColourSwatch label="Primary colour" value={draftProfile.primaryColour} />
              <ColourSwatch label="Secondary colour" value={draftProfile.secondaryColour} />
            </div>
            {editing && (
              <div className="mt-4">
                <button type="button" className="btn btn-primary btn-sm mr-2" onClick={saveDraft}>Save Changes</button>
                <button type="button" className="btn btn-link btn-sm text-danger" onClick={cancelDraft}>Cancel</button>
              </div>
            )}
          </form>
          <small className="text-muted d-block mt-3">Temporary frontend preview only. Changes are not saved to your real account yet.</small>
        </div>
      </div>
    </div>
  );
}

function AccountPage({ tab }) {
  const activeTab = tab === 'settings' ? 'settings' : tab === 'notifications' ? 'notifications' : 'information';
  return (
    <div className="container spacer"><div className="row"><div className="col-md-3"><AccountSidebar active={activeTab} /></div><div className="col-md-9">{tab === 'notifications' ? <><h3>Notifications</h3><ul className="list-group mt-4">{notifications.map((item) => <li className="list-group-item" key={item}>{item}</li>)}</ul></> : tab === 'settings' ? <><h3>Settings</h3><form className="mt-4"><div className="row"><div className="col-md-6 mb-3"><input className="form-control" placeholder="Name and surname" defaultValue={coupleProfile.fullName} /></div><div className="col-md-6 mb-3"><input className="form-control" placeholder="Partner name" defaultValue={coupleProfile.partnerName} /></div><div className="col-md-6 mb-3"><input className="form-control" type="date" defaultValue={coupleProfile.weddingDateValue} /></div><div className="col-md-6 mb-3"><input className="form-control" placeholder="Wedding location" defaultValue={coupleProfile.weddingLocation} /></div></div><button type="button" className="btn btn-primary btn-sm">Save Changes</button></form></> : <AccountInformationPage />}</div></div></div>
  );
}

function ChecklistPage() {
  return <CoupleChecklistPage />;
}


function GuestListPage() {
  return <CoupleGuestListPage />;
}

function VendorsPage({ search = false }) {
  return <CoupleVendorsPage search={search} />;
}

function SeatingChartPage() {
  return <CoupleSeatingChartPage />;
}

function BudgetPlannerPage({ category = false }) {
  return <CoupleBudgetPlannerPage category={category} />;
}

function DressesPage() {
  return <div className="container wide-tb-50"><ul className="nav nav-pills my-listing-tab justify-content-center nav-fill pt-2 pb-0"><li className="nav-item nav-bottom-link"><a className="nav-link"><img src="/assets/images/dashboard/nav-image-10.png" width="40" height="40" alt="" /><small className="d-block mt-2 fn-bold">Dresses</small></a></li></ul><hr /><div className="row"><div className="col-md-3"><h5 className="text-danger mx-3">Categories</h5><div className="nav flex-column nav-pills budget-tab"><a className="nav-link nav-list-item"><i className="tamilweddingbook_fashion"></i> <span>All</span></a><a className="nav-link nav-list-item"><i className="tamilweddingbook_fashion"></i> <span>Dresses</span></a><a className="nav-link nav-list-item"><i className="tamilweddingbook_fashion"></i> <span>Suits</span></a></div></div><div className="col-md-9"><h3>Bridesmaids Dreseses</h3><div className="custom-card text-center"><img src="/assets/images/dashboard/nav-image-10.png" width="96" height="111" alt="" /><p className="mt-5">You Don't Have Any Wedding Dresses Saved</p><a href="#" className="btn btn-primary btn-sm">Browse wedding dresses</a></div></div></div></div>;
}

function WeddingWebsitePage() {
  return <div className="container wide-tb-50"><div className="row"><div className="col-md-6"><img src="/assets/images/dashboard/wedding_website_photo.png" alt="" /></div><div className="col-md-1"></div><div className="col-md-5 mt-5 text-end"><br /><br /><br /><h2 className="mt-3">Great choice, Kajee Kj! Who are you marrying?</h2><form><div className="row"><div className="col-md-6"><input className=" form-control border-bottom" type="text" placeholder="Your partner’s name" /></div><div className="col-md-6"><input className="border-bottom form-control" type="text" placeholder="Your partner’s name" /></div><div><input className="border-bottom form-control" type="date" placeholder="24/03/2021" /></div></div><a href="#" className="btn rounded-pill btn-danger mt-5">Create My Website</a></form></div></div></div>;
}

function WebShootsPage() {
  return <div className="container wide-tb-50"><div className="row"><div className="col-lg-6 col-sm-6 text-end"><div className="breadcrumb-container"><ul className="breadcrumb bg-white"><li className="breadcrumb-item"><a href="">Weddings</a></li><li className="breadcrumb-item">Bridesmaid Dresses</li><li className="breadcrumb-item">photos</li></ul></div><div className="px-2 py-2 my-2 text-center"><img className="d-block mx-auto mb-4" src="/assets/images/dashboard/webshoot-image-1.png" alt="" width="70" height="70" /><h3 className="display-5 fw-bold">WedShoots</h3><div className="col-lg-6 mx-auto"><small className="d-block ">All your wedding photos in one special album</small><h5 className="lead mb-4 ">Let's begin!</h5><div className="row"><div className="col"><img src="/assets/images/about/app-store.png" alt="" /></div><div className="col"><img src="/assets/images/about/google-play.png" alt="" /></div></div></div></div></div><div className="col-lg-3 col-sm-3"><img src="/assets/images/dashboard/webshoot/webshoot-22.png" alt="" width="100%" height="300" /></div><div className="col-lg-3 col-sm-3"><img src="/assets/images/dashboard/webshoot/webshoot-11.png" alt="" width="100%" height="300" className="of-cover" /></div></div><section className="mt-5"><div className="row">{['Privacy is paramount', 'Your photos in high quality', "Don't chase after photos"].map((title, index) => <div className="col-md-4" key={title}><div className="px-2 py-2 my-2 text-center"><img className="d-block mx-auto mb-4" src={`/assets/images/dashboard/webshoot/webshoot-image-icon-${index + 1}.png`} alt="" width="70" height="70" /><h3 className="display-5 d-block fw-bold">{title}</h3><div className="mx-auto"><small>Keep your wedding photos as private as you like. Manage and change your album settings as needed.</small></div></div></div>)}</div></section></div>;
}

export default function CoupleDashboardPage({ page }) {
  if (page === 'account') return <AccountPage />;
  if (page === 'accountSettings') return <AccountPage tab="settings" />;
  if (page === 'accountNotifications') return <AccountPage tab="notifications" />;
  if (page === 'checklist') return <ChecklistPage />;
  if (page === 'guestList') return <GuestListPage />;
  if (page === 'seatingChart') return <SeatingChartPage />;
  if (page === 'vendors') return <VendorsPage />;
  if (page === 'vendorsSearch') return <VendorsPage search />;
  if (page === 'budgetPlanner') return <BudgetPlannerPage />;
  if (page === 'budgetCategory') return <BudgetPlannerPage category />;
  if (page === 'dresses') return <DressesPage />;
  if (page === 'weddingWebsite') return <WeddingWebsitePage />;
  if (page === 'webShoots') return <WebShootsPage />;
  return <><DashboardBanner /></>;
}