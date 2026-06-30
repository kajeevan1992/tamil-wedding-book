import { useSelector } from "react-redux";
import GlobalSearch from "@components/pages/GlobalSearch";
import { useEffect, useState, useRef } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { filterVendors } from "@services/UserService";
import { useDispatch } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import { toast } from "react-hot-toast";
import { decryptUrl } from "@utilities/CommonUtil";

function SearchVendor() {
    const app = useSelector(state => state.app);
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [vendors, setVendors] = useState([]);
    const [filters, setFilters] = useState({
        categoryId: '',
        name: '',
        lng: '',
        lat: '',
        location: ''
    });
    const [filtersReady, setFiltersReady] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 9;

    useEffect(() => {
        const encryptedParams = searchParams.get('q');
        if (encryptedParams) {
            try {
                const decryptedParams = decryptUrl(encryptedParams);
                setFilters({
                    ...decryptedParams,
                    location: decryptedParams.location || ''
                });
            } catch (error) {
                toast.error('Invalid search parameters');
            }
        }
        setFiltersReady(true);
    }, [searchParams]);

    useEffect(() => {
        if (filtersReady) {
            tryFilterVendors(filters, currentPage);
        }
        // eslint-disable-next-line
    }, [filters, filtersReady, currentPage]);

    const tryFilterVendors = async (params, page = 1) => {
        try {
            dispatch(toggleLoading(true));
            const { data } = await filterVendors({ ...params, page, limit });
            setVendors(data.vendors || []);
            setTotalPages(data.totalPages || 1);
            setCurrentPage(data.currentPage || 1);
            setTotalCount(data.totalCount || 0);
            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
            toast.error('Failed to fetch vendors. Please try again.');
            console.error('Error fetching vendors:', error);
        }
    };

    const handleSearch = (searchData) => {
        setCurrentPage(1); // Reset to first page on new search
        setFilters({
            ...searchData,
            location: searchData.location || filters.location
        });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Pagination rendering logic
    const renderPagination = () => {
        if (totalPages <= 1) return null;
        const pages = [];
        // Always show first page
        if (currentPage > 3) {
            pages.push(1);
            if (currentPage > 4) pages.push('dots-start');
        }
        // Show currentPage-1, currentPage, currentPage+1
        for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
            pages.push(i);
        }
        // Always show last page
        if (currentPage < totalPages - 2) {
            if (currentPage < totalPages - 3) pages.push('dots-end');
            pages.push(totalPages);
        }
        return (
            <ul className="pagination justify-content-center my-4">
                {pages.map((page, idx) => {
                    if (page === 'dots-start' || page === 'dots-end') {
                        return <li key={page + idx} className="page-item disabled"><span className="page-link">...</span></li>;
                    }
                    return (
                        <li key={page} className={`page-item${page === currentPage ? ' active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <>
            <div className="search-vendor-bg">
                {filters.categoryId ? <div className="mb-3 text-center">
                    <h2 className="heading-text">{app.categories.find(category => category.id === filters.categoryId)?.name} {filters.location ? 'in' : ''} {filters.location}</h2>
                </div> : <div className="mb-3 text-center">
                    <h2 className="heading-text">Search Results</h2>
                </div>}
                <GlobalSearch
                    app={app}
                    filter={filters}
                    onSearch={handleSearch}
                />
            </div>
            <section className="search-vendor-filters-bg">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="result-count px-0">
                                <button className="btn btn-outline-primary btn-sm" data-toggle="modal" data-target="#exampleModal4">
                                    <i className="fa fa-sliders"></i> Filters
                                </button>
                                <span className="ml-3">{totalCount} results</span>
                                <ul className="nav nav-pills theme-tabbing list-style-map" id="pills-tab" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link " id="pills-images-tab" data-toggle="pill" href="#pills-images"
                                            role="tab" aria-controls="pills-images" aria-selected="true">
                                            <i className="fa fa-th-large"></i> List
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="pills-map-tab" data-toggle="pill" href="#pills-map"
                                            role="tab" aria-controls="pills-map" aria-selected="false">
                                            <i className="fa fa-map-marker"></i> Map
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className="container mt-4">
                    <div className="row">
                        {vendors.map((vendor, index) => (
                            <div className="col-md-4 mb-4" key={index}>
                                <div className="wedding-listing">
                                    <div className="img relative">
                                        <NavLink to={`/vendor-detail/${vendor.id}`}>
                                            {vendor.photo ? <img src={`${app.serverPath + vendor.photo}`} alt={vendor.fullName} className="card-image" /> : <img src="/assets/images/placeholder.png" alt={vendor.fullName} className="card-image" />}
                                        </NavLink>
                                        <span className="badge badge-danger abs-tl-10px">
                                            {vendor?.category?.name || 'Premium'}
                                        </span>
                                    </div>
                                    <div className="content rounded">
                                        <NavLink to={`/vendor-detail/${vendor.id}`}>
                                            <h6 className="text-center text-white bg-info no-hover">{vendor?.vendor?.category?.name?.toUpperCase() || 'VENUE CATEGORY'}</h6>
                                            <h5 className="text-center">
                                                {vendor.fullName}<span className="verified"></span>
                                            </h5>
                                            <div className="text-center">
                                                <small>{vendor.address}</small>
                                            </div>
                                            <div className="d-flex justify-content-around align-items-center mt-2">
                                                <small>
                                                    From &nbsp; <span className="fw-7">${vendor.price || '2,500'}</span>
                                                </small>
                                                <small>
                                                    <span className="stars">
                                                        <i className="fa fa-star fn-orange ls-1px">
                                                            <span className="own-text own-family">{vendor.rating || '5.0'}</span>
                                                        </i>
                                                    </span>
                                                    <small>({vendor.reviews || '25'})</small>
                                                </small>
                                            </div>
                                        </NavLink>
                                        <div>
                                            <div className="row">
                                                <div className="col-12 d-flex justify-content-center">
                                                    <span className="order-lg-last d-inline-flex mb-3">
                                                        <a
                                                            className="btn btn-primary own-button"
                                                            href="#"
                                                            role="button"
                                                            data-toggle="modal"
                                                            data-target="#login_form"
                                                        >
                                                            Request Pricing
                                                        </a>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {renderPagination()}
                </div>
            </section>

            <div className="modal right fade" id="exampleModal4" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel4"
                aria-hidden="true">
                <div className="modal-dialog modal-dialog-slideout modal-md" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Filter</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <aside className="row sidebar-widgets">
                                <div className="sidebar-primary col-lg-12 col-md-6">
                                    <div className="widget search-result-toggle">
                                        <a data-toggle="collapse" href="#categoriestypes" role="button" aria-expanded="false"
                                            className="link" aria-controls="categoriestypes">
                                            <h3 className="widget-title">Wedding Venues <i className="fa fa-angle-up"></i></h3>
                                        </a>

                                        <div className="collapse show" id="categoriestypes">
                                            <div>
                                                <div className="inner">
                                                    <p>
                                                        <a href="javascript:">
                                                            <strong>All Categories</strong></a>
                                                    </p>

                                                    <ul className="list-unstyled">
                                                        <li>
                                                            <a href="javascript:">Barn & Farm Weddings</a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript:">Hotel Weddings</a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript:">Hotel Weddings</a></li>
                                                        <li><a href="javascript:">Country Club Weddings</a></li>
                                                        <li><a href="javascript:">Restaurant Weddings</a></li>
                                                        <li><a href="javascript:">Rooftop Weddings</a></li>
                                                    </ul>
                                                    <div className="view-all">
                                                        <a href="javascript:" className="btn btn-link-default p-0">+ View
                                                            More</a>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    <div className="widget search-result-toggle">
                                        <a data-toggle="collapse" href="#city" role="button" aria-expanded="false" className="link"
                                            aria-controls="city">
                                            <h3 className="widget-title">Location<i className="fa fa-angle-up"></i></h3>
                                        </a>

                                        <div className="collapse show" id="city">
                                            <div>
                                                <div className="inner">
                                                    <p>
                                                        <input type="text" className="form-control" placeholder="Enter city/town" />
                                                    </p>

                                                    <ul className="list-unstyled">
                                                        <li><a href="javascript:">Buffalo</a></li>
                                                        <li><a href="javascript:">Rochester</a></li>
                                                        <li><a href="javascript:">Canandaigua</a></li>
                                                        <li><a href="javascript:">Geneva</a></li>
                                                        <li><a href="javascript:">Niagara Falls</a></li>
                                                        <li><a href="javascript:">Lockport</a></li>
                                                        <li><a href="javascript:">East Aurora</a></li>
                                                    </ul>
                                                    <div className="view-all">
                                                        <a href="javascript:" className="btn btn-link-default p-0">+ View
                                                            More</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="widget search-result-toggle">
                                        <a data-toggle="collapse" href="#availability" role="button" aria-expanded="false"
                                            className="link" aria-controls="availability">
                                            <h3 className="widget-title">Availability<i className="fa fa-angle-up"></i></h3>
                                        </a>

                                        <div className="collapse show" id="availability">
                                            <div>
                                                <div className="inner">
                                                    <div className="datepicker-inline">
                                                        <div data-toggle-inline="datepicker"></div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="sidebar-secondary col-lg-12 col-md-6">
                                    <div className="widget search-result-toggle">
                                        <a data-toggle="collapse" href="#capacity" role="button" aria-expanded="false"
                                            className="link" aria-controls="capacity">
                                            <h3 className="widget-title">Number of guests <i className="fa fa-angle-up"></i></h3>
                                        </a>

                                        <div className="collapse show" id="capacity">
                                            <div>
                                                <div className="inner">
                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="99" />
                                                        <label className="custom-control-label" htmlFor="99">0 - 99</label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="199" />
                                                        <label className="custom-control-label" htmlFor="199">100 - 199</label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="299" />
                                                        <label className="custom-control-label" htmlFor="299">200 - 299</label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="399" />
                                                        <label className="custom-control-label" htmlFor="399">300 - 399</label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="400+" />
                                                        <label className="custom-control-label" htmlFor="400+">400+</label>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    <div className="widget search-result-toggle">
                                        <a data-toggle="collapse" href="#settings" role="button" aria-expanded="false"
                                            className="link" aria-controls="settings">
                                            <h3 className="widget-title">Settings<i className="fa fa-angle-up"></i></h3>
                                        </a>

                                        <div className="collapse show" id="settings">
                                            <div>
                                                <div className="inner">
                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="indoor" />
                                                        <label className="custom-control-label" htmlFor="indoor">Indoor</label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="covered" />
                                                        <label className="custom-control-label" htmlFor="covered">Covered
                                                            Outdoor</label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="uncovered" />
                                                        <label className="custom-control-label" htmlFor="uncovered">Uncovered
                                                            Outdoor</label>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    <div className="widget search-result-toggle">
                                        <a data-toggle="collapse" href="#amenities" role="button" aria-expanded="false"
                                            className="link" aria-controls="amenities">
                                            <h3 className="widget-title">Amenities<i className="fa fa-angle-up"></i></h3>
                                        </a>

                                        <div className="collapse show" id="amenities">
                                            <div>
                                                <div className="inner">
                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="accommodations" />
                                                        <label className="custom-control-label"
                                                            htmlFor="accommodations">Accommodations</label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="barservices" />
                                                        <label className="custom-control-label" htmlFor="barservices">Bar
                                                            Services</label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="catering" />
                                                        <label className="custom-control-label" htmlFor="catering">Catering
                                                            Services</label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="cleanup" />
                                                        <label className="custom-control-label" htmlFor="cleanup">Clean Up</label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="eventplanner" />
                                                        <label className="custom-control-label" htmlFor="eventplanner">Event
                                                            Planner</label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="eventrentals" />
                                                        <label className="custom-control-label" htmlFor="eventrentals">Event
                                                            Rentals</label>
                                                    </div>

                                                    <div className="view-all">
                                                        <a href="javascript:" className="btn btn-link-default p-0">+ View
                                                            More</a>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="widget search-result-toggle">
                                        <a data-toggle="collapse" href="#amenities" role="button" aria-expanded="false"
                                            className="link" aria-controls="amenities">
                                            <h3 className="widget-title">Venue Leisure Facilities<i className="fa fa-angle-up"></i>
                                            </h3>
                                        </a>

                                        <div className="collapse show" id="amenities">
                                            <div>
                                                <div className="inner">
                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="accommodations" />
                                                        <label className="custom-control-label"
                                                            htmlFor="accommodations">Accommodations</label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="barservices" />
                                                        <label className="custom-control-label" htmlFor="barservices">Bar
                                                            Services</label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="catering" />
                                                        <label className="custom-control-label" htmlFor="catering">Catering
                                                            Services</label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="cleanup" />
                                                        <label className="custom-control-label" htmlFor="cleanup">Clean Up</label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="eventplanner" />
                                                        <label className="custom-control-label" htmlFor="eventplanner">Event
                                                            Planner</label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="eventrentals" />
                                                        <label className="custom-control-label" htmlFor="eventrentals">Event
                                                            Rentals</label>
                                                    </div>

                                                    <div className="view-all">
                                                        <a href="javascript:" className="btn btn-link-default p-0">+ View
                                                            More</a>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="widget search-result-toggle">
                                        <a data-toggle="collapse" href="#amenities" role="button" aria-expanded="false"
                                            className="link" aria-controls="amenities">
                                            <h3 className="widget-title">Venue Staff Assistance<i className="fa fa-angle-up"></i>
                                            </h3>
                                        </a>

                                        <div className="collapse show" id="amenities">
                                            <div>
                                                <div className="inner">
                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="accommodations" />
                                                        <label className="custom-control-label"
                                                            htmlFor="accommodations">Accommodations</label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="barservices" />
                                                        <label className="custom-control-label" htmlFor="barservices">Bar
                                                            Services</label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="catering" />
                                                        <label className="custom-control-label" htmlFor="catering">Catering
                                                            Services</label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="cleanup" />
                                                        <label className="custom-control-label" htmlFor="cleanup">Clean Up</label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="eventplanner" />
                                                        <label className="custom-control-label" htmlFor="eventplanner">Event
                                                            Planner</label>
                                                    </div>

                                                    <div className="custom-control custom-checkbox form-dark mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="eventrentals" />
                                                        <label className="custom-control-label" htmlFor="eventrentals">Event
                                                            Rentals</label>
                                                    </div>

                                                    <div className="view-all">
                                                        <a href="javascript:" className="btn btn-link-default p-0">+ View
                                                            More</a>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                            <div className="row">
                                <div className="col-lg-12">
                                    <span className="order-lg-last d-inline-flex  mb-3 fixed-bottom fixed">
                                        <a className="btn btn-default mt-3" href="#" role="button" data-toggle="modal"
                                            data-target="#login_form"
                                        > View Results
                                            (2456)</a>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SearchVendor;
