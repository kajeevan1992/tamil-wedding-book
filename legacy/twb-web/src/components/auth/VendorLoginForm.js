import { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import * as validateUtil from '@utilities/ValidateUtil';
import * as authService from '@services/AuthService';
import { loadNotifications } from '@services/UserService';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggleLoading, pushNotificationsToState } from "@store/AppSlice";
import InputField from "@components/shared/InputField";
import InputFieldPassword from "@components/shared/InputFieldPassword";
import { statusMessages } from "@utilities/CommonUtil";

const VendorLoginForm = () => {
    const [state, setState] = useState({
        user: {
            email: '',
            password: '',
            vendorLogin: true
        },
        passwordHidden: true,
        errors: {}
    });

    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Pre-fill email from query params
    useEffect(() => {
        if (searchParams.get('email')) {
            setState((currentState) => ({
                ...currentState,
                user: {
                    ...currentState.user,
                    email: searchParams.get('email'),
                }
            }));
        }
    }, [searchParams]);

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
    };

    const validateForm = () => {
        let errors = {};
        let validationFlag = true;

        if (validateUtil.isEmpty(state.user.email)) {
            validationFlag = false;
            errors.email = ['Email/Username is required'];
        }
        if (validateUtil.isEmpty(state.user.password)) {
            validationFlag = false;
            errors.password = ['Password is required'];
        }

        setState((currentState) => ({
            ...currentState,
            errors: errors
        }));

        return validationFlag;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setState((currentState) => ({
            ...currentState,
            errors: {}
        }));

        if (!validateForm()) return;
        await submit();
    };

    const submit = async () => {
        try {
            dispatch(toggleLoading(true));
            const { data } = await authService.login(state.user);

            const response = await loadNotifications();
            dispatch(pushNotificationsToState(response.data));

            dispatch(toggleLoading(false));
            toast.success(data.message);

            if (!data.user.stepsDone) {
                navigate(`/${data.user.role}/create-storefront`);
            } else {
                navigate(`/${data.user.role}`);
            }
        } catch (error) {
            dispatch(toggleLoading(false));
            if (statusMessages(error) === 'validation-errors') {
                setState((currentState) => ({
                    ...currentState,
                    errors: error.response.data.errors
                }));
            }
        }
    };

    return (
        <div className="auth-vendor-login-bg">
            <form role="form" className="w-100" onSubmit={onSubmit}>
                <h4 className="text-white mb-3">BUSINESS LOGIN</h4>

                <InputField
                    icon="bi bi-envelope"
                    type="text"
                    selector="email"
                    value={state.user.email}
                    placeholder="Email/Username"
                    className="white-theme"
                    onHandleChange={handleInputChange}
                    errors={state.errors}
                    allBorders={true}
                />

                <InputFieldPassword
                    selector="password"
                    value={state.user.password}
                    placeholder="Password"
                    className="white-theme"
                    onHandleChange={handleInputChange}
                    errors={state.errors}
                    allBorders={true}
                />

                <button className="btn btn-primary own-family own-btn-login btn-sm btn-block">Log In</button>
                <div className="linkage mt-4">
                    <a href="#" className="forgot-pass-link text-white">Forgot your password?</a>
                </div>
            </form>
        </div>
    );
};

export default VendorLoginForm;
