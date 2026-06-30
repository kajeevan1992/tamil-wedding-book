import AuthFooter from "@components/auth/AuthFooter";
import SocialSignin from "@components/auth/SocialSignin";
import InputField from "@components/shared/InputField";
import InputFieldPassword from "@components/shared/InputFieldPassword";
import * as authService from "@services/AuthService";
import { loadNotifications } from "@services/UserService";
import { pushNotificationsToState, toggleLoading } from "@store/AppSlice";
import { statusMessages } from "@utilities/CommonUtil";
import * as validateUtil from "@utilities/ValidateUtil";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";

function Login() {
    const [state, setState] = useState({
        user: {
            email: "",
            password: "",
        },

        passwordHidden: true,

        errors: {},
    });

    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        if (searchParams.get("email")) {
            setState((currentState) => ({
                ...currentState,
                user: {
                    ...currentState.user,
                    email: searchParams.get("email"),
                },
            }));
        }
    }, []);

    const handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value =
            target.type === "checkbox" ? target.checked : target.value;

        setState((currentState) => ({
            ...currentState,
            user: {
                ...currentState.user,
                [name]: value,
            },
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        setState((currentState) => ({
            ...currentState,
            errors: {},
        }));

        let errors = {};
        let validationFlag = true;

        if (validateUtil.isEmpty(state.user.email)) {
            validationFlag = false;
            errors.email = ["Email is required"];
        }
        if (validateUtil.isEmpty(state.user.password)) {
            validationFlag = false;
            errors.password = ["Password is required"];
        }

        if (!validationFlag) {
            setState((currentState) => ({
                ...currentState,
                errors: errors,
            }));
        } else {
            submit();
        }
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function submit() {
        try {
            setState((currentState) => ({
                ...currentState,
                errors: {},
            }));

            dispatch(toggleLoading(true));

            const { data } = await authService.login(state.user);

            const response = await loadNotifications();
            dispatch(pushNotificationsToState(response.data));

            dispatch(toggleLoading(false));
            toast.success(data.message);
            navigate(`/${data.user.role}`);
        } catch (error) {
            dispatch(toggleLoading(false));
            if (statusMessages(error) === "validation-errors") {
                setState((currentState) => ({
                    ...currentState,
                    errors: error.response.data.errors,
                }));
            }
        }
    }

    return (
        <>
            <div className="row m-0 justify-content-center grey-bg min-h-100vh">
                <div className="col-lg-8 col-10">
                    <div className="text-center my-4">
                        <NavLink to="/" end>
                            <img
                                src="/assets/images/about/Tamil_Wedding_Book.png"
                                alt=""
                                className="own-pl-image auth-logo"
                            />
                        </NavLink>
                    </div>
                    <div className="row grey-border">
                        <div className="d-none d-lg-flex col-lg-5 align-items-center p-0 bg-blue auth-bg">
                            <div className="w-100 text-center p-0 left-auth-box">
                                {/* <div className="auth-dark d-flex">
                                <h3>Tamil Book</h3>
                                <h6>Don't have an Account?</h6>
                                <NavLink to="/register">Sign Up</NavLink>
                            </div> */}
                            </div>
                        </div>
                        <div className="d-flex col-lg-7 col-md-12 white-bg">
                            <div className="col-12 col-lg-12 px-xl-2 mx-auto">
                                <div className="mt-1 pt-5">
                                    <h3 className="card-title fw-bold mb-1 text-center ">
                                        Log in to your account
                                    </h3>
                                    <p className="text-center fw-500 mt-3">
                                        <span className="text-muted">
                                            Don't have an account?
                                        </span>{" "}
                                        <NavLink
                                            to="/register"
                                            end
                                            className="text-theme fw-500"
                                        >
                                            Sign up
                                        </NavLink>
                                    </p>
                                </div>

                                <div className="mt-3">
                                    <SocialSignin />
                                </div>

                                <form
                                    className="auth-register-form mt-5"
                                    action="#"
                                    method="POST"
                                    onSubmit={onSubmit}
                                >
                                    <p className="fw-500 text-center">
                                        Or log in with your email
                                    </p>
                                    <InputField
                                        icon="bi bi-envelope"
                                        type="email"
                                        selector="email"
                                        value={state.user.email}
                                        placeholder="Email"
                                        onHandleChange={handleInputChange}
                                        errors={state.errors}
                                        allBorders={true}
                                    />

                                    <InputFieldPassword
                                        selector="password"
                                        value={state.user.password}
                                        placeholder="Password"
                                        onHandleChange={handleInputChange}
                                        errors={state.errors}
                                        allBorders={true}
                                    />

                                    <div className="mb-4 text-right">
                                        <NavLink to="/request-reset-password">
                                            Forgot your password?
                                        </NavLink>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                    >
                                        Log in
                                    </button>
                                </form>

                                <div className="text-center my-5">
                                    <p className="fw-500">
                                        Are you a venue or supplier?
                                    </p>
                                    <NavLink
                                        to="/vendor-login"
                                        end
                                        className="dark-color"
                                    >
                                        <strong>Business Login</strong>
                                    </NavLink>
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

export default Login;
