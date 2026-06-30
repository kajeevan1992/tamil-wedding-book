import { forwardRef, useImperativeHandle, useState, useRef, Fragment } from "react";
import { Modal } from "@utilities/Modal";
import { useDispatch } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import { toast } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import { statusMessages } from "@utilities/CommonUtil";
import { searchSupplier } from "@services/CoupleService";
import { storeSupplier } from "@services/CoupleService";
import CreateAndInviteVendor from "@components/couple/CreateAndInviteSupplier";

const SearchVendorModal = forwardRef((props, ref) => {
    const [state, setState] = useState({
        search: {
            keyword: ''
        },
        vendors: [],
        vendor: {},
        isNewBusinessRequest: false,
        categories: [],

        errors: {}
    });

    const searchRef = useRef("");

    let modal = null;
    const dispatch = useDispatch();

    useImperativeHandle(ref, () => ({
        showModal() {
            modal = new Modal('#searchVendorModal', {
                backdrop: true
            });

            modal.show();
        },
        hideModal() {
            modal = new Modal('#searchVendorModal', {
                backdrop: true
            });

            modal.hide();
        },
    }));

    const Menu = (props) => {
        return (
            <Fragment>
                <components.Menu {...props}>
                    <div>
                        {props.selectProps.fetchingData ? (
                            <span className="fetching">Fetching data...</span>
                        ) : (
                            <div>{props.children}</div>
                        )}
                        <div className="d-flex justify-content-center">
                            <button
                                className="btn btn-link btn-sm"
                                onClick={addBussiness}
                            >
                                Can't find the provider? Create & Invite Now
                            </button>
                        </div>
                    </div>
                </components.Menu>
            </Fragment>
        );
    };

    const submit = async (search) => {
        if (search.length < 1) return;

        try {
            setState((currentState) => ({
                ...currentState,
                errors: {}
            }));

            dispatch(toggleLoading(true));

            const { data } = await searchSupplier({ keyword: search });

            dispatch(toggleLoading(false));
            return data;
        } catch (error) {
            dispatch(toggleLoading(false));
            if (statusMessages(error) === 'validation-errors') {
                setState((currentState) => ({
                    ...currentState,
                    errors: error.response.data.errors
                }));
            }
        }
    }

    const addBussiness = () => {
        // let role = props.app.profile.role === 'venue' ? 'supplier' : 'venue';

        // let categories = props.app.categories.filter(category => {
        //     if (category.type === role) {
        //         return category;
        //     }
        // });

        setState((currentState) => ({
            ...currentState,
            isNewBusinessRequest: true,
            // categories: categories
        }));
    }

    async function addVendor() {
        if (!state.vendor.id) return;

        try {
            dispatch(toggleLoading(true));

            const response = await storeSupplier({
                coupleId: props.app.profile.couple.id,
                vendorId: state.vendor.id
            });

            if (response.status === 201) {
                toast.success(response.data.message);
                props.onVendorAdded(response.data.supplier);
            } else {
                toast(response.data.message);
            }

            searchRef.current.clearValue();

            dispatch(toggleLoading(false));
        } catch (error) {
            console.log(error)
            dispatch(toggleLoading(false));
            if (statusMessages(error) === 'validation-errors') {
                setState((currentState) => ({
                    ...currentState,
                    errors: error.response.data.errors
                }));
            }
        }
    }

    return (
        <>
            <div className="modal fade" id="searchVendorModal" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="searchVendorModal">
                <div className="modal-dialog couple-dashboard-step-modal">
                    <div className="modal-content">
                        <div className="modal-header fs-16px">
                            <div className="modal-title">Add New Vendor</div>
                            <button className="btn p-0" onClick={props.onHideModal}>
                                <span className="bi bi-x-lg"></span>
                            </button>
                        </div>
                        <div className="modal-body w-100">
                            <div className="row mr-0 ml-0 w-100">
                                <div className="col-12 w-100">
                                    {state.isNewBusinessRequest ? (
                                        <CreateAndInviteVendor
                                            app={props.app}
                                            categories={state.categories}
                                            created={(newVendor) => {
                                                props.onVendorAdded(newVendor);
                                                props.onHideModal();
                                                setState((currentState) => ({
                                                    ...currentState,
                                                    isNewBusinessRequest: false,
                                                }));
                                            }}
                                            cancelAction={
                                                () => {
                                                    setState((currentState) => ({
                                                        ...currentState,
                                                        isNewBusinessRequest: false,
                                                    }));
                                                }
                                            }
                                        />) : (<div className="row pb-3">
                                            <div className="col-10">

                                                <div className="mb-3">
                                                    <AsyncSelect
                                                        cacheOptions
                                                        loadOptions={submit}
                                                        // defaultOptions
                                                        ref={searchRef}
                                                        isClearable={true}
                                                        // getOptionLabel={(option) => `${option.fullName} (${option?.vendor?.category?.name})`}
                                                        formatOptionLabel={function (option) {
                                                            return (
                                                                <>
                                                                    <div className="d-flex justify-content-between">
                                                                        <div>{option.fullName}</div>
                                                                        <small className="badge badge-warning" style={{ height: '16px' }}>{option?.vendor?.category?.name}</small>
                                                                    </div>
                                                                    <small>{option.address}</small>
                                                                </>
                                                            );
                                                        }}
                                                        getOptionValue={(option) => option.vendor.id}
                                                        // components={{ Option: Menu }}
                                                        components={{
                                                            Menu,
                                                            DropdownIndicator: () => null, IndicatorSeparator: () => null,
                                                        }}
                                                        onChange={(option) => {
                                                            if (option?.vendor) {
                                                                setState((currentState) => ({
                                                                    ...currentState,
                                                                    vendor: option.vendor
                                                                }));
                                                            } else {
                                                                setState((currentState) => ({
                                                                    ...currentState,
                                                                    vendor: {}
                                                                }));
                                                            }
                                                        }}
                                                    />
                                                    {
                                                        state.errors['keyword'] &&
                                                        <div className="invalid-feedback">
                                                            {state.errors['keyword'][0]}
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-2">
                                                <div className="input-group-append">
                                                    <button type="button" onClick={addVendor} className="btn btn-primary btn-sm" id="basic-addon2">Add</button>
                                                </div>
                                            </div>
                                        </div>)
                                    }
                                </div>
                                {state.vendors.totalItems > state.vendors.itemsPerPage && <section className="col-md-12 mt-3">
                                    <ReactPaginate
                                        nextLabel=">"
                                        onPageChange={(e) => { submit(e.selected) }}
                                        pageRangeDisplayed={3}
                                        marginPagesDisplayed={1}
                                        pageCount={Math.ceil(state.vendors.totalItems / state.vendors.itemsPerPage)}
                                        previousLabel="<"
                                        pageClassName="page-item"
                                        pageLinkClassName="page-link"
                                        previousClassName="page-item"
                                        previousLinkClassName="page-link"
                                        nextClassName="page-item"
                                        nextLinkClassName="page-link"
                                        breakLabel="..."
                                        breakClassName="page-item"
                                        breakLinkClassName="page-link"
                                        containerClassName="pagination sm justify-content-center"
                                        activeClassName="active"
                                        renderOnZeroPageCount={null}
                                    />
                                </section>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default SearchVendorModal;