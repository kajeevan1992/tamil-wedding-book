import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "@utilities/Modal";
import { Rating } from "react-simple-star-rating";
import TextArea from "@components/shared/TextArea";
import { NavLink } from "react-router-dom";
import { isEmpty, isGreaterThan, isLessThan } from "@utilities/ValidateUtil";
import { useDispatch } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import { toast } from 'react-hot-toast';
import { statusMessages } from "@utilities/CommonUtil";
import { postReview } from "@services/UserService";

const WriteReviewModal = forwardRef((props, ref) => {
    let modal = null;
    const dispatch = useDispatch();

    useImperativeHandle(ref, () => ({
        showModal() {
            modal = new Modal('#WriteReviewModal', {
                backdrop: true
            });

            modal.show();
        },
        hideModal() {
            modal = new Modal('#WriteReviewModal', {
                backdrop: true
            });

            modal.hide();
        },
    }));

    const [state, setState] = useState({
        review: {
            qualityOfService: 0,
            professionalism: 0,
            flexibility: 0,
            valueForMoney: 0,
            responseTime: 0,
            reviewText: '',
            acceptTermAndPrivacyPolicy: false
        },
        errors: {}
    });

    const handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type === "checkbox" ? target.checked : target.value;

        setState((currentState) => ({
            ...currentState,
            review: {
                ...currentState.review,
                [name]: value,
            }
        }));
    };

    const handleRating = (name, value) => {
        setState((currentState) => ({
            ...currentState,
            review: {
                ...currentState.review,
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

        if (state.review.qualityOfService === 0 || state.review.qualityOfService === null) {
            errors.qualityOfService = ['Quality of service is required'];
            validationFlag = false;
        }
        if (state.review.professionalism === 0 || state.review.professionalism === null) {
            errors.professionalism = ['Professionalism is required'];
            validationFlag = false;
        }
        if (state.review.flexibility === 0 || state.review.flexibility === null) {
            errors.flexibility = ['Flexibility is required'];
            validationFlag = false;
        }
        if (state.review.valueForMoney === 0 || state.review.valueForMoney === null) {
            errors.valueForMoney = ['Value for money is required'];
            validationFlag = false;
        }
        if (state.review.responseTime === 0 || state.review.responseTime === null) {
            errors.responseTime = ['Response time is required'];
            validationFlag = false;
        }

        if (isEmpty(state.review.reviewText)) {
            errors.reviewText = ['Review text is required'];
            validationFlag = false;
        } else if (isLessThan(state.review.reviewText, 50)) {
            errors.reviewText = ['Review text must be at least 50 characters'];
            validationFlag = false;
        } else if (isGreaterThan(state.review.reviewText, 250)) {
            errors.reviewText = ['Review text must be less than 250 characters'];
            validationFlag = false;
        }

        if (!state.review.acceptTermAndPrivacyPolicy) {
            errors.acceptTermAndPrivacyPolicy = ['You must accept the terms and privacy policy'];
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
            const review = {
                ...state.review,
                userId: props.vendor?.id,
                reviewText: state.review.reviewText.trim()
            };

            const { data } = await postReview(review);
            props.onHideModal();
            props.onReviewPosted();
            dispatch(toggleLoading(false));
            toast.success(data.message);
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
            <div className="modal fade" id="WriteReviewModal" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="importClientLabel" >
                <div className="modal-dialog modal-xl couple-dashboard-step-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">How was your experience with {props.vendor.fullName}?</h5>
                            <i className="bi bi-x-lg float-right cross-icon" onClick={props.onHideModal}></i>
                        </div>
                        <div className="modal-body w-100">
                            <div className="row">
                                <div className="col-md-4 mb-5">
                                    <div className="d-flex align-items-center">
                                        <div className="ml-2 relative">
                                            <div className="d-flex align-items-center gap-3">
                                                <h4 className="m-0"><span className="bi bi-patch-check text-success"></span> Quality of the service</h4>
                                            </div>
                                            <Rating
                                                initialValue={state.review.qualityOfService}
                                                size={25}
                                                // allowFraction={true}
                                                onClick={(value) => handleRating('qualityOfService', value)}
                                                style={{
                                                    position: 'absolute',
                                                    left: '0',
                                                    top: '30px'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {
                                        state.errors.qualityOfService &&
                                        <div className="invalid-feedback">
                                            {state.errors.qualityOfService[0]}
                                        </div>
                                    }
                                </div>
                                <div className="col-md-4 mb-5">
                                    <div className="d-flex align-items-center">
                                        <div className="ml-2 relative">
                                            <div className="d-flex align-items-center gap-3">
                                                <h4 className="m-0"><span className="bi bi-briefcase text-info"></span> Professionalism</h4>
                                            </div>

                                            <Rating
                                                initialValue={state.review.professionalism}
                                                size={25}
                                                // allowFraction={true}
                                                onClick={(value) => handleRating('professionalism', value)}
                                                style={{
                                                    position: 'absolute',
                                                    left: '0',
                                                    top: '30px'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {
                                        state.errors.professionalism &&
                                        <div className="invalid-feedback">
                                            {state.errors.professionalism[0]}
                                        </div>
                                    }
                                </div>
                                <div className="col-md-4 mb-5">
                                    <div className="d-flex align-items-center">
                                        <div className="ml-2 relative">
                                            <div className="d-flex align-items-center gap-3">
                                                <h4 className="m-0"><span className="bi bi-list-nested text-warning"></span> Flexibility</h4>
                                            </div>
                                            <Rating
                                                initialValue={state.review.flexibility}
                                                size={25}
                                                // allowFraction={true}
                                                onClick={(value) => handleRating('flexibility', value)}
                                                style={{
                                                    position: 'absolute',
                                                    left: '0',
                                                    top: '30px'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {
                                        state.errors.flexibility &&
                                        <div className="invalid-feedback">
                                            {state.errors.flexibility[0]}
                                        </div>
                                    }
                                </div>
                                <div className="col-md-4 mb-5">
                                    <div className="d-flex align-items-center">
                                        <div className="ml-2 relative">
                                            <div className="d-flex align-items-center gap-3">
                                                <h4 className="m-0"><span className="bi bi-coin text-danger"></span> Value for money</h4>
                                            </div>
                                            <Rating
                                                initialValue={state.review.valueForMoney}
                                                size={25}
                                                // allowFraction={true}
                                                onClick={(value) => handleRating('valueForMoney', value)}
                                                style={{
                                                    position: 'absolute',
                                                    left: '0',
                                                    top: '30px'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {
                                        state.errors.valueForMoney &&
                                        <div className="invalid-feedback">
                                            {state.errors.valueForMoney[0]}
                                        </div>
                                    }
                                </div>
                                <div className="col-md-4 mb-5">
                                    <div className="d-flex align-items-center">
                                        <div className="ml-2 relative">
                                            <div className="d-flex align-items-center gap-3">
                                                <h4 className="m-0"><span className="bi bi-clock-history text-primary"></span> Response time</h4>
                                            </div>
                                            <Rating
                                                initialValue={state.review.responseTime}
                                                size={25}
                                                // allowFraction={true}
                                                onClick={(value) => handleRating('responseTime', value)}
                                                style={{
                                                    position: 'absolute',
                                                    left: '0',
                                                    top: '30px'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {
                                        state.errors.responseTime &&
                                        <div className="invalid-feedback">
                                            {state.errors.responseTime[0]}
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="row mt-5">
                                <div className="col-md-12">
                                    <TextArea
                                        mbClassName="mb-3"
                                        type="text"
                                        label={<span>Review <small className="text-muted">({state.review.reviewText.trim().length}/250)</small></span>}
                                        selector="reviewText"
                                        value={state.review.reviewText}
                                        placeholder="Write your review here. Other couples look for details about professionalism, quality of service and communication."
                                        onHandleChange={handleInputChange}
                                        allBorders={true}
                                        errors={state.errors}
                                    />

                                    <div className="mb-4">
                                        <div className="form-group">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    name="acceptTermAndPrivacyPolicy"
                                                    id="acceptTermAndPrivacyPolicy"
                                                    onChange={handleInputChange}
                                                    className="form-check-input w-h-17px theme-color-bg"
                                                />
                                                <label className="form-check-label" htmlFor="acceptTermAndPrivacyPolicy">
                                                    &nbsp; <small>I accept Tamil Wedding book <NavLink to="" end className="anchor-deco">Terms of Use</NavLink> and <NavLink to="" end className="anchor-deco">Privacy Policy</NavLink> With this review, you agree to the review policies contained in the <NavLink to="" end className="anchor-deco">Terms of Use</NavLink> and are confirming that it was based on your own experience and that you don't have any personal or business relationship with this vendor.</small>
                                                </label>
                                            </div>
                                        </div>
                                        {
                                            state.errors.acceptTermAndPrivacyPolicy &&
                                            <div className="invalid-feedback">
                                                {state.errors.acceptTermAndPrivacyPolicy[0]}
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-5">
                                <div className="col-md-12">
                                    <button type="submit" className="btn btn-primary btn-sm" onClick={onSubmit}>Submit Review</button> &nbsp;&nbsp;
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

export default WriteReviewModal;