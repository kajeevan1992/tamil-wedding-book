import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import * as validateUtil from '@utilities/ValidateUtil';
import { toggleLoading } from "@store/AppSlice";
import * as vendorService from "@services/VendorService";
import { toast } from 'react-hot-toast';
import InputField from "@components/shared/InputField";
import InputFieldAddress from "@components/shared/InputFieldAddress";
import InputFieldPhone from "@components/shared/InputFieldPhone";
import Select from "react-select";
import { statusMessages } from "@utilities/CommonUtil";

export default function CreateAndInviteVendor(props) {
    const [state, setState] = useState({
        newBusiness: {
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

        errors: {}
    });

    const businessCategoryRef = useRef("");

    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type === "checkbox" ? target.checked : target.value;

        setState((currentState) => ({
            ...currentState,
            newBusiness: {
                ...currentState.newBusiness,
                [name]: value,
            },
        }));
    };

    const handleSearchChange = (selected, type) => {
        setState((currentState) => ({
            ...currentState,
            newBusiness: {
                ...currentState.newBusiness,
                [type]: selected,
            }
        }));
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        setState((currentState) => ({
            ...currentState,
            errors: {},
        }));

        let errors = {};
        let validationFlag = true;

        if (validateUtil.isEmpty(state.newBusiness.fullName)) {
            validationFlag = false;
            errors.fullName = ["Business name is required"];
        } else if (validateUtil.isLessThan(state.newBusiness.fullName, 5)) {
            errors.fullName = ["Business name must be at least 5 characters long."];
        } else if (validateUtil.isGreaterThan(state.newBusiness.fullName, 191)) {
            validationFlag = false;
            errors.fullName = [
                "Business name must not be greater than 191 characters!",
            ];
        }

        if (validateUtil.isEmpty(state.newBusiness.address)) {
            validationFlag = false;
            errors.address = ["Business Location is required"];
        } else if (validateUtil.isGreaterThan(state.newBusiness.address, 255)) {
            validationFlag = false;
            errors.address = [
                "Business Location must not be greater than 255 characters!",
            ];
        }

        // if (validateUtil.isEmpty(state.newBusiness.role)) {
        //     validationFlag = false;
        //     errors.role = ["Please choose one option"];
        // }

        if (validateUtil.isEmpty(state.newBusiness.businessCategory)) {
            validationFlag = false;
            errors.businessCategory = ["Please choose one option"];
        }

        if (validateUtil.isEmpty(state.newBusiness.email)) {
            validationFlag = false;
            errors.email = ["Email is required"];
        } else if (validateUtil.isNotEmail(state.newBusiness.email)) {
            validationFlag = false;
            errors.email = ["Invalid email address, please make sure the spelling!"];
        } else if (validateUtil.isGreaterThan(state.newBusiness.email, 255)) {
            validationFlag = false;
            errors.email = ["Email must not be greater than 255 characters!"];
        }

        if (validateUtil.isEmpty(state.newBusiness.telephone)) {
            validationFlag = false;
            errors.telephone = ["Phone number is required"];
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
            let newBusiness = state.newBusiness;
            newBusiness.role = props.app.profile.role === 'venue' ? 'supplier' : 'venue';
            newBusiness.vendorId = props.app.profile.vendor.id;
            const response = await vendorService.createAndInviteVendor(newBusiness);
            props.created(response.data.preferVendor);
            businessCategoryRef.current.clearValue();
            dispatch(toggleLoading(false));

            setState((currentState) => ({
                ...currentState,
                newBusiness: {
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
            }));

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

    return (
        <div className="row d-flex justify-content-center">
            <form
                className="auth-register-form col-12"
                action="#"
                method="POST"
                onSubmit={onSubmit}
            >
                <div className="row">
                    <div className="col-md-12">
                        <InputField
                            mbClassName="mb-3"
                            icon="bi bi-briefcase"
                            type="text"
                            selector="fullName"
                            value={state.newBusiness.fullName}
                            placeholder="Name of the business"
                            onHandleChange={handleInputChange}
                            errors={state.errors}
                        />

                        <InputFieldAddress
                            mbClassName="mb-3"
                            icon="bi bi-geo-alt"
                            placeholder="Business location"
                            selector="address"
                            onPlaceChange={(place) => {
                                setState((currentState) => ({
                                    ...currentState,
                                    newBusiness: {
                                        ...currentState.newBusiness,
                                        address: place.formatted_address,
                                        lng: place.geometry.location.lng(),
                                        lat: place.geometry.location.lat(),
                                    },
                                }));
                                // console.log(place, place.geometry.location.lng(), place.geometry.location.lat());
                            }}
                            errors={state.errors}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12 mb-3">
                        <Select
                            ref={businessCategoryRef}
                            className="select-theme"
                            isClearable={true}
                            isSearchable={true}
                            placeholder="Business category"
                            defaultValue={state.newBusiness.businessCategory}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id}
                            onChange={(option) => {
                                handleSearchChange(
                                    option !== null ? option.id : "",
                                    "businessCategory"
                                );
                            }}
                            options={props.categories}
                        />
                        {state.errors.businessCategory && (
                            <div className="invalid-feedback">
                                {state.errors.businessCategory[0]}
                            </div>
                        )}
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <InputField
                            mbClassName="mb-3"
                            icon="bi bi-envelope"
                            type="email"
                            selector="email"
                            value={state.newBusiness.email}
                            placeholder="Email"
                            onHandleChange={handleInputChange}
                            errors={state.errors}
                        />

                        <InputFieldPhone
                            mbClassName="mb-3"
                            icon="bi bi-telephone"
                            selector="telephone"
                            value={state.newBusiness.telephone}
                            placeholder="Phone number"
                            onHandleChange={(value) => {
                                setState((currentState) => ({
                                    ...currentState,
                                    newBusiness: {
                                        ...currentState.newBusiness,
                                        telephone: value,
                                    },
                                }));
                            }}
                            errors={state.errors}
                        />

                        <br />
                        <hr />

                        {/* <div className="mt-5">
															<h4>Login details</h4>
														</div>

														<InputField
															mbClassName="mb-3"
															icon="bi bi-person"
															type="text"
															selector="username"
															value={state.newBusiness.username}
															placeholder="Username"
															onHandleChange={handleInputChange}
															errors={state.errors}
														/>

														<InputFieldPassword
															mbClassName="mb-3"
															selector="password"
															value={state.newBusiness.password}
															placeholder="Password"
															onHandleChange={handleInputChange}
															errors={state.errors}
														/> */}
                    </div>
                </div>


                <div className="row">
                    <div className="col-12 d-flex justify-content-center">
                        <button
                            type="submit"
                            className="btn btn-primary mt-2 btn-sm"
                        >
                            Create & Invite Business
                        </button>
                        <button type="button" className="btn btn-secondary mt-2 btn-sm ml-2" onClick={props.cancelAction}>Cancel & Back to search</button>
                    </div>
                </div>
            </form>
        </div>
    );
}