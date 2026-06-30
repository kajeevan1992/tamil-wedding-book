import { useEffect, useState } from "react";
import * as validateUtil from '@utilities/ValidateUtil';
import * as authService from '@services/AuthService';
import { loadNotifications } from '@services/UserService';
import { NavLink, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggleLoading, pushNotificationsToState } from "@store/AppSlice";
import AuthVendorHeader from "@components/auth/AuthVendorHeader";
import AuthVendorFooter from "@components/auth/AuthVendorFooter";
import InputField from "@components/shared/InputField";
import InputFieldPassword from "@components/shared/InputFieldPassword";
import { statusMessages } from "@utilities/CommonUtil";

function VendorLogin() {
    const [state, setState] = useState({
        user: {
            email: '',
            password: '',
            vendorLogin: true
        },

        passwordHidden: true,

        errors: {}
    });

    const [searchParams, setSearchParams] = useSearchParams();
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
    }, []);

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
            errors.email = ['Email/Username is required'];
        }
        if (validateUtil.isEmpty(state.user.password)) {
            validationFlag = false;
            errors.password = ['Password is required'];
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
            setState((currentState) => ({
                ...currentState,
                errors: {}
            }));

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
    }

    return (
        <>
            <AuthVendorHeader />

            <main id="body-content">
                <section className="callout-main bg-light-gray pb-0">
                    <div className="call-out-bg">
                        <div className="overlay"></div>
                        <div className="container pt-5">
                            <div className="row">
                                <div className="col-lg-8 col-md-8">
                                    <h3 className="txt-white fw-6 mb-5">Grow Your Business with TamilWeddingBook</h3>
                                    <ul className="list-unstyled">
                                        <li className="text-white own-themify mt-2"> <i className="fa fa-check own-color"></i> &nbsp;
                                            Grow Your Business with TamilWeddingBook</li>
                                        <li className="text-white own-themify mt-2"> <i className="fa fa-check own-color"></i> &nbsp;
                                            Reach local engaged couples and book more weddings. </li>
                                        <li className="text-white own-themify mt-2"> <i className="fa fa-check own-color"></i> &nbsp;
                                            Trusted by over 16,000 wedding businesses in the UK.</li>
                                    </ul>
                                    <NavLink to="/vendor-register" end className="btn btn-primary own-family mt-4">
                                        Create Your
                                        Account
                                    </NavLink>
                                </div>
                                <div className="col-lg-4 col-md-4">
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

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="wide-tb-100">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="ml-2 text-center">
                                    <img src="/assets/images/categories/login-icon1.png" className="" width="26%" alt="" />
                                </div>
                                <div className="mt-5">
                                    <h3 className="own-color text-center">Reach Engaged Couples</h3>
                                    <p className="mt-5 text-center">Couples can find your listing and
                                        request information about your business</p>
                                </div>

                            </div>
                            <div className="col-lg-4">
                                <div className="ml-2 text-center">
                                    <img src="/assets/images/categories/login-icon2.png" className="" width="26%" alt="" />
                                </div>
                                <div className="mt-5">
                                    <h3 className="own-color text-center">Reach Engaged Couples</h3>
                                    <p className="mt-5 text-center">Couples can find your listing and
                                        request information about your business</p>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="ml-2 text-center">
                                    <img src="/assets/images/categories/login-icon3.png" className="" width="26%" alt="" />
                                </div>
                                <div className="mt-5">
                                    <h3 className="own-color text-center">Reach Engaged Couples</h3>
                                    <p className="mt-5 text-center">Couples can find your listing and
                                        request information about your business</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="own-container-bg">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="p-5">
                                    <h3 className="mt-4 fw-6 own-color">Showcase Your Business</h3>
                                    <div className="">
                                        <ul className="list-unstyled  mb-0 widget-listing arrow">
                                            <li className="own-list-style mt-4"><i
                                                className="tamilweddingbook_checklist mt-1 own-icon-2"></i> <span
                                                    className="ml-3">Be visible to couples on top search engines with your
                                                    TamilWeddingBook listing</span></li>
                                            <li className="own-list-style mt-3"><i
                                                className="tamilweddingbook_guitar mt-1 own-icon-2"></i> <span
                                                    className="ml-3">Reach more engaged couples and receive lead details immediately
                                                    to your email and phone</span></li>
                                            <li className="own-list-style mt-3"><i
                                                className="tamilweddingbook_dove mt-1 own-icon-2"></i> <span className="ml-3">Track
                                                    performance and get expert advice to help you make the most of your
                                                    listing</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div>
                                    <img src="/assets/images/categories/login-image.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="mt-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 p-0">
                                <div>
                                    <img src="/assets/images/categories/mobile.png" alt="" />
                                </div>
                            </div>
                            <div className="col-lg-6 ">
                                <div className="p-5">
                                    <h3 className="mt-4 fw-6 own-color">Manage Your Leads and <br /> Track Your Growth</h3>
                                    <div className="">
                                        <ul className="list-unstyled  mb-0 widget-listing arrow">
                                            <li className="own-list-style mt-4"><i
                                                className="tamilweddingbook_checklist mt-1 own-icon-2"></i> <span
                                                    className="ml-3">Be visible to couples on top search engines with your
                                                    TamilWeddingBook listing</span></li>
                                            <li className="own-list-style mt-3"><i
                                                className="tamilweddingbook_guitar mt-1 own-icon-2"></i> <span
                                                    className="ml-3">Reach more engaged couples and receive lead details immediately
                                                    to your email and phone</span></li>
                                            <li className="own-list-style mt-3"><i
                                                className="tamilweddingbook_dove mt-1 own-icon-2"></i> <span className="ml-3">Track
                                                    performance and get expert advice to help you make the most of your
                                                    listing</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="own-bg-section own-section-color">
                    <div>
                        <div className="row">
                            <div className="col-lg-6">
                                <div>
                                    <img src="/assets/images/categories/pages.png" alt="" />
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="p-5 mt-5">
                                    <h2 className="mt-5 fw-6 text-white">Grow Your Business with TamilWeddingBook!</h2>
                                    <button className="btn btn-primary ml-5 own-family mt-5" type="submit">Create Your
                                        Account</button>
                                </div>

                            </div>

                        </div>
                        <div className="row own-dark-light ml-0">
                            <div className="col-lg-12 ">
                                <div className="col-lg-10">
                                    <div className=" p-3 own-text">
                                        <button type="button" className="btn btn-outline-primary own-btn-arrow own-family">Features
                                            <i className="fa fa-arrow-right"></i></button>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>


                </section>

            </main>

            <AuthVendorFooter />
        </>
    );
}

export default VendorLogin;