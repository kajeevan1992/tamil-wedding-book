import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import * as coupleService from '@services/CoupleService';
import { toggleLoading } from "@store/AppSlice";
import { loadSuppliers } from "@services/CoupleService";
import SearchVendorModal from "@components/couple/vendor/SearchVendorModal";
import { NavLink } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
import Select from "react-select";
import FilteredVendors from "@components/couple/vendor/FilteredVendors";


function Suppliers() {
    const app = useSelector(state => state.app);
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

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
        resultsFilter: null,
        selectedCategory: [],
        resultsStatus: null,
        statuses: [
            'Not available',
            'Discarded',
            'Evaluating',
            'Preselection',
            'Negotiation',
            'Hired',
        ],
        statusesCount: {
            'Not available': 0,
            'Discarded': 0,
            'Evaluating': 0,
            'Preselection': 0,
            'Negotiation': 0,
            'Hired': 0,
        },

        errors: {}
    });

    const businessCategoryRef = useRef("");
    const statusRef = useRef("");
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

            app.categories.forEach((category) => {
                if (category.type === 'supplier') {
                    let cat = { ...category }
                    cat.suppliers = [];
                    categories.push(cat);
                }
            });

            const statusesCount = state.statusesCount;
            data.suppliers.forEach((supplier) => {
                if (supplier.coupleVendor.category.type === 'venue') {
                    categories[categories.map(category => category.type).indexOf(supplier.coupleVendor.category.type)].suppliers.push(supplier)
                } else {
                    let catIndex = categories.map(category => category.name).indexOf(supplier.coupleVendor.category.name);
                    if (catIndex) {
                        categories[catIndex].suppliers.push(supplier);
                    }
                }
                statusesCount[supplier.status] = statusesCount[supplier.status] + 1;
            });

            setState((currentState) => ({
                ...currentState,
                categories: categories,
                statusesCount: statusesCount,
                supplier: {
                    ...currentState.supplier,
                    coupleId: coupleId
                },
                resultsFilter: searchParams.get('category') ? searchParams.get('category') : 'all',
            }));

            console.log(state.statusesCount)
            console.log(statusesCount)

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
        let filter = 'all';
        if (supplier.coupleVendor.category.type === 'venue') {
            categories[categories.map(category => category.type).indexOf(supplier.coupleVendor.category.type)].suppliers.unshift(supplier);
            filter = 'venue';
        } else {
            let catIndex = categories.map(category => category.name).indexOf(supplier.coupleVendor.category.name);
            if (catIndex) {
                categories[catIndex].suppliers.unshift(supplier);
                filter = supplier.coupleVendor.category.slug;
            }
        }

        setState((currentState) => ({
            ...currentState,
            categories: categories,
            resultsFilter: filter
        }));
    }

    const removeVendor = (vendorId) => {
        let selectedCategory = state.selectedCategory;
        selectedCategory = selectedCategory.filter((category) => {
            return category.id !== vendorId;
        });

        setState((currentState) => ({
            ...currentState,
            selectedCategory: selectedCategory,
        }));
    }

    useEffect(() => {
        let selectedCategory = [];
        if (state.resultsFilter && state.resultsFilter !== 'all') {
            if (state.resultsFilter === 'venue') {
                selectedCategory = state.categories[state.categories.map(category => category.type).indexOf(state.resultsFilter)].suppliers;
            } else {
                let catIndex = state.categories.map(category => category.slug).indexOf(state.resultsFilter);
                if (catIndex >= 0) {
                    selectedCategory = state.categories[catIndex].suppliers;
                } else {
                    state.categories.map((category) => {
                        category.suppliers.map((supplier) => {
                            selectedCategory.push(supplier);
                        });
                    });
                }
            }
        } else if (state.resultsFilter === 'all') {
            state.categories.map((category) => {
                category.suppliers.map((supplier) => {
                    selectedCategory.push(supplier);
                });
            });
        }

        if (selectedCategory.length > 0) {
            if (state.resultsStatus) {
                selectedCategory = selectedCategory.filter((sCategory) => {
                    return sCategory.status === state.resultsStatus;
                });
            }
        }

        setState((currentState) => ({
            ...currentState,
            selectedCategory: selectedCategory,
        }));
    }, [state.resultsFilter, state.resultsStatus]);

    const changeFilter = (filter) => {
        setState((currentState) => ({
            ...currentState,
            resultsFilter: filter
        }));
    }

    const changeStatusFilter = (status) => {
        setState((currentState) => ({
            ...currentState,
            resultsStatus: status
        }));
    }

    return (
        <>
            <div className="container spacer">
                <div className="row">
                    <div className="col-md-3 mb-3">
                        <div className="">
                            <NavLink
                                to="/couple/vendors"
                                end
                                className="nav-link text-muted px-0"
                            >
                                <i className="bi bi-arrow-left text-danger"></i>&nbsp;
                                <span> Return</span>
                            </NavLink>
                            <h5 className="mt-3">Filters</h5>
                            {/* <div className="d-flex">
                                {state.resultsFilter && state.resultsFilter !=='all' &&
                                    <button type="button" onClick={() => changeFilter('all')} className="btn btn-sm rounded-pill bg-white mb-1">
                                        <span className="text-muted">{state.resultsFilter === 'venue' ? 'Wedding Venues' : state.resultsFilter.replaceAll('-', ' ')}</span>
                                        <i className="bi bi-x-lg ml-1"></i>
                                    </button>}
                            </div>
                            <div className="d-flex">
                                {state.resultsStatus &&
                                    <button type="button" onClick={() => changeStatusFilter(null)} className="btn btn-sm rounded-pill bg-white mb-1">
                                        <span className="text-muted">{state.resultsStatus}</span>
                                        <i className="bi bi-x-lg ml-1"></i>
                                    </button>}
                            </div> */}
                            <hr />
                            {/*<h5>By Category</h5>
                             {state.categories.map((category, key) => {
                                return (
                                    <div className="d-flex justify-content-between mt-2" key={`categories-filter-${key}`}>
                                        <a onClick={() => changeFilter(category.slug)} className={`mb-2 
                                        ${state.resultsFilter === category.name ? 'active-filter' : ''}`
                                        }>{category.name}</a>
                                        <span className="fn-grey">{category.suppliers.length}</span>
                                    </div>
                                );
                            })} */}
                            <Select
                                ref={businessCategoryRef}
                                className="select-theme-border zi-1000 filter"
                                isClearable={true}
                                isSearchable={true}
                                placeholder="By Category"
                                // defaultValue={state.resultsFilter}
                                value={state.categories.filter(function (category) {
                                    return category.slug === state.resultsFilter;
                                })}
                                formatOptionLabel={function (option) {
                                    return (
                                        <div className="d-flex justify-content-between">
                                            <div>{option.name}</div>
                                            {option.suppliers?.length > 0 && <div className="badge badge-warning rounded-20px">
                                                {option.suppliers?.length}
                                            </div>}
                                        </div>
                                    );
                                }}
                                getOptionValue={(option) => option.slug}
                                onChange={(option) => changeFilter(option !== null ? option.slug : 'all')}
                                options={state.categories}
                            />
                            <br />
                            <Select
                                ref={statusRef}
                                className="select-theme-border filter"
                                isClearable={true}
                                isSearchable={true}
                                placeholder="By Status"
                                defaultValue={state.resultsStatus}
                                // getOptionLabel={(option) => option.label}
                                formatOptionLabel={function (option) {
                                    return (
                                        <div className="d-flex justify-content-between">
                                            <div>{option.label}</div>
                                            {state.statusesCount[option.name] > 0 && <div className="badge badge-warning rounded-20px">
                                                {state.statusesCount[option.name]}
                                            </div>}
                                        </div>
                                    );
                                }}
                                getOptionValue={(option) => option.name}
                                onChange={(option) => changeStatusFilter(option?.name)}
                                options={state.statuses.map((opt) => ({ label: opt, name: opt }))}
                            />
                            {/* <hr />
                            <h5>By Status</h5>
                            {state.statuses.map((status, keyStatus) => {
                                return (
                                    <div className="d-flex justify-content-between mt-2" key={`status-filter-${keyStatus}`}>
                                        <a onClick={() => changeStatusFilter(status)} className={`mb-2 
                                        ${state.resultsStatus === status ? 'active-filter' : ''}`
                                        }>{status}</a>
                                    </div>
                                );
                            })} */}
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="mt-1">
                                <div className="d-flex">
                                    <h3 className="mb-0 fw-600 text-capitalize">{state.resultsFilter ? state.resultsFilter === 'venue' ? 'Wedding Venues' : state.resultsFilter.replaceAll('-', ' ') : 'All'}</h3>
                                    <p className="text-muted ml-2 mb-0">{state.selectedCategory.length} Vendors</p>
                                </div>
                            </div>
                            <div className="mt-1">
                                <button type="button" onClick={showSearchVendorModal} className="btn btn-sm btn-danger float-right">
                                    <i className="bi bi-plus-lg"></i> Add Vendor
                                </button>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <FilteredVendors
                                app={app}
                                selectedCategory={state.selectedCategory}
                                onRemoveVendor={removeVendor}
                                statuses={state.statuses}
                            />
                        </div>
                    </div>
                </div>
                <SearchVendorModal
                    app={app}
                    ref={supplierSearchModal}
                    onHideModal={hideSearchVendorModal}
                    onVendorAdded={(vendor) => addVendor(vendor)}
                />
            </div>
        </>
    );
}

export default Suppliers;