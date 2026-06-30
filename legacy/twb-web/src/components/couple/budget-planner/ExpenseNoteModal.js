import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "@utilities/Modal";
import { isGreaterThan } from '@utilities/ValidateUtil';
import TextArea from "@components/shared/TextArea";

const ExpenseNoteModal = forwardRef((props, ref) => {
    const [state, setState] = useState({
        item: {
            id: '',
            note: '',
        },
        index: 0,

        errors: {}
    });

    let modal = null;

    useImperativeHandle(ref, () => ({
        showModal(item, index) {
            modal = new Modal('#expenseNoteModal', {
                backdrop: true
            });

            modal.show();

            setState((currentState) => ({
                ...currentState,
                item: {
                    ...item,
                    note: item.note ? item.note : '',
                },
                index: index,
                errors: {}
            }));
        },
        hideModal() {
            modal = new Modal('#expenseNoteModal', {
                backdrop: true
            });

            modal.hide();
        },
    }));

    const handleInputChange = (e) => {
        setState((currentState) => ({
            ...currentState,
            item: {
                ...currentState.item,
                'note': e.target.value,
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

        if (isGreaterThan(state.item.note, 250)) {
            validationFlag = false;
            errors.note = ['Note must not be greater than 250 characters!'];
        }

        props.onHideModal();

        if (!validationFlag) {
            setState((currentState) => ({
                ...currentState,
                errors: errors
            }));
        } else {
            props.onUpdateNote(state.item, state.index);
        }
    }

    return (
        <>
            <div className="modal fade" id="expenseNoteModal" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="expenseNoteModal">
                <div className="modal-dialog  couple-dashboard-step-modal">
                    <div className="modal-content">
                        <div className="modal-header fs-16px">
                            <div className="modal-title text-capitalize">{state.item.name} Note</div>
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
                                            <TextArea
                                                mbClassName="mb-3"
                                                type="text"
                                                selector="note"
                                                value={state.item.note}
                                                placeholder="Enter note..."
                                                onHandleChange={handleInputChange}
                                                allBorders={true}
                                                errors={state.errors}
                                            />
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

export default ExpenseNoteModal;