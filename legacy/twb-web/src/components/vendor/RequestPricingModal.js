import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Modal } from "@utilities/Modal";
import TextArea from "@components/shared/TextArea";
import { isDate, isEmpty, isGreaterThan, isLessThan, isNotEmail } from "@utilities/ValidateUtil";
import { useDispatch } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import { toast } from 'react-hot-toast';
import { statusMessages } from "@utilities/CommonUtil";
import { postPricingRequest } from "@services/UserService";
import InputField from "@components/shared/InputField";
import InputFieldPhone from "@components/shared/InputFieldPhone";
import InputFieldDate from "@components/shared/InputFieldDate";

const RequestPricingModal = forwardRef((props, ref) => {
    let modal = null;
    const dispatch = useDispatch();

    const [state, setState] = useState({
        pricingRequest: {
            fullName: '',
            email: '',
            phone: '',
            eventDate: '',
            guestsCount: '',
            message: 'Hey there! We are interested in your services. Could you send through information on your packages? Thanks!'
        },
        errors: {}
    });

    useImperativeHandle(ref, () => ({
        showModal() {
            modal = new Modal('#RequestPricingModal', {
                backdrop: true
            });

            if (props.app.isLoggedIn && props.app.profile) {
                setState((currentState) => ({
                    ...currentState,
                    pricingRequest: {
                        ...currentState.pricingRequest,
                        fullName: props.app?.profile?.fullName,
                        email: props.app?.profile?.email,
                        phone: props.app?.profile?.telephone,
                        eventDate: props.app?.profile?.couple?.weddingDetail?.date ? new Date(props.app.profile.couple.weddingDetail.date) : '',
                        guestsCount: props.app?.profile?.couple?.weddingDetail?.guests,
                        message: 'Hey there! We are interested in your services. Could you send through information on your packages? Thanks!'
                    }
                }));
            }
            modal.show();
        },
        hideModal() {
            modal = new Modal('#RequestPricingModal', {
                backdrop: true
            });

            modal.hide();
        },
    }));

    const handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type === "checkbox" ? target.checked : target.value;

        setState((currentState) => ({
            ...currentState,
            pricingRequest: {
                ...currentState.pricingRequest,
                [name]: value,
            }
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        // submit();
        // return;

        setState((currentState) => ({
            ...currentState,
            errors: {}
        }));

        let errors = {};
        let validationFlag = true;

        if (isEmpty(state.pricingRequest.fullName)) {
            errors.fullName = ['Full name is required'];
            validationFlag = false;
        } else if (isLessThan(state.pricingRequest.fullName, 3)) {
            errors.fullName = ['Full name must be at least 3 characters'];
            validationFlag = false;
        } else if (isGreaterThan(state.pricingRequest.fullName, 100)) {
            errors.fullName = ['Full name must be less than 100 characters'];
            validationFlag = false;
        }

        if (isEmpty(state.pricingRequest.email)) {
            errors.email = ['Email is required'];
            validationFlag = false;
        } else if (isNotEmail(state.pricingRequest.email)) {
            errors.email = ['Invalid email address'];
            validationFlag = false;
        } else if (isGreaterThan(state.pricingRequest.email, 200)) {
            errors.email = ['Email must be less than 200 characters'];
            validationFlag = false;
        }

        if (isEmpty(state.pricingRequest.phone)) {
            errors.phone = ['Phone is required'];
            validationFlag = false;
        } else if (isLessThan(state.pricingRequest.phone, 10)) {
            errors.phone = ['Phone number seems invalid'];
            validationFlag = false;
        } else if (isGreaterThan(state.pricingRequest.phone, 20)) {
            errors.phone = ['Phone number seems invalid'];
            validationFlag = false;
        }

        if (isEmpty(state.pricingRequest.eventDate)) {
            errors.eventDate = ['Event date is required'];
            validationFlag = false;
        } else if (!isDate(state.pricingRequest.eventDate)) {
            errors.eventDate = ['Event date seems invalid'];
            validationFlag = false;
        }

        if (isEmpty(state.pricingRequest.guestsCount)) {
            errors.guestsCount = ['Guests count is required'];
            validationFlag = false;
        } else if (state.pricingRequest.guestsCount < 10) {
            errors.guestsCount = ['Guests count must be greater than or equal to 10'];
            validationFlag = false;
        }
        else if (state.pricingRequest.guestsCount > 1000) {
            errors.guestsCount = ['Guests count must be less than 1000'];
            validationFlag = false;
        }
        console.log(state.pricingRequest.message)
        if (isEmpty(state.pricingRequest.message)) {
            errors.message = ['Message is required'];
            validationFlag = false;
        } else if (isLessThan(state.pricingRequest.message, 50)) {
            errors.message = ['Message must be at least 50 characters'];
            validationFlag = false;
        } else if (isGreaterThan(state.pricingRequest.message, 250)) {
            errors.message = ['Message must be less than 250 characters'];
            validationFlag = false;
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
            const pricingRequest = {
                ...state.pricingRequest,
                message: state.pricingRequest.message.trim(),
                vendorId: props.vendor.id
            };
            console.log(props.vendor)
            const { data } = await postPricingRequest(pricingRequest);
            props.onHideModal();
            dispatch(toggleLoading(false));
            toast.success(data.message);
        } catch (error) {
            console.log(error);
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
            <div className="modal fade" id="RequestPricingModal" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="importClientLabel">
                <div className="modal-dialog modal-lg couple-dashboard-step-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Request Pricing</h5>
                            <i className="bi bi-x-lg float-right cross-icon" onClick={props.onHideModal}></i>
                        </div>
                        <div className="modal-body p-4">
                            <div className="row">
                                <InputField
                                    mbClassName="col-md-6 mb-4"
                                    label="Full Name"
                                    icon="bi bi-person"
                                    type="text"
                                    selector="fullName"
                                    value={state.pricingRequest.fullName}
                                    placeholder="Enter your full name"
                                    allBorders={true}
                                    onHandleChange={handleInputChange}
                                    errors={state.errors}
                                />
                                <InputField
                                    mbClassName="col-md-6 mb-4"
                                    label="Email"
                                    icon="bi bi-envelope"
                                    type="email"
                                    selector="email"
                                    value={state.pricingRequest.email}
                                    placeholder="Enter your email"
                                    allBorders={true}
                                    onHandleChange={handleInputChange}
                                    errors={state.errors}
                                />
                                <InputFieldPhone
                                    mbClassName="col-md-6 mb-4"
                                    label="Phone Number"
                                    icon="bi bi-telephone"
                                    selector="phone"
                                    allBorders={true}
                                    value={state.pricingRequest.phone}
                                    placeholder="Enter your phone number"
                                    onHandleChange={(value) => {
                                        setState((currentState) => ({
                                            ...currentState,
                                            pricingRequest: {
                                                ...currentState.pricingRequest,
                                                phone: value,
                                            },
                                        }));
                                    }}
                                    errors={state.errors}
                                />
                                <InputFieldDate
                                    mbClassName="col-md-6 mb-4"
                                    label="Event Date"
                                    selected={state.pricingRequest.eventDate}
                                    selector="eventDate"
                                    format="yyyy-MM-dd"
                                    allBorders={true}
                                    minDate={new Date()}
                                    onHandleChange={(date) => {
                                        setState((currentState) => ({
                                            ...currentState,
                                            pricingRequest: {
                                                ...currentState.pricingRequest,
                                                eventDate: date,
                                            }
                                        }));
                                    }}
                                    placeholder="Event Date"
                                    errors={state.errors}
                                />
                                <InputField
                                    mbClassName="col-md-6 mb-4"
                                    label={<span>Approximate Guests Count <small className='text-muted'>(10-1000)</small></span>}
                                    icon="bi bi-people"
                                    type="number"
                                    selector="guestsCount"
                                    value={state.pricingRequest.guestsCount}
                                    placeholder="Enter the number of guests"
                                    allBorders={true}
                                    onHandleChange={handleInputChange}
                                    errors={state.errors}
                                />

                                <TextArea
                                    mbClassName="col-md-12 mb-4"
                                    label={<span>Message <small className="text-muted">({state.pricingRequest.message.trim().length}/250)</small></span>}
                                    type="text"
                                    selector="message"
                                    value={state.pricingRequest.message}
                                    placeholder="Write your message here."
                                    onHandleChange={handleInputChange}
                                    allBorders={true}
                                    errors={state.errors}
                                />
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <button type="submit" className="btn btn-primary btn-sm" onClick={onSubmit}>Submit Request</button> &nbsp;&nbsp;
                                    <button type="button" className="btn btn-secondary btn-sm" onClick={props.onHideModal}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default RequestPricingModal;