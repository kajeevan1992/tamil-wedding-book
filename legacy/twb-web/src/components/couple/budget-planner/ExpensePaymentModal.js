import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "@utilities/Modal";
import { useDispatch } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import { toast } from 'react-hot-toast';
import { isEmpty, isGreaterThan } from '@utilities/ValidateUtil';
import { statusMessages, convertToNumber, convertDateToObject } from "@utilities/CommonUtil";
import { createUpdateExpensePayment } from "@services/CoupleService";
import InputField from "@components/shared/InputField";
import InputOption from "@components/shared/InputOption";
import InputFieldDate from "@components/shared/InputFieldDate";

const empty = {
    id: '',
    amount: '',
    paid: true,
    paymentDate: '',
    dueDate: '',
    paidBy: '',
    paymentMethod: '',
};
const ExpensePaymentModal = forwardRef((props, ref) => {
    const [state, setState] = useState({
        payment: {},
        action: null,
        indexPayment: null,
        expense: null,
        indexExpense: null,

        errors: {}
    });

    let modal = null;
    const dispatch = useDispatch();

    useImperativeHandle(ref, () => ({
        showModal(
            action,
            payment,
            indexPayment,
            expense,
            indexExpense
        ) {
            modal = new Modal('#expensePaymentModal', {
                backdrop: true
            });

            modal.show();

            setState((currentState) => ({
                ...currentState,
                payment: action === 'edit' ? payment : { ...empty },
                action: action,
                indexPayment: indexPayment,
                expense: expense,
                indexExpense: indexExpense,
                errors: {}
            }));
        },
        hideModal() {
            modal = new Modal('#expensePaymentModal', {
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
            payment: {
                ...currentState.payment,
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

        if (isEmpty(state.payment.amount)) {
            validationFlag = false;
            errors.amount = ['Amount is required'];
        } else if (convertToNumber(state.payment.amount) < 0) {
            validationFlag = false;
            errors.amount = ['Price must not be less than 0!'];
        } else if (convertToNumber(state.payment.amount) === 0) {
            validationFlag = false;
            errors.amount = ['Price must be greater than 0!'];
        } else if (convertToNumber(state.payment.amount) > 1000000000) {
            validationFlag = false;
            errors.amount = ['Price must not be greater than 1000000000!'];
        }

        if (state.payment.paid && isEmpty(state.payment.paymentDate)) {
            validationFlag = false;
            errors.paymentDate = ['Payment date is required'];
        }

        if (!state.payment.paid && isEmpty(state.payment.dueDate)) {
            validationFlag = false;
            errors.dueDate = ['Due date is required'];
        }

        if (isGreaterThan(state.payment.paidBy, 30)) {
            validationFlag = false;
            errors.paidBy = ['Paid by must not be greater than 30 characters!'];
        }

        if (isGreaterThan(state.payment.paymentMethod, 50)) {
            validationFlag = false;
            errors.paymentMethod = ['Payment method must not be greater than 50 characters!'];
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

            let payment = state.payment;
            payment.action = state.action;
            if (state.action === 'add') {
                payment.expenseId = state.expense.id;
            }
            const { data } = await createUpdateExpensePayment(payment);

            toast.success(data.message);

            if (state.action === 'add') {
                props.onItemCreated(data.payment, state.indexExpense);
            } else {
                props.onItemUpdated(data.payment, state.indexExpense, state.indexPayment);
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
            <div className="modal fade" id="expensePaymentModal" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="expensePaymentModal">
                <div className="modal-dialog  couple-dashboard-step-modal">
                    <div className="modal-content">
                        <div className="modal-header fs-16px">
                            <div className="modal-title text-capitalize">{state.action} Payment {state.action === 'add' ? 'to' : 'of'} {state.expense?.name}</div>
                            <button className="btn p-0" onClick={props.onHideModal}>
                                <span className="bi bi-x-lg"></span>
                            </button>
                        </div>
                        <div className="modal-body w-100">
                            <div className="row mr-0 ml-0 w-100">
                                <div className="col-12 w-100">
                                    {state.action && <form
                                        className="auth-register-form col-12"
                                        action="#"
                                        method="POST"
                                        onSubmit={onSubmit}
                                    >
                                        <div className="mb-4">
                                            <div className="row">
                                                <InputField
                                                    mbClassName="col-sm-8 mb-4"
                                                    type="number"
                                                    selector="amount"
                                                    value={state.payment.amount}
                                                    placeholder="Amount"
                                                    onHandleChange={(e) => {
                                                        if (e.target.value >= 0 && e.target.value <= 1000000000) {
                                                            handleInputChange(e);
                                                        }
                                                    }}
                                                    allBorders={true}
                                                    errors={state.errors}
                                                />

                                                <InputOption
                                                    mbClassName="col-sm-4 mb-4 mt-2"
                                                    type="checkbox"
                                                    label="Paid"
                                                    selector="paid"
                                                    labelClassName="ml-1 mt-3px"
                                                    value={!state.payment.paid}
                                                    checked={state.payment.paid}
                                                    onHandleChange={handleInputChange}
                                                    errors={state.errors}
                                                />

                                                <InputFieldDate
                                                    mbClassName="col-md-6 mb-4"
                                                    label="Payment Date"
                                                    selected={(state.action === 'edit' && state.payment.paymentDate) ? convertDateToObject(state.payment.paymentDate) : state.payment.paymentDate ? state.payment.paymentDate : ''}
                                                    selector="paymentDate"
                                                    format="yyyy-MM-dd"
                                                    onHandleChange={(date) => {
                                                        setState((currentState) => ({
                                                            ...currentState,
                                                            payment: {
                                                                ...currentState.payment,
                                                                paymentDate: date,
                                                            }
                                                        }));
                                                    }}
                                                    placeholder="Payment Date"
                                                    allBorders={true}
                                                    errors={state.errors}
                                                />

                                                <InputFieldDate
                                                    mbClassName="col-md-6 mb-4"
                                                    label="Due Date"
                                                    selected={(state.action === 'edit' && state.payment.dueDate) ? convertDateToObject(state.payment.dueDate) : state.payment.dueDate ? state.payment.dueDate : ''}
                                                    selector="dueDate"
                                                    format="yyyy-MM-dd"
                                                    onHandleChange={(date) => {
                                                        setState((currentState) => ({
                                                            ...currentState,
                                                            payment: {
                                                                ...currentState.payment,
                                                                dueDate: date,
                                                            }
                                                        }));
                                                    }}
                                                    placeholder="Due Date"
                                                    allBorders={true}
                                                    errors={state.errors}
                                                />

                                                {/* <InputFieldDate
                                                    mbClassName="col-md-6 mb-4"
                                                    label="Due Date"
                                                    selected={state.action === 'edit' && state.payment.dueDate ? convertDateToObject(state.payment.dueDate) : state.payment.dueDate ? state.payment.dueDate : ''}
                                                    selector="dueDate"
                                                    format="yyyy-MM-dd"
                                                    onHandleChange={(date) => {
                                                        setState((currentState) => ({
                                                            ...currentState,
                                                            payment: {
                                                                ...currentState.payment,
                                                                dueDate: date,
                                                            }
                                                        }));
                                                    }}
                                                    placeholder="Due Date"
                                                    allBorders={true}
                                                    errors={state.errors}
                                                /> */}
                                                {/* <InputField
                                                    mbClassName="col-md-6 mb-4"
                                                    label="Payment Date"
                                                    type="date"
                                                    selector="paymentDate"
                                                    value={state.payment.paymentDate ? state.payment.paymentDate : ''}
                                                    onHandleChange={handleInputChange}
                                                    allBorders={true}
                                                    errors={state.errors}
                                                /> */}

                                                {/* <InputField
                                                    mbClassName="col-md-6 mb-4"
                                                    label="Due Date"
                                                    type="date"
                                                    selector="dueDate"
                                                    value={state.payment.dueDate}
                                                    onHandleChange={handleInputChange}
                                                    allBorders={true}
                                                    errors={state.errors}
                                                /> */}

                                                <InputField
                                                    mbClassName="col-sm-6 mb-4"
                                                    label="Paid By"
                                                    type="text"
                                                    selector="paidBy"
                                                    value={state.payment.paidBy}
                                                    placeholder="Name"
                                                    onHandleChange={handleInputChange}
                                                    allBorders={true}
                                                    errors={state.errors}
                                                />

                                                <InputField
                                                    mbClassName="col-sm-6 mb-4"
                                                    label="Payment Method"
                                                    type="text"
                                                    selector="paymentMethod"
                                                    value={state.payment.paymentMethod}
                                                    placeholder="Ex. Payoneer"
                                                    onHandleChange={handleInputChange}
                                                    allBorders={true}
                                                    errors={state.errors}
                                                />
                                            </div>
                                        </div>

                                        <hr />
                                        <div className="d-flex justify-content-end">
                                            <button type="button" onClick={props.onHideModal} className="btn btn-warning btn-sm mr-2">Cancel</button>
                                            <button type="submit" className="btn btn-primary btn-sm">{state.action === 'add' ? 'Add' : 'Update'}</button>
                                        </div>
                                    </form>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default ExpensePaymentModal;