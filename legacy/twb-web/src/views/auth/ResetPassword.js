import { useState, useEffect } from "react";
import * as validateUtil from '@utilities/ValidateUtil';
import * as authService from '@services/AuthService';
import { loadNotifications } from '@services/UserService';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDispatch } from "react-redux";
import { toggleLoading, pushNotificationsToState } from "@store/AppSlice";
import AuthFooter from '@components/auth/AuthFooter';
import { useParams } from 'react-router-dom';
import { statusMessages } from "@utilities/CommonUtil";

function ResetPassword() {
    const [state, setState] = useState({
        user: {
            password: '',
            passwordConfirmation: '',
        },

        verified: false,

        passwordHidden: true,
        passwordConfirmationHidden: true,
        errors: {}
    });

    useEffect(() => {
        verifyUser();
    }, []);

    let { hash } = useParams();
    async function verifyUser() {
        try {
            await authService.verifyUser({ hash });

            setState((currentState) => ({
                ...currentState,
                verified: true
            }));
        } catch (error) {
            statusMessages(error);
        }
    }

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

    const togglePasswordView = (password) => {
        setState(currentData => ({
            ...currentData,
            [password]: !state[password]
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        setState((currentState) => ({
            ...currentState,
            errors: {}
        }));

        let errors = {};
        let validationFlag = true;

        if (validateUtil.isEmpty(state.user.password)) {
            validationFlag = false;
            errors.password = ['Password is required'];
        } else if (validateUtil.isLessThan(state.user.password, 8)) {
            validationFlag = false;
            errors.password = ['Password must be at least 8 characters long'];
        } else if (validateUtil.isGreaterThan(state.user.password, 100)) {
            validationFlag = false;
            errors.password = ['Password must not be greater than 100 characters'];
        } else if (validateUtil.isEmpty(state.user.passwordConfirmation)) {
            validationFlag = false;
            errors.passwordConfirmation = ['Password confirmation is required'];
        } else if (validateUtil.isNotSame(state.user.password, state.user.passwordConfirmation)) {
            validationFlag = false;
            errors.password = ['The password confirmation does not match'];
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
    const navigate = useNavigate();

    async function submit() {
        try {
            dispatch(toggleLoading(true));
            const user = state.user;
            user.hash = hash;
            user.password_confirmation = state.user.passwordConfirmation;
            const { data } = await authService.resetPassword(state.user);

            const response = await loadNotifications();
            dispatch(pushNotificationsToState(response.data));

            dispatch(toggleLoading(false));
            toast.success(data.message);
            navigate(`/${data.user.role}`);
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
                    {!state.verified &&
                        <div className="row">
                            <div className="col-12 px-5 mx-automin-h-125px ">
                                <div className="loading-custom mt-5">
                                    <span><i></i><i></i></span>
                                </div>
                            </div>
                            <div className="col-12 text-center">
                                <h4>Please wait</h4>
                            </div>
                        </div>
                    }
                    {state.verified && <div className="row grey-border">

                        <div className="d-flex col-12 white-bg">
                            <div className="col-12 px-5 mx-auto">

                                <div className="mt-1 pt-5">
                                    <h3 className="card-title fw-bold mb-1 text-center">Reset Password</h3>
                                    <p className="text-center fw-500 mt-3">Enter your email address for instructions to reset your password</p>
                                </div>

                                <form className="auth-register-form mt-5" action="#" method="POST" onSubmit={onSubmit}>
                                    <div className="mb-4 mt-5">
                                        <div className="input-group password-hidden">
                                            <input
                                                type={state.passwordHidden ? 'password' : 'text'}
                                                name="password"
                                                value={state.user.password}
                                                id="password"
                                                onChange={handleInputChange}
                                                placeholder="New password"
                                                className="form-control own-input only-b-brdr-grey"
                                            />
                                            <span
                                                className="input-group-text cursor-pointer transparent-password-toggle"
                                                onClick={() => togglePasswordView('passwordHidden')}>
                                                <i className={state.passwordHidden ?
                                                    'bi bi-eye' :
                                                    'bi bi-eye-slash'}></i>
                                            </span>
                                        </div>
                                        {
                                            state.errors.password &&
                                            <div className="invalid-feedback">
                                                {state.errors.password[0]}
                                            </div>
                                        }
                                    </div>
                                    <div className="mb-4">
                                        <div className="input-group password-hidden">
                                            <input
                                                type={state.passwordConfirmationHidden ? 'password' : 'text'}
                                                name="passwordConfirmation"
                                                value={state.user.passwordConfirmation}
                                                id="passwordConfirmation"
                                                onChange={handleInputChange}
                                                placeholder="Confirm password"
                                                className="form-control own-input only-b-brdr-grey"
                                            />
                                            <span
                                                className="input-group-text cursor-pointer transparent-password-toggle"
                                                onClick={() => togglePasswordView('passwordConfirmationHidden')}>
                                                <i className={state.passwordConfirmationHidden ?
                                                    'bi bi-eye' :
                                                    'bi bi-eye-slash'}></i>
                                            </span>
                                        </div>
                                        {
                                            state.errors.passwordConfirmation &&
                                            <div className="invalid-feedback">
                                                {state.errors.passwordConfirmation[0]}
                                            </div>
                                        }
                                    </div>

                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary mb-5">Reset Password</button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                    }
                </div>

                <AuthFooter />
            </div>
        </>
    );
}

export default ResetPassword;