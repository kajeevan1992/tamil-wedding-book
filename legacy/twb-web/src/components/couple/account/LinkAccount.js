import { useState } from "react";
import * as validateUtil from '@utilities/ValidateUtil';
import * as coupleService from '@services/CoupleService';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import { statusMessages } from "@utilities/CommonUtil";

export default function LinkAccount() {
    const app = useSelector(state => state.app);
    const [state, setState] = useState({
        partner: {
            email: '',
        },

        errors: {}
    });

    const handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        setState((currentState) => ({
            ...currentState,
            partner: {
                ...currentState.partner,
                [name]: value,
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

        if (validateUtil.isEmpty(state.partner.email)) {
            validationFlag = false;
            errors.email = ['Email is required'];
        } else if (validateUtil.isNotEmail(state.partner.email)) {
            validationFlag = false;
            errors.email = ['Invalid email address, please make sure the spelling!'];
        } else if (validateUtil.isGreaterThan(state.partner.email, 255)) {
            validationFlag = false;
            errors.email = ['Email must not be greater than 255 characters!'];
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

    const dispatch = useDispatch();

    async function submit() {
        try {
            setState((currentState) => ({
                ...currentState,
                errors: {}
            }));

            dispatch(toggleLoading(true));

            const response = await coupleService.linkAccountInvitation(state.partner);
            dispatch(toggleLoading(false));
            toast.success(response.data.message);
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

    async function removeLinkedAccount() {
        try {
            dispatch(toggleLoading(true));
            const response = await coupleService.removeLinkedAccount();
            dispatch(toggleLoading(false));
            toast.success(response.data.message);
        } catch (error) {
            dispatch(toggleLoading(false));
            toast.error('Something went wrong, please try again');
        }
    }

    return (
        <>
            <div className="col-md-12 mt-4">
                <div className="card h-100percent">
                    <div className="card-header fw-600">
                        LINK ACCOUNT
                    </div>
                    <div className="card-body">
                        <form onSubmit={onSubmit}>
                            <div className="row">
                                {app.profile.couple && !app.profile.couple.weddingDetail.partnerEmail &&
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label>Email</label>
                                            <div className="input-group password-hidden">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={state.partner.email}
                                                    id="partnerEmail"
                                                    onChange={handleInputChange}
                                                    placeholder="Enter email"
                                                    className="form-control own-input only-b-brdr-grey"
                                                />
                                                <span
                                                    className="input-group-text cursor-pointer transparent-password-toggle">
                                                    <i className="bi bi-envelope"></i>
                                                </span>
                                            </div>
                                            {
                                                state.errors.email &&
                                                <div className="invalid-feedback">
                                                    {state.errors.email[0]}
                                                </div>
                                            }
                                        </div>

                                        <button type="submit" className="btn btn-outline-primary btn-sm">Link</button>
                                    </div>
                                }
                                {app.profile.couple && app.profile.couple.weddingDetail.partnerEmail &&
                                    <div className="col-md-4">
                                        <strong>
                                            {app.profile.couple.weddingDetail.partnerEmail}
                                        </strong>
                                        <button type="button" onClick={removeLinkedAccount} className="btn btn-link text-danger btn-sm p-0 pl-2">
                                            <span className="bi bi-x-lg"></span> Remove
                                        </button>
                                    </div>
                                }
                                <div className="col-md-8">
                                    <p>Link accounts with your partner to easily share information and activity from your Wedding Website, Checklist, Guest List, Budget, Seating Chart, and WedShoots app. However, any favourited dresses information will not be shared.</p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}