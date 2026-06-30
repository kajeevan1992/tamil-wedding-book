import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import * as coupleService from '@services/CoupleService';
import { toggleLoading } from "@store/AppSlice";
import { loadSuppliers } from "@services/CoupleService";
import SearchVendorModal from "@components/couple/vendor/SearchVendorModal";
import { NavLink } from "react-router-dom";

function Vendors() {
    const app = useSelector(state => state.app);
    const dispatch = useDispatch();

    useEffect(() => {
        if (app.profile && app.profile.couple && app.categories.length) {
            init(app.profile.couple.id);
        }
    }, [app.profile, app.categories]);

    const [state, setState] = useState({
        categories: [],
        supplier: {
            coupleId: '',
            vendorId: '',
        },
        saved: 0,
        hired: 0,

        errors: {}
    });

    async function init(coupleId) {
        try {
            dispatch(toggleLoading(true));
            const { data } = await loadSuppliers(coupleId);

            const categories = [];
            categories.push({
                name: "Wedding Venues",
                slug: "venue",
                type: "venue",
                icon: "bi bi-house",
                suppliers: []
            });

            app.categories.map((category) => {
                if (category.type === 'supplier') {
                    let cat = { ...category }
                    cat.suppliers = [];
                    categories.push(cat);
                }
            });

            let saved = 0, hired = 0;
            data.suppliers.map((supplier) => {
                if (supplier.coupleVendor.category.type === 'venue') {
                    categories[categories.map(category => category.type).indexOf(supplier.coupleVendor.category.type)].suppliers.push(supplier)
                } else {
                    let catIndex = categories.map(category => category.name).indexOf(supplier.coupleVendor.category.name);
                    if (catIndex) {
                        categories[catIndex].suppliers.push(supplier);
                    }
                }

                saved++;
                if (supplier.status === 'Hired') {
                    hired++;
                }
            });

            setState((currentState) => ({
                ...currentState,
                categories: categories,
                supplier: {
                    ...currentState.supplier,
                    coupleId: coupleId
                },
                saved: saved,
                hired: hired,
            }));

            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
        }
    }

    const supplierSearchModal = useRef(null);
    const showSearchVendorModal = (action, deal = {}) => {
        supplierSearchModal.current.showModal(action, deal);
    }
    const hideSearchVendorModal = () => {
        supplierSearchModal.current.hideModal();
    }
    const addVendor = (supplier) => {
        const categories = state.categories;

        if (supplier.coupleVendor.category.type === 'venue') {
            categories[categories.map(category => category.type).indexOf(supplier.coupleVendor.category.type)].suppliers.unshift(supplier)
        } else {
            let catIndex = categories.map(category => category.name).indexOf(supplier.coupleVendor.category.name);
            if (catIndex) {
                categories[catIndex].suppliers.unshift(supplier);
            }
        }

        setState((currentState) => ({
            ...currentState,
            categories: categories,
        }));
    }

    function CoverImage(props) {
        const coverImage = props.suppliers[Math.floor(Math.random() * props.suppliers.length)].coupleVendor?.user?.photo;
        if (coverImage) {
            return (<img className="card-img-top h-170-fit" src={`${app.serverPath + coverImage}`}
                alt="Vendor Image" />);
        } else {
            return (<img className="card-img-top h-170-fit" src="/assets/images/placeholder.png"
                alt="Vendor Image" />);
        }
    }

    return (
        <>
            <div>
                <div className="container spacer">
                    <div className="row">
                        <div className="col-md-12">
                            <h3 className="mb-3 fw-600">My Suppliers</h3>
                        </div>
                        <div className="col-md-12 d-flex justify-content-between align-items-center">
                            <div className="mt-1">
                                <h5 className="text-muted">0 out of {state.categories.length} hired</h5>
                                <div className="progress mt-1">
                                    <div className="progress-bar" role="progressbar" style={{ width: ``, backgroundColor: '#eb2327' }}
                                        aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                    </div>
                                </div>
                            </div>
                            <div className="mt-1 jobathy">
                                <button className="btn btn-sm border border-radius-right-0">
                                    <i className="bi bi-heart-fill text-danger"></i>
                                    <span className="ml-1">Saved</span>
                                    <small className="font-grey ml-1">{state.saved}</small>
                                </button>
                                <button className="btn btn-sm border border-radius-left-none">
                                    <i className="bi bi-check2-all"></i>
                                    <span className="ml-1">Hired</span>
                                    <small className="font-grey ml-1">{state.hired}</small>
                                </button>
                            </div>
                            <div className="mt-1">
                                <button type="button" onClick={showSearchVendorModal} className="btn btn-sm btn-danger float-right">
                                    <i className="bi bi-plus-lg"></i> Add Vendor
                                </button>
                            </div>
                        </div>

                        <div className="container mt-5">
                            <div className="row">
                                {state.categories.map((category, key) => {
                                    return (
                                        <div className="col-lg-3 text-center mb-4" key={`main-category-${key}`}>
                                            <div className="card img-fluid w-h-100 h-170px">
                                                {category.suppliers.length > 0 && <CoverImage suppliers={category.suppliers} />}

                                                <div className="card-img-overlay">
                                                    <div className="mb-2 mt-2">
                                                        <i className={`${category.icon ? category.icon : 'bi bi-briefcase'} text-light f-size`}></i>
                                                    </div>
                                                    <p className="text-light fs-12px">{category.name}</p>
                                                    <NavLink to={`/couple/vendors/search?category=${category.slug}`} className="btn btn-secondary btn-sm">
                                                        {category.suppliers.length > 0 ? (<div>
                                                            <i
                                                                className="bi bi-heart-fill own-icon vertical-mid text-danger"></i> <span>{category.suppliers.length}</span>
                                                        </div>) : (<div>
                                                            <i
                                                                className="bi bi-search own-icon vertical-mid text-danger"></i> <span>Search</span>
                                                        </div>)}
                                                    </NavLink>
                                                </div>
                                            </div>
                                        </div>);
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <SearchVendorModal ref={supplierSearchModal} onHideModal={hideSearchVendorModal} app={app} onVendorAdded={(vendor) => addVendor(vendor)} />
            </div>
        </>
    );
}

export default Vendors;