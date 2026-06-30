import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Modal } from "@utilities/Modal";
import { useDispatch } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import { toast } from 'react-hot-toast';
import { isEmpty, isGreaterThan, isLessThan } from '@utilities/ValidateUtil';
import { statusMessages } from "@utilities/CommonUtil";
import { budgetPlannerCategoryAction } from "@services/CoupleService";
import InputField from "@components/shared/InputField";
import ReactSelect from "react-select";
import { appIcons } from "@utilities/CommonUtil";

const empty = {
    id: '',
    coupleBudgetPlannerId: '',
    name: '',
    icon: '',
};
const CategoryActionModal = forwardRef((props, ref) => {
    const [state, setState] = useState({
        item: { ...empty },
        action: 'add',

        errors: {}
    });

    const iconRef = useRef(null)
    let modal = null;
    const dispatch = useDispatch();

    useImperativeHandle(ref, () => ({
        showModal(action, budgetPlanner, item) {
            console.log(action, budgetPlanner, item);
            let categoryItem = { ...empty };
            categoryItem.coupleBudgetPlannerId = budgetPlanner.id;

            if (action === 'edit') {
                categoryItem = item;
                iconRef.current.setValue({ label: item.icon, value: item.icon });

            }

            setState((currentState) => ({
                ...currentState,
                action: action,
                item: categoryItem,
                errors: {}
            }));

            modal = new Modal('#categoryActionModal', {
                backdrop: true
            });
            modal.show();

            console.log(categoryItem);
            console.log(state.item);
        },
        hideModal() {
            iconRef.current.clearValue();

            modal = new Modal('#categoryActionModal', {
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
            item: {
                ...currentState.item,
                [name]: value,
            }
        }));
    }

    const handleSearchChange = (selected, type) => {
        setState((currentState) => ({
            ...currentState,
            item: {
                ...currentState.item,
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

        if (isEmpty(state.item.name)) {
            validationFlag = false;
            errors.name = ['Name is required'];
        } else if (isLessThan(state.item.name, 2)) {
            validationFlag = false;
            errors.name = ['Name must not be less than 2 characters!'];
        } else if (isGreaterThan(state.item.name, 100)) {
            validationFlag = false;
            errors.name = ['Name must not be greater than 50 characters!'];
        }

        if (isEmpty(state.item.icon)) {
            validationFlag = false;
            errors.icon = ['Icon is required'];
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

            let item = state.item;
            item.action = state.action;
            const { data } = await budgetPlannerCategoryAction(item);

            toast.success(data.message);

            if (state.action === 'add') {
                props.onItemCreated(data.item);
            } else {
                props.onItemUpdated(data.item);
            }

            dispatch(toggleLoading(false));
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
            <div className="modal fade" id="categoryActionModal" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="categoryActionModal">
                <div className="modal-dialog couple-dashboard-step-modal">
                    <div className="modal-content">
                        <div className="modal-header fs-16px">
                            <div className="modal-title text-capitalize">{state.action} Category</div>
                            <button className="btn p-0" onClick={props.onHideModal}>
                                <span className="bi bi-x-lg"></span>
                            </button>
                        </div>
                        <div className="modal-body w-100">
                            <div className="row mr-0 ml-0 w-100">
                                <div className="col-12 w-100">
                                    <form
                                        className="auth-register-form col-12"
                                        action="#"
                                        method="POST"
                                        onSubmit={onSubmit}
                                    >
                                        <div className="mb-4">
                                            <InputField
                                                mbClassName="mb-3"
                                                type="text"
                                                selector="name"
                                                value={state.item.name}
                                                placeholder="Name"
                                                onHandleChange={handleInputChange}
                                                allBorders={true}
                                                errors={state.errors}
                                            />
                                            <div className="mb-3">
                                                <ReactSelect
                                                    ref={iconRef}
                                                    className="z-index-1000"
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    placeholder="Icon"
                                                    name="type"
                                                    defaultValue={state.item.icon}
                                                    // value={state.deal.type}
                                                    getOptionLabel={(option) => <span className={`bi ${option.label}`}></span>}
                                                    onChange={(option) => { handleSearchChange(option !== null ? option.value : '', 'icon') }}
                                                    options={appIcons.map((icon) => ({ label: icon, value: icon }))}
                                                />
                                                {
                                                    state.errors.icon &&
                                                    <div className="invalid-feedback">
                                                        {state.errors.icon[0]}
                                                    </div>
                                                }
                                            </div>
                                        </div>

                                        <hr />
                                        <div className="d-flex justify-content-end">
                                            <button type="button" onClick={props.onHideModal} className="btn btn-warning btn-sm mr-2">Cancel</button>
                                            <button type="submit" className="btn btn-primary btn-sm">{state.action === 'add' ? 'Add' : 'Update'}</button>
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

export default CategoryActionModal;