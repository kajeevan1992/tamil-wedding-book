import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Modal } from "@utilities/Modal";
import InputFieldAddress from "@components/shared/InputFieldAddress";
import * as validateUtil from '@utilities/ValidateUtil';
import moment from "moment";
import * as coupleService from '@services/CoupleService';
import { useDispatch } from "react-redux";
import { toggleLoading, authenticate } from "@store/AppSlice";
import { toast } from 'react-hot-toast';
import InputField from "@components/shared/InputField";
import InputFieldDate from "@components/shared/InputFieldDate";
import { formatDate, statusMessages } from "@utilities/CommonUtil";

const LastStepModal = forwardRef((props, ref) => {
    const [state, setState] = useState({
        weddingDetails: {
            fullName: '',
            partnerName: '',
            date: '',
            guests: '',

            // address: '',
            // lng: '',
            // lat: '',
            address: 'Sydney, Australia',
            lng: '33.8688',
            lat: '151.2093',

            categories: [],
        },

        categories: [],

        errors: {}
    });

    let modal = null;
    const dispatch = useDispatch();

    // Set initials 
    useEffect(() => {
        if (Object.keys(props.appState.profile).length > 0) {
            console.log('address ', props.appState.profile.couple.weddingDetail.address);
            setState((currentState) => ({
                ...currentState,
                weddingDetails: {
                    ...currentState.weddingDetails,
                    fullName: props.appState.profile.fullName,
                    partnerName: props.appState.profile.couple.weddingDetail.partnerName,
                    date: moment(props.appState.profile.couple.weddingDetail.date).toDate(),
                    guests: props.appState.profile.couple.weddingDetail.guests,
                    // address: props.appState.profile.couple.weddingDetail.address,
                    // lng: props.appState.profile.couple.weddingDetail.lng,
                    // lat: props.appState.profile.couple.weddingDetail.lat,
                }
            }));

            let categories = [];
            let weddingCategories = [];

            weddingCategories.push('venues');
            props.appState.categories.map(category => {
                if (category.type === 'supplier') {
                    categories.push(category);
                }

                if (category.highlighted === true) {
                    weddingCategories.push(category.id);
                }
            });

            setState((currentState) => ({
                ...currentState,
                weddingDetails: {
                    ...currentState.weddingDetails,
                    categories: weddingCategories,
                },
                categories: categories,
            }));
        }
    }, [props.appState.profile, props.appState.categories]);

    useImperativeHandle(ref, () => ({
        showModal() {
            modal = new Modal('#lastStepModal', {
                backdrop: true
            });

            modal.show();
        },
        hideModal() {
            modal = new Modal('#lastStepModal', {
                backdrop: true
            });

            modal.hide();
        },
    }));

    const handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        setState((currentState) => ({
            ...currentState,
            weddingDetails: {
                ...currentState.weddingDetails,
                [name]: value,
            }
        }));
    }

    const handleCategoriesChange = (isCheck, categoryId) => {
        let weddingCategories = state.weddingDetails.categories
        let find = weddingCategories.indexOf(categoryId);
        if (find > -1) {
            weddingCategories.splice(find, 1)
        } else {
            weddingCategories.push(categoryId)
        }

        setState((currentState) => ({
            ...currentState,
            weddingDetails: {
                ...currentState.weddingDetails,
                categories: weddingCategories,
            }
        }));
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        setState((currentState) => ({
            ...currentState,
            errors: {}
        }));

        let errors = {};
        let validationFlag = true;

        if (validateUtil.isEmpty(state.weddingDetails.fullName)) {
            validationFlag = false;
            errors.fullName = ['Name and surname is required'];
        } else if (validateUtil.isGreaterThan(state.weddingDetails.fullName, 191)) {
            validationFlag = false;
            errors.fullName = ['Name must not be greater than 191 characters!'];
        }
        if (validateUtil.isEmpty(state.weddingDetails.partnerName)) {
            validationFlag = false;
            errors.partnerName = ['Partner name is required'];
        } else if (validateUtil.isGreaterThan(state.weddingDetails.partnerName, 191)) {
            validationFlag = false;
            errors.partnerName = ['Partner name must not be greater than 191 characters!'];
        }
        if (validateUtil.isEmpty(state.weddingDetails.date)) {
            validationFlag = false;
            errors.date = ['Wedding date is required'];
        }
        if (validateUtil.isEmpty(state.weddingDetails.guests)) {
            validationFlag = false;
            errors.guests = ['Guests is required'];
        }

        if (validateUtil.isEmpty(state.weddingDetails.address)) {
            validationFlag = false;
            errors.address = ['Address field is required'];
        } else if (validateUtil.isGreaterThan(state.weddingDetails.address, 255)) {
            validationFlag = false;
            errors.address = ['Address must not be greater than 255 characters!'];
        }

        if (!validationFlag) {
            setState((currentState) => ({
                ...currentState,
                errors: errors
            }));
        } else {
            submit();
        }
    }

    async function submit() {
        try {
            setState((currentState) => ({
                ...currentState,
                errors: {}
            }));

            dispatch(toggleLoading(true));

            const weddingDetails = { ...state.weddingDetails };
            weddingDetails.date = formatDate(weddingDetails.date, 'YYYY-MM-DD');
            const { data } = await coupleService.updateLastStepWeddingDetails(weddingDetails);

            dispatch(toggleLoading(false));
            dispatch(authenticate(data.user))

            toast.success(data.message);
            props.onHideModal();
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

    return (
        <>
            <div className="modal fade" id="lastStepModal" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="lastStepModalLabel" >
                <div className="modal-dialog modal-xl couple-dashboard-step-modal">
                    <div className="modal-content">
                        <div className="modal-body p-0">
                            <div className="row">
                                <div className="col-4 left-bg modal-left-bg" style={{ backgroundImage: `url(assets/images/backgrounds/flowers.jpeg)` }}>
                                    <div>
                                        <h3 className="ml-3 pl-2 mt-5">
                                            <strong>One last step!</strong>
                                        </h3>
                                        <p className="ml-3 pl-2 mt-3">Update your planner with <br />
                                            information about your <br />
                                            wedding</p>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="pt-4 pr-5">
                                        <form className="auth-register-form mt-3" action="#" method="POST" onSubmit={onSubmit}>
                                            <div className="row">
                                                <div className="col-12 mb-3">
                                                    <strong>Our Story</strong>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-4">
                                                        <InputField
                                                            label="I AM"
                                                            type="text"
                                                            selector="fullName"
                                                            value={state.weddingDetails.fullName}
                                                            placeholder="Name"
                                                            onHandleChange={handleInputChange}
                                                            allBorders={true}
                                                            errors={state.errors}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-4">
                                                        <InputField
                                                            label="MY PARTNER IS"
                                                            type="text"
                                                            selector="partnerName"
                                                            value={state.weddingDetails.partnerName}
                                                            placeholder="Name"
                                                            onHandleChange={handleInputChange}
                                                            allBorders={true}
                                                            errors={state.errors}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 mb-3">
                                                    <strong>Wedding details</strong>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="mb-4">
                                                        <InputFieldDate
                                                            label="DATE"
                                                            selected={state.weddingDetails.date}
                                                            selector="weddingDate"
                                                            format="yyyy-MM-dd"
                                                            onHandleChange={(date) => {
                                                                setState((currentState) => ({
                                                                    ...currentState,
                                                                    weddingDetails: {
                                                                        ...currentState.weddingDetails,
                                                                        date: date,
                                                                    }
                                                                }));
                                                            }}
                                                            placeholder="Wedding Date"
                                                            allBorders={true}
                                                            errors={state.errors}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="mb-4">
                                                        <InputField
                                                            label="GUESTS"
                                                            type="number"
                                                            selector="guests"
                                                            value={state.weddingDetails.guests}
                                                            placeholder="Ex. 100"
                                                            onHandleChange={handleInputChange}
                                                            allBorders={true}
                                                            errors={state.errors}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12"></div>
                                                <div className="col-md-8">
                                                    <div className="mb-4">
                                                        <InputFieldAddress
                                                            label="TOWN/CITY COUNTRY"
                                                            icon="bi bi-geo-alt"
                                                            placeholder="Wedding location..."
                                                            selector="address"
                                                            onPlaceChange={(place) => {
                                                                setState((currentState) => ({
                                                                    ...currentState,
                                                                    weddingDetails: {
                                                                        ...currentState.weddingDetails,
                                                                        address: place.formatted_address,
                                                                        lng: place.geometry.location.lng(),
                                                                        lat: place.geometry.location.lat()
                                                                    }
                                                                }));
                                                            }}
                                                            allBorders={true}
                                                            errors={state.errors}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 mt-3 mb-4">
                                                    <strong>Which wedding suppliers do you still need?</strong>
                                                </div>
                                                <div className="col-12 mb-3">
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <div className="form-check mb-4">
                                                                <input
                                                                    type="checkbox"
                                                                    name="category-venues"
                                                                    id="category-venues"
                                                                    checked={state.weddingDetails.categories.includes('venues')}
                                                                    onChange={(value) => {
                                                                        handleCategoriesChange(value.target.checked, 'venues')
                                                                    }}
                                                                    className="form-check-input theme-color-bg w-h-17px"
                                                                />
                                                                <label className="form-check-label" htmlFor="category-venues">
                                                                    &nbsp; Wedding Venues
                                                                </label>
                                                            </div>
                                                        </div>
                                                        {state.categories.map((category, index) =>
                                                            <div className="col-md-4" key={`categories-list-step-modal-${index}`}>
                                                                <div className="form-check mb-4">
                                                                    <input
                                                                        type="checkbox"
                                                                        name={`category${category.id}`}
                                                                        id={`category${category.id}`}
                                                                        onChange={(value) => {
                                                                            handleCategoriesChange(value.target.checked, category.id)
                                                                        }}
                                                                        checked={state.weddingDetails.categories.includes(category.id)}
                                                                        className="form-check-input theme-color-bg w-h-17px"
                                                                    />
                                                                    <label className="form-check-label" htmlFor={`category${category.id}`}>
                                                                        &nbsp; {category.name}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="text-right py-4">
                                                        <button className="btn btn-primary btn-sm">Save</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default LastStepModal;