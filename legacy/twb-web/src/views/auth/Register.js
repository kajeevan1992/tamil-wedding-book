import AuthFooter from "@components/auth/AuthFooter";
import SocialSignin from "@components/auth/SocialSignin";
import InputField from "@components/shared/InputField";
import InputFieldAddress from "@components/shared/InputFieldAddress";
import InputFieldDate from "@components/shared/InputFieldDate";
import InputFieldPassword from "@components/shared/InputFieldPassword";
import InputFieldPhone from "@components/shared/InputFieldPhone";
import * as authService from "@services/AuthService";
import { toggleLoading } from "@store/AppSlice";
import { formatDate, statusMessages } from "@utilities/CommonUtil";
import * as validateUtil from "@utilities/ValidateUtil";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import Select from "react-select";

function Register() {
    const [state, setState] = useState({
        user: {
            fullName: "",
            email: "",
            password: "",

            // address: '',
            // lng: '',
            // lat: '',
            address: "Sydney, Australia",
            lng: "33.8688",
            lat: "151.2093",

            weddingDate: "",
            telephone: "",
            weddingStyle: "",
            // role: '',
            acceptTermAndPrivacyPolicy: "",
            linkAccount: null,
        },

        errors: {},
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        if (searchParams.get("name")) {
            setState((currentState) => ({
                ...currentState,
                user: {
                    ...currentState.user,
                    fullName: searchParams.get("name"),
                },
            }));
        }
        if (searchParams.get("email")) {
            setState((currentState) => ({
                ...currentState,
                user: {
                    ...currentState.user,
                    email: searchParams.get("email"),
                },
            }));
        }
        if (searchParams.get("link-account-invitation")) {
            setState((currentState) => ({
                ...currentState,
                user: {
                    ...currentState.user,
                    linkAccount: searchParams.get("link-account-invitation"),
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

        if (validateUtil.isEmpty(state.user.fullName)) {
            validationFlag = false;
            errors.fullName = ["Name and surname is required"];
        } else if (validateUtil.isGreaterThan(state.user.fullName, 191)) {
            validationFlag = false;
            errors.fullName = [
                "Name and surname must not be greater than 191 characters!",
            ];
        }
        if (validateUtil.isEmpty(state.user.email)) {
            validationFlag = false;
            errors.email = ["Email is required"];
        } else if (validateUtil.isNotEmail(state.user.email)) {
            validationFlag = false;
            errors.email = [
                "Invalid email address, please make sure the spelling!",
            ];
        } else if (validateUtil.isGreaterThan(state.user.email, 255)) {
            validationFlag = false;
            errors.email = ["Email must not be greater than 255 characters!"];
        }
        if (validateUtil.isEmpty(state.user.password)) {
            validationFlag = false;
            errors.password = ["Password is required"];
        } else if (validateUtil.isLessThan(state.user.password, 8)) {
            validationFlag = false;
            errors.password = ["Password must be at least 8 characters long"];
        } else if (validateUtil.isGreaterThan(state.user.password, 100)) {
            validationFlag = false;
            errors.password = [
                "Password must not be greater than 100 characters",
            ];
        }
        if (validateUtil.isEmpty(state.user.address)) {
            validationFlag = false;
            errors.address = ["Address field is required"];
        } else if (validateUtil.isGreaterThan(state.user.address, 255)) {
            validationFlag = false;
            errors.address = [
                "Address must not be greater than 255 characters!",
            ];
        }
        if (validateUtil.isEmpty(state.user.weddingStyle)) {
            validationFlag = false;
            errors.weddingStyle = ["Wedding style is required"];
        }
        if (validateUtil.isEmpty(state.user.weddingDate)) {
            validationFlag = false;
            errors.weddingDate = ["Wedding date is required"];
        }
        if (validateUtil.isEmpty(state.user.telephone)) {
            validationFlag = false;
            errors.telephone = ["Your phone number is required"];
        }
        if (validateUtil.isEmpty(state.user.acceptTermAndPrivacyPolicy)) {
            validationFlag = false;
            errors.acceptTermAndPrivacyPolicy = [
                "You must accept to our terms and privacy policy!",
            ];
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

    async function submit() {
        try {
            setState((currentState) => ({
                ...currentState,
                errors: {},
            }));

            dispatch(toggleLoading(true));

            const user = { ...state.user };
            user.weddingDate = formatDate(user.weddingDate, "YYYY-MM-DD");

            const response = await authService.register(user);
            dispatch(toggleLoading(false));
            toast.success(response.data.message);
            navigate(`/${response.data.user.role}`);
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
                            <div className="w-100 text-center p-0 left-auth-box"></div>
                        </div>
                        <div className="d-flex col-lg-7 col-md-12 white-bg">
                            <div className="col-12 col-lg-12 px-xl-2 mx-auto">
                                <div className="mt-3">
                                    <SocialSignin />
                                </div>
                                <hr className="mt-4" />
                                <form
                                    className="auth-register-form mt-3"
                                    action="#"
                                    method="POST"
                                    onSubmit={onSubmit}
                                >
                                    <p className="fw-500 text-center">
                                        Or sign up using your email
                                    </p>
                                    <InputField
                                        mbClassName="mb-3"
                                        type="text"
                                        selector="fullName"
                                        value={state.user.fullName}
                                        placeholder="Name and surname"
                                        onHandleChange={handleInputChange}
                                        allBorders={true}
                                        errors={state.errors}
                                        icon="bi bi-person"
                                    />
                                    <InputField
                                        mbClassName="mb-3"
                                        type="email"
                                        selector="email"
                                        value={state.user.email}
                                        placeholder="Email"
                                        onHandleChange={handleInputChange}
                                        allBorders={true}
                                        errors={state.errors}
                                        icon="bi bi-envelope"
                                    />
                                    <InputFieldPassword
                                        mbClassName="mb-3"
                                        selector="password"
                                        value={state.user.password}
                                        placeholder="Your password"
                                        onHandleChange={handleInputChange}
                                        allBorders={true}
                                        errors={state.errors}
                                    />
                                    <InputFieldAddress
                                        mbClassName="mb-3"
                                        icon="bi bi-geo-alt"
                                        placeholder="You live in"
                                        selector="address"
                                        onPlaceChange={(place) => {
                                            setState((currentState) => ({
                                                ...currentState,
                                                user: {
                                                    ...currentState.user,
                                                    address:
                                                        place.formatted_address,
                                                    lng: place.geometry.location.lng(),
                                                    lat: place.geometry.location.lat(),
                                                },
                                            }));
                                            // console.log(place, place.geometry.location.lng(), place.geometry.location.lat());
                                        }}
                                        errors={state.errors}
                                        allBorders={true}
                                    />
                                    <div className="mb-3">
                                        <Select
                                            className="select-theme-border filter"
                                            isClearable={true}
                                            isSearchable={true}
                                            placeholder="Choose wedding style"
                                            defaultValue={
                                                state.user.weddingStyle
                                            }
                                            getOptionLabel={(option) =>
                                                option.label
                                            }
                                            getOptionValue={(option) =>
                                                option.value
                                            }
                                            onChange={(option) =>
                                                setState((currentState) => ({
                                                    ...currentState,
                                                    user: {
                                                        ...currentState.user,
                                                        weddingStyle: option
                                                            ? option.value
                                                            : "",
                                                    },
                                                }))
                                            }
                                            options={[
                                                "Traditional Hindu Wedding",
                                                "Brahmin Wedding",
                                                "Christian Wedding",
                                                "Muslim Wedding",
                                                "Arya Vysya Wedding",
                                                "Dravidian (Non-Brahmin) Wedding",
                                                "Destination Weddings",
                                                "Simplified/Elopement Weddings",
                                                "Mixed Faith Weddings",
                                            ].map((option) => ({
                                                value: option,
                                                label: option,
                                            }))}
                                        />
                                        {state.errors.weddingStyle && (
                                            <div className="invalid-feedback">
                                                {state.errors.weddingStyle[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <InputFieldDate
                                                mbClassName="mb-3"
                                                selected={
                                                    state.user.weddingDate
                                                }
                                                selector="weddingDate"
                                                format="yyyy-MM-dd"
                                                onHandleChange={(date) => {
                                                    setState(
                                                        (currentState) => ({
                                                            ...currentState,
                                                            user: {
                                                                ...currentState.user,
                                                                weddingDate:
                                                                    date,
                                                            },
                                                        })
                                                    );
                                                }}
                                                placeholder="Wedding Date"
                                                allBorders={true}
                                                errors={state.errors}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <InputFieldPhone
                                                mbClassName="mb-3"
                                                icon="bi bi-telephone"
                                                selector="telephone"
                                                value={state.user.telephone}
                                                placeholder="Telephone"
                                                onHandleChange={(value) => {
                                                    setState(
                                                        (currentState) => ({
                                                            ...currentState,
                                                            user: {
                                                                ...currentState.user,
                                                                telephone:
                                                                    value,
                                                            },
                                                        })
                                                    );
                                                }}
                                                allBorders={true}
                                                errors={state.errors}
                                            />
                                        </div>
                                    </div>
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
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="acceptTermAndPrivacyPolicy"
                                                >
                                                    &nbsp;{" "}
                                                    <small>
                                                        I accept Tamil Wedding
                                                        book{" "}
                                                        <NavLink
                                                            to=""
                                                            end
                                                            className="anchor-deco"
                                                        >
                                                            Terms of Use
                                                        </NavLink>{" "}
                                                        and{" "}
                                                        <NavLink
                                                            to=""
                                                            end
                                                            className="anchor-deco"
                                                        >
                                                            Privacy Policy
                                                        </NavLink>
                                                    </small>
                                                </label>
                                            </div>
                                        </div>
                                        {state.errors
                                            .acceptTermAndPrivacyPolicy && (
                                            <div className="invalid-feedback">
                                                {
                                                    state.errors
                                                        .acceptTermAndPrivacyPolicy[0]
                                                }
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                    >
                                        Sign up
                                    </button>
                                </form>

                                <div className="text-center my-5">
                                    <p>
                                        Already have an account?
                                        <NavLink
                                            to="/login"
                                            end
                                            className="text-theme fw-500"
                                        >
                                            {" "}
                                            Login
                                        </NavLink>
                                    </p>
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

export default Register;
