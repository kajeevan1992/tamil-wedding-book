import { useState, useEffect } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDispatch } from "react-redux";
import { toggleLoading, pushNotificationsToState } from "@store/AppSlice";
import AuthFooter from '@components/auth/AuthFooter';
import { useParams } from 'react-router-dom';
import { statusMessages } from "@utilities/CommonUtil";
import { decryptUrl } from "@utilities/CommonUtil";
import InputField from "@components/shared/InputField";
import InputFieldPhone from "@components/shared/InputFieldPhone";
import InputFieldAddress from "@components/shared/InputFieldAddress";
import Select from "react-select";
import { selectColorStyles } from "@utilities/CommonUtil";
import { isEmpty, isGreaterThan, isLessThan, isNotEmptyArray } from '@utilities/ValidateUtil';
import { addGuestByLink } from '@services/CoupleService';

const ageOptions = [
    { label: 'Adult', value: 'Adult' },
    { label: 'Child', value: 'Child' },
    { label: 'Baby', value: 'Baby' },
];

const emptyGuest = {
    fullName: '',
    companions: [],
    age: '',
    email: '',
    telephone: '',
    mobile: '',
    address: 'Sydney, Australia',
    lng: '33.8688',
    lat: '151.2093',
    companionOfId: null
};

function GuestInvitations() {
    const [state, setState] = useState({
        couple: {
            coupleId: '',
            fullName: '',
            partnerName: '',
        },
        guest: emptyGuest,
        submitted: false,

        errors: {}
    });

    let { coupleData } = useParams();

    useEffect(() => {
        let cd = decryptUrl(coupleData);
        setState((currentState) => ({
            ...currentState,
            couple: cd,
        }));
    }, []);

    const handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        setState((currentState) => ({
            ...currentState,
            guest: {
                ...currentState.guest,
                [name]: value,
            }
        }));
    }

    const addRemoveCompanion = (action, index = null) => {
        const companions = state.guest.companions ?? [];
        if (action === 'add') {
            companions.push({
                coupleWeddingGuest: {
                    fullName: ''
                }
            });
        } else {
            companions.splice(index, 1);
        }

        setState((currentState) => ({
            ...currentState,
            guest: {
                ...currentState.guest,
                companions: companions,
            }
        }));
    }

    const handleCompanionInputChange = (value, index) => {
        const companions = state.guest.companions;
        companions[index].coupleWeddingGuest.fullName = value;

        setState((currentState) => ({
            ...currentState,
            guest: {
                ...currentState.guest,
                companions: companions,
            }
        }));
    }

    const handleSearchChange = (selected, type) => {
        setState((currentState) => ({
            ...currentState,
            guest: {
                ...currentState.guest,
                [type]: selected,
            }
        }));
    }

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();

        setState((currentState) => ({
            ...currentState,
            errors: {}
        }));

        let errors = {};
        let validationFlag = true;

        if (isEmpty(state.guest.fullName)) {
            validationFlag = false;
            errors.fullName = ['Name is required'];
        } else if (isLessThan(state.guest.fullName, 3)) {
            validationFlag = false;
            errors.fullName = ['Name must not be less than 3 characters!'];
        } else if (isGreaterThan(state.guest.fullName, 191)) {
            validationFlag = false;
            errors.fullName = ['Name must not be greater than 191 characters!'];
        }

        if (isEmpty(state.guest.age)) {
            validationFlag = false;
            errors.age = ['Age is required'];
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
            console.log('herer');
            setState((currentState) => ({
                ...currentState,
                errors: {}
            }));

            dispatch(toggleLoading(true));

            let guest = state.guest;
            guest.coupleId = state.couple.coupleId;

            const { data } = await addGuestByLink(guest);

            setState((currentState) => ({
                ...currentState,
                guest: emptyGuest,
                submitted: true,
            }));

            toast.success(data.message);
            dispatch(toggleLoading(false));
        } catch (error) {
            console.log(error)
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
                <div className="col-md-8">
                    <div className="text-center my-4">
                        <NavLink to="/" end>
                            <img src="/assets/images/about/Tamil_Wedding_Book.png" alt="" className="own-pl-image auth-logo" />
                        </NavLink>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            {state.submitted ? <div className="text-center py-5">
                                <h3 className="mb-3"><span className="text-success bi bi-check-circle"></span> Thank you!</h3>
                                <p>Thank you for making it easier to plan our wedding.</p>
                            </div> : <form
                                className="auth-register-form col-12"
                                action="#"
                                method="POST"
                                onSubmit={onSubmit}
                            >
                                <div className="mb-3">
                                    <div className="row justify-content-center">
                                        <div className="col-md-8">
                                            <div className="text-center pt-4 pb-3">
                                                <h3 className="mb-3"><span className="text-success bi bi-info-circle"></span> Can you help us?</h3>
                                                <p>Please fill out the form below, so <strong>{state.couple.fullName}</strong> & <strong>{state.couple?.partnerName}</strong> can send you all the wedding details.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <InputField
                                                label="Guest Name"
                                                mbClassName="mb-2"
                                                type="text"
                                                selector="fullName"
                                                value={state.guest.fullName}
                                                placeholder="Guest full name"
                                                onHandleChange={handleInputChange}
                                                allBorders={true}
                                                errors={state.errors}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {state.guest?.companions?.map((companion, ic) => {
                                            return (
                                                <div className="row d-flex justify-content-end align-items-center mb-2 mb-mobil-1rem" key={`guest-companion-${ic}`}>
                                                    <div className="col-md-1"></div>
                                                    <div className="col-md-5 relative">
                                                        <span className="bi bi-link companion-icon companion-icon-form"></span>
                                                        <InputField
                                                            mbClassName="mb-0"
                                                            fieldClassName="p-2"
                                                            type="text"
                                                            selector={`companions.${ic}.coupleWeddingGuest.fullName`}
                                                            value={companion.coupleWeddingGuest.fullName}
                                                            placeholder="Companion full name"
                                                            onHandleChange={(e) => handleCompanionInputChange(e.target.value, ic)}
                                                            allBorders={true}
                                                            errorclassName="text-left"
                                                            errors={state.errors}
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="d-flex justify-content-start">
                                                            <div>
                                                                <button type="button" className="btn btn-link btn-sm text-info p-0 mr-2" onClick={() => addRemoveCompanion('remove', ic)}>
                                                                    <span className="bi bi-dash-circle"></span> Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {state.guest.companionOfId === null && <button type="button" onClick={() => addRemoveCompanion('add')} className="btn btn-link p-0 btn-sm text-danger">
                                        <span className="bi bi-plus-circle"></span> Add companion to this guest
                                    </button>}
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label>Age</label>
                                        <Select
                                            className="select-theme-border filter"
                                            styles={selectColorStyles}
                                            isClearable={false}
                                            isSearchable={true}
                                            placeholder="Choose"
                                            defaultValue={state.guest.age}
                                            formatOptionLabel={(option) => option.label}
                                            getOptionValue={(option) => option.value}
                                            onChange={(option) => handleSearchChange(option, 'age')}
                                            options={ageOptions}
                                        />
                                        {
                                            state.errors.age &&
                                            <div className="invalid-feedback">
                                                {state.errors.age[0]}
                                            </div>
                                        }
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-4">
                                        <InputField
                                            label="Email"
                                            mbClassName="mb-3"
                                            type="email"
                                            selector="email"
                                            value={state.guest.email}
                                            placeholder="Guest email address"
                                            onHandleChange={handleInputChange}
                                            allBorders={true}
                                            errors={state.errors}
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <InputFieldPhone
                                            label="Telephone"
                                            mbClassName="mb-3"
                                            icon="bi bi-telephone"
                                            selector="telephone"
                                            value={state.guest.telephone}
                                            placeholder="Phone number"
                                            allBorders={true}
                                            onHandleChange={(value) => {
                                                setState((currentState) => ({
                                                    ...currentState,
                                                    guest: {
                                                        ...currentState.guest,
                                                        telephone: value,
                                                    },
                                                }));
                                            }}
                                            errors={state.errors}
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <InputFieldPhone
                                            label="Mobile"
                                            mbClassName="mb-3"
                                            icon="bi bi-telephone"
                                            selector="mobile"
                                            value={state.guest.mobile}
                                            placeholder="Mobile number"
                                            allBorders={true}
                                            onHandleChange={(value) => {
                                                setState((currentState) => ({
                                                    ...currentState,
                                                    guest: {
                                                        ...currentState.guest,
                                                        mobile: value,
                                                    },
                                                }));
                                            }}
                                            errors={state.errors}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <InputFieldAddress
                                            mbClassName="mb-0"
                                            label="TOWN/CITY COUNTRY"
                                            icon="bi bi-geo-alt"
                                            placeholder="Wedding location..."
                                            selector="address"
                                            allBorders={true}
                                            onPlaceChange={(place) => {
                                                setState((currentState) => ({
                                                    ...currentState,
                                                    guest: {
                                                        ...currentState.guest,
                                                        address: place.formatted_address,
                                                        lng: place.geometry.location.lng(),
                                                        lat: place.geometry.location.lat()
                                                    }
                                                }));
                                            }}
                                            errors={state.errors}
                                        />
                                    </div>
                                </div>
                                <hr />
                                <div className="">
                                    <button type="submit" className="btn btn-primary btn-sm">Submit</button>
                                </div>
                            </form>}
                        </div>
                    </div>
                </div>

                <AuthFooter />
            </div>
        </>
    );
}

export default GuestInvitations;