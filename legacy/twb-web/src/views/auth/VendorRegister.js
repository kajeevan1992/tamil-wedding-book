import { useEffect, useRef, useState } from "react";
import * as validateUtil from "@utilities/ValidateUtil";
import * as authService from "@services/AuthService";
import { NavLink } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import InputField from "@components/shared/InputField";
import InputFieldAddress from "@components/shared/InputFieldAddress";
import InputFieldPhone from "@components/shared/InputFieldPhone";
import InputFieldPassword from "@components/shared/InputFieldPassword";
import RegisterWelcome from "@components/vendor/RegisterWelcome";
import Select from "react-select";
import { statusMessages } from "@utilities/CommonUtil";

function VendorRegister() {
  const app = useSelector(state => state.app);

  const [state, setState] = useState({
    user: {
      fullName: "",

      // address: '',
      // lng: '',
      // lat: '',
      address: "Sydney, Australia",
      lng: "33.8688",
      lat: "151.2093",

      role: "",
      businessCategory: "",
      email: "",
      telephone: "",
      username: "",
      password: "",
      acceptTermAndPrivacyPolicy: "",
    },

    venueCategories: [],
    supplierCategories: [],

    passwordHidden: true,

    errors: {},
    showWelcomePage: false,
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

  const vendorRef = useRef("");
  const businessCategoryRef = useRef("");

  const handleInputChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.type === "checkbox" ? target.checked : target.value;

    setState((currentState) => ({
      ...currentState,
      user: {
        ...currentState.user,
        [name]: value,
      },
    }));
  };

  const handleSearchChange = (selected, type) => {
    if (
      type === "role" &&
      (state.venueCategories.length < 1 || state.supplierCategories.length < 0)
    ) {
      if (app.categories.length > 0) {
        console.log("herer");
        let venueCategories = [];
        let supplierCategories = [];

        app.categories.forEach((category) => {
          if (category.type === "venue") {
            venueCategories.push(category);
          } else {
            supplierCategories.push(category);
          }
        });

        setState((currentState) => ({
          ...currentState,
          venueCategories: venueCategories,
          supplierCategories: supplierCategories,
        }));
      } else {
        alert("Something went wrong, please reload the page.");
      }

      setState((currentState) => ({
        ...currentState,
        user: {
          ...currentState.user,
          [type]: selected,
        },
      }));
    } else {
      setState((currentState) => ({
        ...currentState,
        user: {
          ...currentState.user,
          [type]: selected,
        },
      }));
    }
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
      errors.fullName = ["Business name is required"];
    } else if (validateUtil.isLessThan(state.user.fullName, 5)) {
      errors.fullName = ["Business name must be at least 5 characters long."];
    } else if (validateUtil.isGreaterThan(state.user.fullName, 191)) {
      validationFlag = false;
      errors.fullName = [
        "Business name must not be greater than 191 characters!",
      ];
    }

    if (validateUtil.isEmpty(state.user.address)) {
      validationFlag = false;
      errors.address = ["Business Location is required"];
    } else if (validateUtil.isGreaterThan(state.user.address, 255)) {
      validationFlag = false;
      errors.address = [
        "Business Location must not be greater than 255 characters!",
      ];
    }

    if (validateUtil.isEmpty(state.user.role)) {
      validationFlag = false;
      errors.role = ["Please choose one option"];
    }

    if (validateUtil.isEmpty(state.user.businessCategory)) {
      validationFlag = false;
      errors.businessCategory = ["Please choose one option"];
    }

    if (validateUtil.isEmpty(state.user.email)) {
      validationFlag = false;
      errors.email = ["Email is required"];
    } else if (validateUtil.isNotEmail(state.user.email)) {
      validationFlag = false;
      errors.email = ["Invalid email address, please make sure the spelling!"];
    } else if (validateUtil.isGreaterThan(state.user.email, 255)) {
      validationFlag = false;
      errors.email = ["Email must not be greater than 255 characters!"];
    }

    if (validateUtil.isEmpty(state.user.telephone)) {
      validationFlag = false;
      errors.telephone = ["Phone number is required"];
    }

    if (validateUtil.isEmpty(state.user.username)) {
      validationFlag = false;
      errors.username = ["Username is required"];
    } else if (validateUtil.isLessThan(state.user.username, 5)) {
      validationFlag = false;
      errors.username = ["Username must be at least 5 characters long."];
    } else if (validateUtil.isGreaterThan(state.user.email, 191)) {
      validationFlag = false;
      errors.username = ["Username must not be greater than 191 characters!"];
    }

    if (validateUtil.isEmpty(state.user.password)) {
      validationFlag = false;
      errors.password = ["Password is required"];
    } else if (validateUtil.isLessThan(state.user.password, 8)) {
      validationFlag = false;
      errors.password = ["Password must be at least 8 characters long"];
    } else if (validateUtil.isGreaterThan(state.user.password, 100)) {
      validationFlag = false;
      errors.password = ["Password must not be greater than 100 characters"];
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

  const dispatch = useDispatch();

  async function submit() {
    try {
      setState((currentState) => ({
        ...currentState,
        errors: {},
      }));

      dispatch(toggleLoading(true));
      const response = await authService.registerVendor(state.user);
      dispatch(toggleLoading(false));
      toast.success(response.data.message);
      //   navigate(`/${response.data.user.role}`);
      setState((prevState) => ({ ...prevState, showWelcomePage: true }));
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
        <div className="col-lg-12">
          <div className="row">
            <div className="d-none d-lg-flex col-lg-5 align-items-center p-0 bg-blue auth-bg">
              <div className="w-100 text-center p-0 left-auth-box">
                <div className="auth-dark-business">
                  <div className="auth-dark-business-inner">
                    <h3>Tamil Wedding Book</h3>
                    <h6>Boost your business with us</h6>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex col-lg-7 col-md-12 white-bg px-5">
              {state.showWelcomePage ? (
                <RegisterWelcome app={app} />
              ) : (
                <div className="col-12 col-lg-12 px-xl-2 mx-auto">
                  <div className="d-flex justify-content-between my-4">
                    <NavLink to="/" end>
                      <img
                        src="/assets/images/about/Tamil_Wedding_Book.png"
                        alt="Tamil Wedding Book"
                        className="own-pl-image auth-logo"
                      />
                    </NavLink>
                    <div>
                      <strong className="mr-2">Customer service </strong>
                      <a href="tel:08002061700">
                        {" "}
                        <span className="bi bi-headset"></span> 08002061700
                      </a>
                    </div>
                  </div>
                  <form
                    className="auth-register-form mt-4"
                    action="#"
                    method="POST"
                    onSubmit={onSubmit}
                  >
                    <h3 className="fw-600">
                      Try Tamil Wedding Book for free and grow your business.
                    </h3>
                    <div className="mt-5">
                      <h4>Contact details</h4>
                      <p>
                        Create your own storefront and be visible to thousands
                        of couples.
                      </p>
                    </div>
                    <div className="row">
                      <div className="col-md-8">
                        <InputField
                          mbClassName="mb-3"
                          icon="bi bi-briefcase"
                          type="text"
                          selector="fullName"
                          value={state.user.fullName}
                          placeholder="Name of the business"
                          onHandleChange={handleInputChange}
                          errors={state.errors}
                          allBorders={true}
                        />

                        <InputFieldAddress
                          mbClassName="mb-3"
                          icon="bi bi-geo-alt"
                          placeholder="Business location"
                          selector="address"
                          onPlaceChange={(place) => {
                            setState((currentState) => ({
                              ...currentState,
                              user: {
                                ...currentState.user,
                                address: place.formatted_address,
                                lng: place.geometry.location.lng(),
                                lat: place.geometry.location.lat(),
                              },
                            }));
                            // console.log(place, place.geometry.location.lng(), place.geometry.location.lat());
                          }}
                          errors={state.errors}
                          allBorders={true}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <Select
                          ref={vendorRef}
                          className="select-theme-border"
                          isClearable={true}
                          isSearchable={true}
                          placeholder="Select a group"
                          defaultValue={state.user.role}
                          getOptionLabel={(option) => option.label}
                          getOptionValue={(option) => option.name}
                          onChange={(option) => {
                            handleSearchChange(
                              option !== null ? option.name : "",
                              "role"
                            );

                            handleSearchChange(null, 'businessCategory');
                            businessCategoryRef.current.clearValue();
                          }}
                          options={[
                            {
                              name: "venue",
                              label: "Wedding Venues",
                            },
                            {
                              name: "supplier",
                              label: "Wedding Suppliers",
                            },
                          ]}
                        />
                        {state.errors.role && (
                          <div className="invalid-feedback">
                            {state.errors.role[0]}
                          </div>
                        )}
                      </div>

                      <div className="col-md-4 mb-3">
                        <Select
                          ref={businessCategoryRef}
                          className="select-theme-border"
                          isClearable={true}
                          isSearchable={true}
                          placeholder="Business category"
                          defaultValue={state.user.businessCategory}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id}
                          onChange={(option) => {
                            handleSearchChange(
                              option !== null ? option.id : "",
                              "businessCategory"
                            );
                          }}
                          options={
                            state.user.role === "venue"
                              ? state.venueCategories
                              : state.user.role === "supplier"
                                ? state.supplierCategories
                                : []
                          }
                        />
                        {state.errors.businessCategory && (
                          <div className="invalid-feedback">
                            {state.errors.businessCategory[0]}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-8">
                        <InputField
                          mbClassName="mb-3"
                          icon="bi bi-envelope"
                          type="email"
                          selector="email"
                          value={state.user.email}
                          placeholder="Email"
                          onHandleChange={handleInputChange}
                          errors={state.errors}
                          allBorders={true}
                        />

                        <InputFieldPhone
                          mbClassName="mb-3"
                          icon="bi bi-telephone"
                          selector="telephone"
                          value={state.user.telephone}
                          placeholder="Phone number"
                          onHandleChange={(value) => {
                            setState((currentState) => ({
                              ...currentState,
                              user: {
                                ...currentState.user,
                                telephone: value,
                              },
                            }));
                          }}
                          errors={state.errors}
                          allBorders={true}
                        />

                        <div className="mt-5">
                          <h4>Login details</h4>
                        </div>

                        <InputField
                          mbClassName="mb-3"
                          icon="bi bi-person"
                          type="text"
                          selector="username"
                          value={state.user.username}
                          placeholder="Username"
                          onHandleChange={handleInputChange}
                          errors={state.errors}
                          allBorders={true}
                        />

                        <InputFieldPassword
                          mbClassName="mb-3"
                          selector="password"
                          value={state.user.password}
                          placeholder="Password"
                          onHandleChange={handleInputChange}
                          errors={state.errors}
                          allBorders={true}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="form-group mb-0">
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
                              I accept Tamil Wedding book{" "}
                              <NavLink to="" end className="anchor-deco">
                                Terms of Use
                              </NavLink>{" "}
                              and{" "}
                              <NavLink to="" end className="anchor-deco">
                                Privacy Policy
                              </NavLink>
                            </small>
                          </label>
                        </div>
                      </div>
                      {state.errors.acceptTermAndPrivacyPolicy && (
                        <div className="invalid-feedback">
                          {state.errors.acceptTermAndPrivacyPolicy[0]}
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary mt-2 btn-sm"
                    >
                      Create your account
                    </button>
                  </form>

                  <div className="mt-3 mb-5">
                    <p>
                      Already have an account?
                      <NavLink to="/vendor-login" end className="text-theme fw-500">
                        &nbsp;
                        Login
                      </NavLink>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VendorRegister;
