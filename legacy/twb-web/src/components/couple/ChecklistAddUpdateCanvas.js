import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "@utilities/Modal";
import * as validateUtil from '@utilities/ValidateUtil';
import * as coupleService from '@services/CoupleService';
import { useDispatch } from "react-redux";
import { toggleLoading, authenticate } from "@store/AppSlice";
import { toast } from 'react-hot-toast';
import { formatDate, statusMessages } from "@utilities/CommonUtil";

const ChecklistAddUpdateCanvas = forwardRef((props, ref) => {
    const [state, setState] = useState({
        weddingDetails: {
            fullName: '',
            partnerName: '',
            date: '',
            guests: '',
            address: '',
            lng: '',
            lat: '',
            categories: [],
        },

        categories: [],

        errors: {}
    });

    let modal = null;
    const dispatch = useDispatch();

    useImperativeHandle(ref, () => ({
        showModal() {
            modal = new Modal('#checklistAddUpdateCanvas', {
                backdrop: true
            });

            modal.show();
        },
        hideModal() {
            modal = new Modal('#checklistAddUpdateCanvas', {
                backdrop: true
            });

            modal.hide();
        },
    }));

    const handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        setState((currentState) => ({
            ...currentState,
            weddingDetails: {
                ...currentState.weddingDetails,
                [name]: value,
            }
        }));
    }

    const handleCategoriesChange = (isCheck, categoryId) => {
        let weddingCategories = state.weddingDetails.categories
        let find = weddingCategories.indexOf(categoryId);
        if (find > -1) {
            weddingCategories.splice(find, 1)
        } else {
            weddingCategories.push(categoryId)
        }

        setState((currentState) => ({
            ...currentState,
            weddingDetails: {
                ...currentState.weddingDetails,
                categories: weddingCategories,
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

        if (validateUtil.isEmpty(state.weddingDetails.fullName)) {
            validationFlag = false;
            errors.fullName = ['Name and surname is required'];
        } else if (validateUtil.isGreaterThan(state.weddingDetails.fullName, 191)) {
            validationFlag = false;
            errors.fullName = ['Name must not be greater than 191 characters!'];
        }
        if (validateUtil.isEmpty(state.weddingDetails.partnerName)) {
            validationFlag = false;
            errors.partnerName = ['Partner name is required'];
        } else if (validateUtil.isGreaterThan(state.weddingDetails.partnerName, 191)) {
            validationFlag = false;
            errors.partnerName = ['Partner name must not be greater than 191 characters!'];
        }
        if (validateUtil.isEmpty(state.weddingDetails.date)) {
            validationFlag = false;
            errors.date = ['Wedding date is required'];
        }
        if (validateUtil.isEmpty(state.weddingDetails.guests)) {
            validationFlag = false;
            errors.guests = ['Guests is required'];
        }

        if (validateUtil.isEmpty(state.weddingDetails.address)) {
            validationFlag = false;
            errors.address = ['Address field is required'];
        } else if (validateUtil.isGreaterThan(state.weddingDetails.address, 255)) {
            validationFlag = false;
            errors.address = ['Address must not be greater than 255 characters!'];
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

            const weddingDetails = { ...state.weddingDetails };
            weddingDetails.date = formatDate(weddingDetails.date, 'YYYY-MM-DD');
            const { data } = await coupleService.updateLastStepWeddingDetails(weddingDetails);

            dispatch(toggleLoading(false));
            dispatch(authenticate(data.user))

            toast.success(data.message);
            props.onHideModal();
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
            <div className="modal" id="checklistAddUpdateCanvas" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="checklistAddUpdateCanvasLabel" >
                <div className="custom-canvas" style={{ width: '740px' }}>
                    <div className="modal-content">
                        <div className="modal-header fs-16px">
                            <div className="modal-title">Add new task</div>
                            <button className="btn p-0" onClick={props.onHideModal}>
                                <span className="bi bi-x-lg"></span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row px-3">
                                <div className="col-12">
                                    <form className="auth-register-form mt-3" action="#" method="POST" onSubmit={onSubmit}>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="mb-4">
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        value={state.weddingDetails.fullName}
                                                        id="fullName"
                                                        onChange={handleInputChange}
                                                        placeholder="Name of the task"
                                                        className="form-control own-input only-b-brdr-grey fs-24px dark-color fw-600"
                                                    />

                                                    {
                                                        state.errors.fullName &&
                                                        <div className="invalid-feedback">
                                                            {state.errors.fullName[0]}
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="mb-4">
                                                    <input
                                                        type="text"
                                                        name="partnerName"
                                                        value={state.weddingDetails.partnerName}
                                                        id="partnerName"
                                                        onChange={handleInputChange}
                                                        placeholder="Description of the task"
                                                        className="form-control own-input only-b-brdr-grey"
                                                    />

                                                    {
                                                        state.errors.partnerName &&
                                                        <div className="invalid-feedback">
                                                            {state.errors.partnerName[0]}
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="mb-4 d-flex" style={{ width: '50%' }}>
                                                    <select className="form-control mr-3" name="state">
                                                        <option className="own-search" value="">Category</option>
                                                    </select>
                                                    <select className="form-control" name="state">
                                                        <option className="own-search" value="">Start Date</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="py-2">
                                                    <button className="btn btn-primary">Create</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default ChecklistAddUpdateCanvas;