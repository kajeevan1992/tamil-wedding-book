import { useState } from "react";
import * as validateUtil from '@utilities/ValidateUtil';
import * as authService from '@services/AuthService';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDispatch } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import AuthFooter from '@components/auth/AuthFooter';
import { statusMessages } from "@utilities/CommonUtil";

function RequestResetPassword() {
    const [state, setState] = useState({
        user: {
            email: '',
        },

        emailSent: false,

        errors: {}
    });

    const handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        setState((currentState) => ({
            ...currentState,
            user: {
                ...currentState.user,
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

        if (validateUtil.isEmpty(state.user.email)) {
            validationFlag = false;
            errors.email = ['Email is required'];
        } else if (validateUtil.isNotEmail(state.user.email)) {
            validationFlag = false;
            errors.email = ['Invalid email address, please make sure the spelling!'];
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
            dispatch(toggleLoading(true));
            const { data } = await authService.requestResetPassword(state.user);
            dispatch(toggleLoading(false));
            toast.success(data.message);
            setState((currentState) => ({
                ...currentState,
                emailSent: true
            }));
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
            <div className="row m-0 justify-content-center grey-bg min-h-100vh">
                <div className="col-md-4">
                    <div className="text-center my-4">
                        <NavLink to="/" end>
                            <img src="/assets/images/about/Tamil_Wedding_Book.png" alt="" className="own-pl-image auth-logo" />
                        </NavLink>
                    </div>
                    <div className="row grey-border">
                        <div className="d-flex col-12 white-bg">
                            <div className="col-12 px-5 mx-auto">
                                <div className="mt-1 pt-5">
                                    <h3 className="card-title fw-bold mb-1 text-center">Reset Password</h3>
                                    <p className="text-center fw-500 mt-3">Enter your email address for instructions to reset your password</p>
                                </div>

                                {state.emailSent && <div className="alert alert-success text-center">
                                    Perfect! We've just sent you an email with instructions to recover your password.
                                </div>}

                                <form className="auth-register-form mt-5" action="#" method="POST" onSubmit={onSubmit}>
                                    <div className="mb-5">
                                        <div className="input-group password-hidden">
                                            <input
                                                type="email"
                                                name="email"
                                                value={state.user.email}
                                                id="email"
                                                disabled={state.emailSent}
                                                onChange={handleInputChange}
                                                placeholder="Email"
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
                                    {!state.emailSent && <div className="text-center">
                                        <button type="submit" className="btn btn-primary mb-5">Reset Password</button>
                                    </div>
                                    }
                                </form>

                                <div className="text-center mt-2 mb-5">
                                    <NavLink to="/login">Back to login?</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <AuthFooter />
            </div>
        </>
    );
}

export default RequestResetPassword;