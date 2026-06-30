import { Rating } from "react-simple-star-rating";

export default function PreferredVendors(props) {
    return (
        <>
            <section className="col-md-12">
                <div className="page-title d-flex justify-content-between align-items-center">
                    <h2>Preferred {props.app.profile.role == 'venue' ? 'Suppliers' : 'Venues'} ({props.preferredVendors.length})</h2>
                    <button type="button" className="btn btn-primary btn-sm" onClick={props.onShowModal}>Add {props.app.profile.role == 'venue' ? 'Supplier' : 'Venue'}</button>
                </div>
            </section>
            {props.preferredVendors.length < 1 && <section className='col-md-12'>
                <div className="card mt-2">
                    <div className="card-body d-flex grey-bg align-items-center">
                        <i className="bi bi-arrow-repeat fs-3rem mr-3 align-items-center "></i>
                        <div>
                            <strong>Add wedding professionals you frequently work with and recommend to couples.</strong>
                            <p className="mb-0">Your Preferred Suppliers will be displayed on your storefront.</p>
                        </div>
                    </div>
                </div>
            </section>}
            <section className="col-md-12 mt-3">
                <div className="row">
                    {props.preferredVendors.map((vendor, key) => <div className="col-md-4 mb-4" key={`preferred-vendor-key${key}`}>
                        <div className="card">
                            <div className="card-body position-relative p-0">
                                <div className="card-tr-action-buttons w-25px">
                                    <button type="button" onClick={() => props.onDelete(vendor)} className="btn btn-sm btn-outline-primary p-2 mb-1">
                                        <span className="bi bi-trash"></span>
                                    </button>
                                </div>
                                <p className={`badge ${vendor.status ? 'badge-success' : 'badge-warning'} card-tl-status text-white text-uppercase`}>{vendor.status ? 'Active' : 'Pending'}</p>
                                {/* todo maybe display caresoule and bring all images */}
                                <img src={`${vendor?.preferredVendor?.user?.photo ? props.app.serverPath + vendor.preferredVendor.user.photo : '/assets/images/supplier-card-bg.png'}`} className="block app-tools-main-front-img dash-img border-bottom border-secondary " alt="Deal Image" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                <div className="p-3 text-center">
                                    <h5 className="mb-1" style={{ fontSize: '1.1rem' }}>{vendor.preferredVendor.user.fullName}</h5>
                                    <Rating
                                        initialValue={4.5}
                                        readonly={true}
                                        size={12}
                                        allowFraction={true}
                                    />
                                    <p className=" text-muted mb-1" style={{ fontSize: '0.9rem' }}>{vendor.preferredVendor.user.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>)}
                </div>
            </section>
        </>
    );
}