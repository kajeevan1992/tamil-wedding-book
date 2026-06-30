import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Modal } from "@utilities/Modal";
import { useDispatch } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import { toast } from 'react-hot-toast';
import { isEmpty, isGreaterThan, isLessThan, isNotEmptyArray } from '@utilities/ValidateUtil';
import { statusMessages } from "@utilities/CommonUtil";
import { addGuest, updateGuest, actionOnCompanion } from "@services/CoupleService";
import InputField from "@components/shared/InputField";
import InputFieldPhone from "@components/shared/InputFieldPhone";
import InputFieldAddress from "@components/shared/InputFieldAddress";
import GuestInviteByLink from "@components/couple/guest-list/InviteByLink";
import UploadBySpreadsheet from "@components/couple/guest-list/UploadBySpreadsheet";
import Select from "react-select";
import { selectColorStyles } from "@utilities/CommonUtil";

const ageOptions = [
    { label: 'Adult', value: 'Adult' },
    { label: 'Child', value: 'Child' },
    { label: 'Baby', value: 'Baby' },
];

const emptyGuest = {
    // group: '',
    fullName: '',
    companions: [],
    age: '',
    invitedTo: [],
    email: '',
    telephone: '',
    mobile: '',
    address: 'Sydney, Australia',
    lng: '33.8688',
    lat: '151.2093',
    companionOfId: null
};

const WeddingGuestModal = forwardRef((props, ref) => {
    const [state, setState] = useState({
        guest: {},
        // groups: {},
        action: 'add',
        isMajorAction: false,

        errors: {}
    });

    let modal = null;
    const invitationRef = useRef([]);
    const ageRef = useRef(null);
    // const groupRef = useRef(null);

    const dispatch = useDispatch();

    useImperativeHandle(ref, () => ({
        showModal(action, guest) {
            modal = new Modal('#weddingGuestModal', {
                backdrop: true
            });

            modal.show();

            initData(action, guest);
        },
        hideModal() {
            document.getElementById('guest-action-model-form').click();
            invitationRef.current.clearValue();
            ageRef.current.clearValue();
            // groupRef.current.clearValue();
            modal = new Modal('#weddingGuestModal', {
                backdrop: true
            });

            modal.hide();
        },
    }));

    const initData = (action, guest) => {
        console.log(guest);
        let guestData = { ...emptyGuest };

        if (action === 'edit') {
            guestData = { ...guest };
            let invitedTo = [];

            props.weddingEvents.forEach(we => {
                we.coupleWeddingEventGuests.forEach(weg => {
                    if (weg.coupleWeddingGuestId === guest.id) {
                        invitedTo.push({ id: we.id, name: we.name });
                    }
                });
            });

            guestData.invitedTo = invitedTo;

            // let guestGroup = props.weddingGroups.find(wg => wg.id === guestData.coupleWeddingEventGroupId);
            // if (guestGroup) {
            //     guestData.group = { name: guestGroup.name, id: guestGroup.id };
            // }

            setTimeout(() => {
                invitationRef.current.setValue(guestData.invitedTo);
                ageRef.current.setValue({ label: guestData.age, value: guestData.age },);
                // groupRef.current.setValue(guestData.group);
            }, 200);
        } else {
            let invitedTo = [];
            invitedTo.push({ id: props.selectedEvent.id, name: props.selectedEvent.name });
            guestData.invitedTo = invitedTo;

            setTimeout(() => {
                invitationRef.current.setValue(guestData.invitedTo);
                // groupRef.current.setValue(guestData.group);
            }, 200);
        }

        setState((currentState) => ({
            ...currentState,
            action: action,
            guest: guestData,
            errors: {}
        }));
    }

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

        // if (isEmpty(state.guest.group)) {
        //     validationFlag = false;
        //     errors.group = ['Group is required'];
        // }

        if (isNotEmptyArray(state.guest.invitedTo) === false) {
            validationFlag = false;
            errors.invitedTo = ['You must select at least 1 event'];
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
            setState((currentState) => ({
                ...currentState,
                errors: {}
            }));

            dispatch(toggleLoading(true));

            let response = {};
            let guest = state.guest;
            guest.coupleId = props.app.profile.couple.id;

            if (state.action === 'add') {
                response = await addGuest(guest);
                let count = guest.companions.length + 1;
                props.onGuestAdded(state.guest.invitedTo, count, response.data.guest);
            } else if (state.action === 'edit') {
                response = await updateGuest(guest);
                props.onMajorAction();
            }

            toast.success(response.data.message);
            dispatch(toggleLoading(false));

            props.onHideModal();
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

    const otherActionOnCompanion = async (action, index, companion) => {
        if (action === 'edit') {
            initData(action, companion.coupleWeddingGuest);
            return;
        } else {
            try {
                dispatch(toggleLoading(true));

                const { data } = await actionOnCompanion({ id: companion.coupleWeddingGuest.id, action: action });
                toast.success(data.message);

                state.guest.companions.splice(index, 1);
                dispatch(toggleLoading(false));
                if (action === 'delete') {
                    props.onCompanionDeleted(companion);
                }

                setState((currentState) => ({
                    ...currentState,
                    isMajorAction: true
                }));
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
    }

    return (
        <>
            <div className="modal fade" id="weddingGuestModal" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="weddingGuestModal">
                <div className="modal-dialog modal-lg couple-dashboard-step-modal">
                    <div className="modal-content">
                        <div className="modal-header fs-16px">
                            <div className="modal-title">
                                <span className="text-capitalize">{state.action}</span> Guest
                            </div>
                            <button className="btn p-0" onClick={() => props.onHideModal(state.isMajorAction)}>
                                <span className="bi bi-x-lg"></span>
                            </button>
                        </div>
                        {Object.keys(state.guest).length > 0 && <div className="modal-body w-100">
                            <div className="row mr-0 ml-0 w-100">
                                <div className="col-12 w-100">
                                    <ul className={`nav nav-tabs justify-content-center ${state.action === 'edit' ? 'hidden' : ''}`} id="guestActionModalTab">
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link active" id="guest-action-model-form" data-toggle="tab" data-target="#guest-action-model-form-content" type="button" role="tab" aria-controls="guest-action-model-form-content" aria-selected="true">
                                                <span className="bi bi-person-add fs-20px"></span> <br />
                                                <span className="fs-13px">Add guest</span>
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="guest-action-model-invite" data-toggle="tab" data-target="#guest-action-model-invite-content" type="button" role="tab" aria-controls="guest-action-model-invite-content" aria-selected="true">
                                                <span className="bi bi-send fs-20px"></span> <br />
                                                <span className="fs-13px">Invite by link</span>
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="guest-action-model-spreadsheet" data-toggle="tab" data-target="#guest-action-model-spreadsheet-content" type="button" role="tab" aria-controls="guest-action-model-spreadsheet-content" aria-selected="false">
                                                <span className="bi bi-file-earmark-spreadsheet fs-20px"></span> <br />
                                                <span className="fs-13px">Import spreadsheet</span>
                                            </button>
                                        </li>
                                    </ul>
                                    <div className="tab-content mt-3" id="guestActionModalTabContent">
                                        <div className="tab-pane fade show active" id="guest-action-model-form-content">
                                            <form
                                                className="auth-register-form col-12"
                                                action="#"
                                                method="POST"
                                                onSubmit={onSubmit}
                                            >
                                                <div className="mb-3">
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
                                                                        {companion.id ? <input type="text" className="form-control own-input p-2 no-b-opacity-1" value={companion.coupleWeddingGuest.fullName} disabled /> : <InputField
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
                                                                        />}
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <div className="d-flex justify-content-start">
                                                                            {companion.id ? <div>
                                                                                <button type="button" className="btn btn-link btn-sm text-info p-0 mr-2" onClick={() => otherActionOnCompanion('remove', ic, companion)}>
                                                                                    <span className="bi bi-dash-circle"></span> Remove
                                                                                </button>
                                                                                <button type="button" className="btn btn-link btn-sm text-danger p-0 mr-2" onClick={() => otherActionOnCompanion('delete', ic, companion)}>
                                                                                    <span className="bi bi-trash"></span> Delete
                                                                                </button>
                                                                                <button type="button" className="btn btn-link btn-sm text-success p-0 mr-2" onClick={() => otherActionOnCompanion('edit', ic, companion)}>
                                                                                    <span className="bi bi-pencil"></span> Edit
                                                                                </button>
                                                                            </div> : <div>
                                                                                <button type="button" className="btn btn-link btn-sm text-info p-0 mr-2" onClick={() => addRemoveCompanion('remove', ic)}>
                                                                                    <span className="bi bi-dash-circle"></span> Remove
                                                                                </button>
                                                                            </div>}
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
                                                            ref={ageRef}
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
                                                    {/* <div className="col-md-6">
                                                        <label>Group</label>
                                                        <Select
                                                            ref={groupRef}
                                                            className="select-theme-border filter"
                                                            styles={selectColorStyles}
                                                            isClearable={false}
                                                            isSearchable={true}
                                                            placeholder="Choose"
                                                            defaultValue={state.guest.group}
                                                            formatOptionLabel={(option) => option.name}
                                                            getOptionValue={(option) => option.id}
                                                            onChange={(option) => handleSearchChange(option, 'group')}
                                                            options={props.weddingGroups.map((opt) => ({ name: opt.name, id: opt.id }))}
                                                        />
                                                        {
                                                            state.errors.group &&
                                                            <div className="invalid-feedback">
                                                                {state.errors.group[0]}
                                                            </div>
                                                        }
                                                    </div> */}
                                                </div>
                                                <div className="mb-3">
                                                    <label>Invite to (What to do with old guests)</label>
                                                    <Select
                                                        ref={invitationRef}
                                                        className="select-theme-border filter no-search"
                                                        isMulti
                                                        styles={selectColorStyles}
                                                        isClearable={false}
                                                        name="invitedTo"
                                                        isSearchable={false}
                                                        placeholder="Choose Event"
                                                        defaultValue={state.guest.invitedTo}
                                                        formatOptionLabel={(option) => option.name}
                                                        getOptionValue={(option) => option.id}
                                                        onChange={(option) => handleSearchChange(option, 'invitedTo')}
                                                        options={props.weddingEvents.map((opt) => ({ name: opt.name, id: opt.id }))}
                                                    />
                                                    {
                                                        state.errors.invitedTo &&
                                                        <div className="invalid-feedback">
                                                            {state.errors.invitedTo[0]}
                                                        </div>
                                                    }
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
                                                <div className="d-flex justify-content-end">
                                                    <button type="button" onClick={() => props.onHideModal(state.isMajorAction)} className="btn btn-warning btn-sm mr-2">Cancel</button>
                                                    <button type="submit" className="btn btn-primary btn-sm">{state.action === 'edit' ? 'Update' : 'Add'}</button>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="tab-pane fade" id="guest-action-model-invite-content" role="tabpanel" aria-labelledby="guest-action-model-invite-tab">
                                            <GuestInviteByLink
                                                app={props.app}
                                                inviteByLinkUrl={props.inviteByLinkUrl}
                                            />
                                        </div>
                                        <div className="tab-pane fade" id="guest-action-model-spreadsheet-content">
                                            <UploadBySpreadsheet
                                                app={props.app}
                                                onHideWithMajorAction={() => props.onHideModal(true)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        </>
    );
});

export default WeddingGuestModal;