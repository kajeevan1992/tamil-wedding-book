import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "@utilities/Modal";
import { useDispatch } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import { toast } from 'react-hot-toast';
import { isEmpty, isGreaterThan, isLessThan } from '@utilities/ValidateUtil';
import { statusMessages, tables } from "@utilities/CommonUtil";
import { createUpdateItem } from "@services/CoupleService";
import InputField from "@components/shared/InputField";

const WeddingEventItemModal = forwardRef((props, ref) => {
    const [state, setState] = useState({
        item: {
            id: '',
            coupleWeddingEventId: 0,
            name: '',
            chairs: '',
            tableType: '',
            displayOrder: 1,
        },
        action: 'add',
        itemType: 'group',

        errors: {}
    });

    let modal = null;
    const dispatch = useDispatch();

    useImperativeHandle(ref, () => ({
        showModal(
            coupleWeddingEventId,
            action,
            item,
            itemType,
            tableType,
            displayOrder
        ) {
            modal = new Modal('#weddingEventItemModal', {
                backdrop: true
            });

            modal.show();

            setState((currentState) => ({
                ...currentState,
                action: action,
                itemType: itemType,
                item: {
                    ...currentState.item,
                    coupleWeddingEventId: coupleWeddingEventId,
                    id: action === 'edit' ? item.id : '',
                    name: action === 'edit' ? item.name : '',
                    chairs: (action === 'edit' && itemType === 'table') ? item.chairs : '',
                    tableType: (itemType === 'table' && tableType) ? tableType : (action === 'edit' && itemType === 'table') ? item.type : '',
                    displayOrder: action === 'edit' ? item.displayOrder : displayOrder,
                },
                errors: {}
            }));
        },
        hideModal() {
            modal = new Modal('#weddingEventItemModal', {
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
        } else if (isLessThan(state.item.name, 3)) {
            validationFlag = false;
            errors.name = ['Name must not be less than 3 characters!'];
        } else if (isGreaterThan(state.item.name, 191)) {
            validationFlag = false;
            errors.name = ['Name must not be greater than 191 characters!'];
        }

        if (state.itemType === 'table' && isEmpty(state.item.chairs)) {
            validationFlag = false;
            errors.chairs = ['Chairs is required'];
        } else if (state.itemType === 'table') {
            if (state.item.tableType === 'sc-one-sided-table') {
                if (state.item.chairs < 1) {
                    validationFlag = false;
                    errors.chairs = ['Selected table required minimum of 1 chairs'];
                }

                if (state.item.chairs > 50) {
                    validationFlag = false;
                    errors.chairs = ['Selected table maximum chairs capacity is 50'];
                }
            }

            if (state.item.tableType === 'sc-two-sided-table') {
                if (state.item.chairs < 4) {
                    validationFlag = false;
                    errors.chairs = ['Selected table required minimum of 4 chairs'];
                }

                if (Math.abs(state.item.chairs % 2) === 1) {
                    validationFlag = false;
                    errors.chairs = ['Selected table chairs must be multiple of 2'];
                }

                if (state.item.chairs > 50) {
                    validationFlag = false;
                    errors.chairs = ['Selected table maximum chairs capacity is 50'];
                }
            }

            if (state.item.tableType === 'sc-four-sided-table') {
                if (state.item.chairs < 4) {
                    validationFlag = false;
                    errors.chairs = ['Selected table required minimum of 4 chairs'];
                }

                if (Math.abs(state.item.chairs % 2) === 1) {
                    validationFlag = false;
                    errors.chairs = ['Selected table chairs must be multiple of 2'];
                }


                if (state.item.chairs > 50) {
                    validationFlag = false;
                    errors.chairs = ['Selected table maximum chairs capacity is 50'];
                }
            }

            if (state.item.tableType === 'sc-rounded-table') {
                if (state.item.chairs < 4) {
                    validationFlag = false;
                    errors.chairs = ['Selected table required minimum of 4 chairs'];
                }

                if (state.item.chairs > 12) {
                    validationFlag = false;
                    errors.chairs = ['Selected table maximum chairs capacity is 12'];
                }
            }
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
            item.type = state.itemType;
            item.model = props.selectedFilter.model;
            const { data } = await createUpdateItem(item);

            toast.success(data.message);

            if (state.action === 'add') {
                props.onItemCreated(data.item);
            } else {
                props.onItemUpdated(data.item);
            }

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

    return (
        <>
            <div className="modal fade" id="weddingEventItemModal" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="weddingEventItemModal">
                <div className="modal-dialog couple-dashboard-step-modal">
                    <div className="modal-content">
                        <div className="modal-header fs-16px">
                            <div className="modal-title text-capitalize">{state.action} {state.itemType}</div>
                            <button className="btn p-0" onClick={props.onHideModal}>
                                <span className="bi bi-x-lg"></span>
                            </button>
                        </div>
                        <div className="modal-body w-100">
                            <div className="row mr-0 ml-0 w-100">
                                <div className="col-12 w-100">
                                    {state.itemType === 'table' && <div className="d-flex justify-content-center gap-10">
                                        {tables.map((table, tIndex) => <div
                                            key={`table-item-${tIndex}`}
                                        >
                                            <div className="table-selector-wrapper">
                                                <button
                                                    type="button"
                                                    className="btn px-2"
                                                    style={{ opacity: '1 !important' }}
                                                    disabled={(state.item.tableType && state.item.tableType) === table.type}
                                                    onClick={() => setState((currentState) => ({
                                                        ...currentState,
                                                        item: {
                                                            ...currentState.item,
                                                            tableType: table.type,
                                                        }
                                                    }))}
                                                >
                                                    <img src={`/assets/images/seating-charts/${table.icon}`} className="c-p" />
                                                </button>
                                                {(state.item.tableType && state.item.tableType) === table.type && <span className="bi bi-check"></span>}
                                            </div>
                                        </div>)}
                                    </div>}
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
                                        </div>

                                        {state.itemType === 'table' && <div className="mb-4">
                                            <InputField
                                                mbClassName="mb-3"
                                                type="number"
                                                selector="chairs"
                                                value={state.item.chairs}
                                                placeholder="Number of Chairs"
                                                onHandleChange={handleInputChange}
                                                allBorders={true}
                                                errors={state.errors}
                                            />
                                        </div>}

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

export default WeddingEventItemModal;