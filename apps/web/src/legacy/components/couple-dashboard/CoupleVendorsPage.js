'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { coupleVendorFallbackData } from '../../data/coupleDashboardData';

const statuses = [
  'Not available',
  'Discarded',
  'Evaluating',
  'Preselection',
  'Negotiation',
  'Hired',
];

function VendorCoverImage({ suppliers }) {
  const coverImage = suppliers.find((supplier) => supplier.coupleVendor?.user?.photo)?.coupleVendor?.user?.photo;
  return <img className="card-img-top h-170-fit" src={coverImage || '/assets/images/placeholder.png'} alt="Vendor Image" />;
}

function VendorCategoryCard({ category }) {
  return (
    <div className="col-lg-3 text-center mb-4">
      <div className="card img-fluid w-h-100 h-170px">
        {category.suppliers.length > 0 && <VendorCoverImage suppliers={category.suppliers} />}
        <div className="card-img-overlay">
          <div className="mb-2 mt-2">
            <i className={`${category.icon ? category.icon : 'bi bi-briefcase'} text-light f-size`}></i>
          </div>
          <p className="text-light fs-12px">{category.name}</p>
          <Link href={`/couple/vendors/search?category=${category.slug}`} className="btn btn-secondary btn-sm">
            {category.suppliers.length > 0 ? (
              <div><i className="bi bi-heart-fill own-icon vertical-mid text-danger"></i> <span>{category.suppliers.length}</span></div>
            ) : (
              <div><i className="bi bi-search own-icon vertical-mid text-danger"></i> <span>Search</span></div>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}

function AddVendorModal({ visible, vendors, savedVendorIds, onAddVendor, onClose }) {
  const [keyword, setKeyword] = useState('');
  const results = vendors.filter((vendor) => `${vendor.fullName} ${vendor.address} ${vendor.category.name}`.toLowerCase().includes(keyword.toLowerCase()));

  if (!visible) return null;

  return (
    <div className="modal d-block" id="searchVendorModal" tabIndex="-1" aria-labelledby="searchVendorModal" style={{ backgroundColor: 'rgba(0,0,0,.35)' }}>
      <div className="modal-dialog couple-dashboard-step-modal">
        <div className="modal-content">
          <div className="modal-header fs-16px">
            <div className="modal-title">Add New Vendor</div>
            <button className="btn p-0" onClick={onClose} type="button"><span className="bi bi-x-lg"></span></button>
          </div>
          <div className="modal-body w-100">
            <div className="row mr-0 ml-0 w-100">
              <div className="col-12 w-100">
                <div className="row pb-3">
                  <div className="col-10">
                    <div className="mb-3">
                      <input className="form-control" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Search vendor..." />
                    </div>
                  </div>
                  <div className="col-2">
                    <div className="input-group-append">
                      <button type="button" className="btn btn-primary btn-sm" id="basic-addon2" disabled>Add</button>
                    </div>
                  </div>
                </div>
                <div className="list-group">
                  {results.map((vendor) => {
                    const saved = savedVendorIds.includes(vendor.vendor.id);
                    return (
                      <button type="button" className="list-group-item list-group-item-action" key={vendor.vendor.id} onClick={() => !saved && onAddVendor(vendor)} disabled={saved}>
                        <div className="d-flex justify-content-between">
                          <div>{vendor.fullName}</div>
                          <small className="badge badge-warning" style={{ height: 16 }}>{vendor.category.name}</small>
                        </div>
                        <small>{vendor.address}</small>
                        {saved && <small className="d-block text-danger">Already saved</small>}
                      </button>
                    );
                  })}
                  {results.length === 0 && <div className="text-muted small">No vendors found.</div>}
                </div>
              </div>
            </div>
            <div className="mt-3 text-right">
              <button type="button" className="btn btn-link text-danger p-0">Create and invite vendor</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilteredVendorCard({ supplier, statuses: statusOptions, onChangeStatus, onRemoveVendor, onToggleBody }) {
  const vendor = supplier.coupleVendor;
  const user = vendor.user;
  const active = supplier.activeTab;

  return (
    <div className="col-md-4 mb-3">
      <div className="card img-fluid w-h-100 position-relative">
        <button onClick={() => onRemoveVendor(supplier.id)} className="btn btn-primary px-2 py-0 abs-r-10-t-10 z-1" type="button">
          <i className="bi bi-x-lg"></i>
        </button>
        <img className="card-img-top card-cat-img" src={user.photo || '/assets/images/placeholder.png'} alt="Vendor Image" />
        <div className="card-img-overlay d-flex flex-column justify-content-end text-left p-2">
          <div><small className="badge badge-warning">{vendor.category.name}</small></div>
          <strong className="text-light block mt-1">{user.fullName}</strong>
          <small className="text-light block"><i className="bi bi-geo-alt"></i> {user.address}</small>
        </div>
      </div>
      <div className="card border-top-0 rounded-0">
        <div className="card-body p-2">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted"><i className="bi bi-star-fill text-warning"></i> {vendor.rating} ({vendor.reviews} reviews)</small>
            <select className="form-select form-select-sm w-auto" value={supplier.status} onChange={(event) => onChangeStatus(supplier.id, event.target.value)}>
              {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
          {active === 'note' && <div className="text-left mb-2"><textarea className="form-control" rows="3" value={supplier.note} onChange={(event) => onToggleBody(supplier.id, 'note', event.target.value)} placeholder="Add Note"></textarea></div>}
          {active === 'tel' && <div className="text-left mb-2"><small><i className="bi bi-telephone"></i> {user.mobile}</small><br /><small><i className="bi bi-envelope"></i> {user.email}</small></div>}
          <div className="d-flex justify-content-between">
            <button type="button" onClick={() => onToggleBody(supplier.id, active === 'note' ? '' : 'note')} className="btn btn-sm p-0"><span className="bi bi-clipboard-plus"></span> Add Note</button>
            <button type="button" onClick={() => onToggleBody(supplier.id, active === 'tel' ? '' : 'tel')} className="btn btn-sm p-0"><span className="bi bi-telephone"></span> {active === 'tel' ? 'Hide' : 'Show Tel.'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function makeSupplierFromVendor(vendor, nextId) {
  return {
    id: nextId,
    status: 'Evaluating',
    note: '',
    activeTab: '',
    coupleVendor: {
      id: vendor.vendor.id,
      category: vendor.category,
      rating: vendor.rating,
      reviews: vendor.reviews,
      user: {
        fullName: vendor.fullName,
        address: vendor.address,
        photo: vendor.photo,
        mobile: vendor.mobile,
        email: vendor.email,
      },
    },
  };
}

export default function CoupleVendorsPage({ search = false }) {
  const [categories] = useState(coupleVendorFallbackData.categories);
  const [availableVendors] = useState(coupleVendorFallbackData.availableVendors);
  const [suppliers, setSuppliers] = useState(coupleVendorFallbackData.suppliers);
  const [categoryFilter, setCategoryFilter] = useState(() => {
    if (typeof window === 'undefined') return 'all';
    return new URLSearchParams(window.location.search).get('category') || 'all';
  });
  const [statusFilter, setStatusFilter] = useState('');
  const [keyword, setKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const categoriesWithSuppliers = useMemo(() => categories.map((category) => ({
    ...category,
    suppliers: suppliers.filter((supplier) => supplier.coupleVendor.category.slug === category.slug || supplier.coupleVendor.category.type === category.type),
  })), [categories, suppliers]);

  const saved = suppliers.length;
  const hired = suppliers.filter((supplier) => supplier.status === 'Hired').length;
  const savedVendorIds = suppliers.map((supplier) => supplier.coupleVendor.id);
  const statusCounts = statuses.reduce((acc, status) => ({ ...acc, [status]: suppliers.filter((supplier) => supplier.status === status).length }), {});

  const selectedSuppliers = suppliers.filter((supplier) => {
    const categoryMatch = categoryFilter === 'all' || supplier.coupleVendor.category.slug === categoryFilter || supplier.coupleVendor.category.type === categoryFilter;
    const statusMatch = !statusFilter || supplier.status === statusFilter;
    const keywordMatch = !keyword || `${supplier.coupleVendor.user.fullName} ${supplier.coupleVendor.user.address} ${supplier.coupleVendor.category.name}`.toLowerCase().includes(keyword.toLowerCase());
    return categoryMatch && statusMatch && keywordMatch;
  });

  const addVendor = (vendor) => {
    if (savedVendorIds.includes(vendor.vendor.id)) return;
    setSuppliers((current) => [makeSupplierFromVendor(vendor, Math.max(0, ...current.map((item) => item.id)) + 1), ...current]);
    setCategoryFilter(vendor.category.slug);
    setModalVisible(false);
  };
  const removeVendor = (supplierId) => setSuppliers((current) => current.filter((supplier) => supplier.id !== supplierId));
  const changeStatus = (supplierId, status) => setSuppliers((current) => current.map((supplier) => supplier.id === supplierId ? { ...supplier, status } : supplier));
  const toggleCardBody = (supplierId, activeTab, noteValue) => setSuppliers((current) => current.map((supplier) => {
    if (supplier.id !== supplierId) return { ...supplier, activeTab: supplier.activeTab === activeTab ? '' : supplier.activeTab };
    if (noteValue !== undefined) return { ...supplier, note: noteValue, activeTab };
    return { ...supplier, activeTab };
  }));

  if (!search) {
    return (
      <div>
        <div className="container spacer">
          <div className="row">
            <div className="col-md-12"><h3 className="mb-3 fw-600">My Suppliers</h3></div>
            <div className="col-md-12 d-flex justify-content-between align-items-center">
              <div className="mt-1">
                <h5 className="text-muted">{hired} out of {categories.length} hired</h5>
                <div className="progress mt-1"><div className="progress-bar" role="progressbar" style={{ width: `${categories.length ? (hired / categories.length) * 100 : 0}%`, backgroundColor: '#eb2327' }} aria-valuenow={hired} aria-valuemin="0" aria-valuemax={categories.length}></div></div>
              </div>
              <div className="mt-1 jobathy">
                <button className="btn btn-sm border border-radius-right-0" type="button"><i className="bi bi-heart-fill text-danger"></i><span className="ml-1">Saved</span><small className="font-grey ml-1">{saved}</small></button>
                <button className="btn btn-sm border border-radius-left-none" type="button"><i className="bi bi-check2-all"></i><span className="ml-1">Hired</span><small className="font-grey ml-1">{hired}</small></button>
              </div>
              <div className="mt-1"><button type="button" onClick={() => setModalVisible(true)} className="btn btn-sm btn-danger float-right"><i className="bi bi-plus-lg"></i> Add Vendor</button></div>
            </div>
            <div className="container mt-5"><div className="row">{categoriesWithSuppliers.map((category) => <VendorCategoryCard category={category} key={category.slug} />)}</div></div>
          </div>
        </div>
        <AddVendorModal visible={modalVisible} vendors={availableVendors} savedVendorIds={savedVendorIds} onAddVendor={addVendor} onClose={() => setModalVisible(false)} />
      </div>
    );
  }

  const activeCategory = categories.find((category) => category.slug === categoryFilter || category.type === categoryFilter);
  return (
    <div className="container spacer">
      <div className="row">
        <div className="col-md-3 mb-3">
          <div>
            <Link href="/couple/vendors" className="nav-link text-muted px-0"><i className="bi bi-arrow-left text-danger"></i>&nbsp;<span> Return</span></Link>
            <h5 className="mt-3">Filters</h5>
            <hr />
            <select className="form-select select-theme-border zi-1000 filter" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="all">By Category</option>
              {categoriesWithSuppliers.map((category) => <option key={category.slug} value={category.slug}>{category.name} ({category.suppliers.length})</option>)}
            </select>
            <br />
            <select className="form-select select-theme-border filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="">By Status</option>
              {statuses.map((status) => <option key={status} value={status}>{status} ({statusCounts[status] || 0})</option>)}
            </select>
            <hr />
            <input className="form-control" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Search supplier..." />
          </div>
        </div>
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center">
            <div className="mt-1"><div className="d-flex"><h3 className="mb-0 fw-600 text-capitalize">{activeCategory ? activeCategory.name : 'All'}</h3><p className="text-muted ml-2 mb-0">{selectedSuppliers.length} Vendors</p></div></div>
            <div className="mt-1"><button type="button" onClick={() => setModalVisible(true)} className="btn btn-sm btn-danger float-right"><i className="bi bi-plus-lg"></i> Add Vendor</button></div>
          </div>
          <hr />
          <div className="row">
            {selectedSuppliers.map((supplier) => <FilteredVendorCard key={supplier.id} supplier={supplier} statuses={statuses} onChangeStatus={changeStatus} onRemoveVendor={removeVendor} onToggleBody={toggleCardBody} />)}
            {selectedSuppliers.length === 0 && <div className="col-12"><div className="card"><div className="card-body text-center text-muted">No vendors found for this filter.</div></div></div>}
          </div>
        </div>
      </div>
      <AddVendorModal visible={modalVisible} vendors={availableVendors} savedVendorIds={savedVendorIds} onAddVendor={addVendor} onClose={() => setModalVisible(false)} />
    </div>
  );
}
