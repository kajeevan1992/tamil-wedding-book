import CategoryHeader from "@components/couple/budget-planner/CategoryHeader";
import React, { useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ExpensePaymentModal from "@components/couple/budget-planner/ExpensePaymentModal";
import ExpenseNoteModal from "@components/couple/budget-planner/ExpenseNoteModal";
import CurrencyFormat from "@components/shared/CurrencyFormat";
import { convertToNumber } from "@utilities/CommonUtil";
import moment from "moment";

function Category() {
    const {
        app,
        category,
        onShowCategoryActionModal,
        onDeleteCategory,
        onAddNewExpense,
        onHandleInputChange,
        onCreateUpdateExpense,
        onDeleteExpense,
        onAddPayment,
        onUpdatePayment,
        onDeleteExpensePayment,
        generatingPdf,
    } = useOutletContext();

    const [state, setState] = useState({
        selectedPayment: null,
        errors: {}
    });

    const toggleSelectedPayment = (payment) => {
        setState((currentState) => ({
            ...currentState,
            selectedPayment: payment
        }));
    }

    //? Category Payment Modal
    const expensePaymentModal = useRef(null);
    const showExpensePaymentModal = (action = 'add', payment = null, indexPayment = null, expense, indexExpense) => {
        expensePaymentModal.current.showModal(
            action,
            payment,
            indexPayment,
            expense,
            indexExpense,
        );
    }
    const hideExpensePaymentModal = () => {
        expensePaymentModal.current.hideModal();
    }

    //? Category Payment Note Modal
    const expenseNoteModal = useRef(null);
    const showExpenseNoteModal = (item, index) => {
        expenseNoteModal.current.showModal(
            item,
            index,
        );
    }
    const hideExpenseNoteModal = () => {
        expenseNoteModal.current.hideModal();
    }

    //? Calculations 
    const sumOfPayments = (payments) => {
        let total = 0.00;
        payments?.forEach(payment => {
            total += payment.paid ? convertToNumber(payment.amount) : 0.00;
        });

        return (<CurrencyFormat
            value={total.toFixed(2)}
        />);
    }
    const totalOf = (type) => {
        let total = 0.00;
        category?.categoryExpenses.forEach(expense => {
            total += convertToNumber(expense[type]);
        });

        return (<CurrencyFormat
            value={total.toFixed(2)}
        />);
    }
    const sumeOfAllPyaments = (type) => {
        let total = 0.00;
        category?.categoryExpenses.forEach(expense => {
            expense.payments.forEach(payment => {
                total += convertToNumber(payment.amount);
            });
        });

        return (<CurrencyFormat
            value={total.toFixed(2)}
        />);
    }

    return (
        <div className="col-md-12 mt-11px">
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <CategoryHeader
                            category={category}
                            estimatedCost={totalOf('estimatedCost')}
                            finalCost={totalOf('finalCost')}
                            onShowCategoryActionModal={() => onShowCategoryActionModal()}
                            onDeleteCategory={() => onDeleteCategory()}
                            generatingPdf={generatingPdf}
                        />

                        <div className="col-12 mt-5">
                            <table className="table vertical-align-middle table-responsive">
                                <thead>
                                    <tr>
                                        <th>Expenses</th>
                                        <th className="text-right">Estimated Cost</th>
                                        <th className="text-right">Final Cost</th>
                                        <th className="text-right">Paid</th>
                                        <th className="text-center">Note</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {category?.categoryExpenses.map((expense, indexExpense) => {
                                        return (
                                            <React.Fragment key={`expense-${indexExpense}`}>
                                                <tr>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={expense.name}
                                                            className="hvr-fcs-b-1 no-focus b-0"
                                                            placeholder="Expense Name"
                                                            style={{ width: `${expense.name.length ? expense.name.length + 1 : 13}ch` }}
                                                            onChange={(e) => {
                                                                if (e.target.value.length <= 30) {
                                                                    expense.name = e.target.value;
                                                                    onHandleInputChange(e);
                                                                }
                                                            }}
                                                            onBlur={(e) => {
                                                                if (e.target.value.length < 3) {
                                                                    setState((currentState) => ({
                                                                        ...currentState,
                                                                        errors: {
                                                                            ...currentState.errors,
                                                                            [`name.${indexExpense}`]: [
                                                                                'Min 3 characters!.'
                                                                            ]
                                                                        }
                                                                    }))
                                                                } else {
                                                                    let errors = state.errors;
                                                                    delete errors[`name.${indexExpense}`];
                                                                    setState((currentState) => ({
                                                                        ...currentState,
                                                                        errors: errors
                                                                    }));

                                                                    onCreateUpdateExpense({ ...expense }, indexExpense);
                                                                }
                                                            }}
                                                        />
                                                        {
                                                            state.errors[`name.${indexExpense}`] &&
                                                            <small className="invalid-feedback">
                                                                {state.errors[`name.${indexExpense}`][0]}
                                                            </small>
                                                        }
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center justify-content-end gap-4">
                                                            <span>£</span>
                                                            <input
                                                                type="number"
                                                                name="estimatedCost"
                                                                value={expense.estimatedCost}
                                                                className="hvr-fcs-b-1 no-counter no-focus b-0 text-right"
                                                                style={{ width: `${expense.estimatedCost.length ? expense.estimatedCost.length + 1 : 2}ch` }}
                                                                onChange={(e) => {
                                                                    if (e.target.value >= 0 && e.target.value <= 1000000000) {
                                                                        expense.estimatedCost = e.target.value;
                                                                        onHandleInputChange(e);
                                                                    }
                                                                }}
                                                                onBlur={(e) => {
                                                                    if (!e.target.value.length) {
                                                                        expense.estimatedCost = 0;
                                                                        onHandleInputChange(e);
                                                                    }

                                                                    if (expense.id) {
                                                                        onCreateUpdateExpense({ ...expense }, indexExpense);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center justify-content-end gap-4">
                                                            <span>£</span>
                                                            <input
                                                                type="number"
                                                                name="finalCost"
                                                                value={expense.finalCost}
                                                                className="hvr-fcs-b-1 no-counter no-focus b-0 text-right"
                                                                style={{ width: `${expense.finalCost.length ? expense.finalCost.length + 1 : 2}ch` }}
                                                                onChange={(e) => {
                                                                    if (e.target.value >= 0 && e.target.value <= 1000000000) {
                                                                        expense.finalCost = e.target.value;
                                                                        onHandleInputChange(e);
                                                                    }
                                                                }}
                                                                onBlur={(e) => {
                                                                    if (!e.target.value.length) {
                                                                        expense.finalCost = 0;
                                                                        onHandleInputChange(e);
                                                                    }

                                                                    if (expense.id) {
                                                                        onCreateUpdateExpense({ ...expense }, indexExpense);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="text-right">
                                                        <div className="d-flex align-items-center justify-content-end">
                                                            <button type="button" onClick={() => toggleSelectedPayment(state.selectedPayment === expense.id ? null : expense.id)} className="btn btn-sm p-0 text-no-wrap">
                                                                <span className={`bi bi-eye${state.selectedPayment === expense.id ? '-slash' : ''} text-danger`}></span> {sumOfPayments(expense?.payments)}
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <button type="button" onClick={() => showExpenseNoteModal(expense, indexExpense)} className="btn btn-sm">
                                                            <span className="bi bi-pen fs-20px"></span>
                                                        </button>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="btn-group">
                                                            <button type="button" className="btn dropdown-toggle no-after" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                <span className="bi bi-three-dots-vertical fs-20px"></span>
                                                            </button>
                                                            <div className="dropdown-menu dropdown-menu-right">
                                                                <button type="button" onClick={() => onDeleteExpense(expense, indexExpense)} className="dropdown-item">
                                                                    <span className="bi bi-trash text-danger"></span>
                                                                    &nbsp; Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {state.selectedPayment === expense.id && <tr>
                                                    <td colSpan={6} className="pt-0 bg-light">
                                                        <table className="table table-sm">
                                                            <tbody>
                                                                <tr className="no-bt">
                                                                    <th className="text-center ">No.</th>
                                                                    <th className="text-center ">Amount</th>
                                                                    <th className="">Detail</th>
                                                                    <th className="text-center ">Action</th>
                                                                </tr>
                                                                {expense?.payments.map((payment, indexPayment) => <tr key={`payment-${indexPayment}`}>
                                                                    <td className="text-center text-danger">#{indexPayment + 1}</td>
                                                                    <th className="text-center">£ {payment.amount} </th>
                                                                    <td>
                                                                        <small>
                                                                            {payment.paid ? <span className="text-success">Paid</span> : <span className="text-danger">Pending</span>} <br />
                                                                            {payment.paid ? <span>{moment(payment.paymentDate).format('DD/MM/YYYY')}</span> : <span> Due on {moment(payment.dueDate).format('DD/MM/YYYY')}</span>} <br />
                                                                            {payment.paidBy && <span>By: {payment.paidBy}</span>} <br />
                                                                        </small>
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <div className="btn-group">
                                                                            <button type="button" className="btn dropdown-toggle no-after" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                <span className="bi bi-three-dots-vertical fs-20px"></span>
                                                                            </button>
                                                                            <div className="dropdown-menu dropdown-menu-right">
                                                                                <button type="button" onClick={() => showExpensePaymentModal('edit', payment, indexPayment, expense, indexExpense)} className="dropdown-item">
                                                                                    <span className="bi bi-pencil text-success"></span>
                                                                                    &nbsp; Edit
                                                                                </button>
                                                                                <button type="button" onClick={() => onDeleteExpensePayment(payment, indexExpense, indexPayment)} className="dropdown-item">
                                                                                    <span className="bi bi-trash text-danger"></span>
                                                                                    &nbsp; Delete
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>)}
                                                            </tbody>
                                                            <tfoot>
                                                                <tr>
                                                                    <td colSpan={4} className="text-center vertical-middle">
                                                                        <button type="button" onClick={() => showExpensePaymentModal('add', null, null, expense, indexExpense)} className="btn btn-sm btn-outline-primary mt-3">
                                                                            <span className="bi bi-plus"></span>Add Paymnet
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                    </td>
                                                </tr>}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    {!generatingPdf && <tr>
                                        <td colSpan={6}>
                                            <button type="button" onClick={() => onAddNewExpense()} className="btn btn-sm btn-link text-theme px-0">
                                                <span className="bi bi-plus-circle"></span> Add new expense
                                            </button>
                                        </td>
                                    </tr>}
                                    <tr>
                                        <th>Total</th>
                                        <th className="text-right">{totalOf('estimatedCost')}</th>
                                        <th className="text-right text-success">{totalOf('finalCost')}</th>
                                        <th className="text-right">{sumeOfAllPyaments()}</th>
                                        <th className="text-right"></th>
                                        <th>&nbsp;</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <ExpensePaymentModal
                app={app}
                ref={expensePaymentModal}
                onHideModal={() => hideExpensePaymentModal()}
                onItemCreated={(item, indexExpense) => onAddPayment(item, indexExpense)}
                onItemUpdated={(item, indexExpense, indexPayment) => onUpdatePayment(item, indexExpense, indexPayment)}
            />

            <ExpenseNoteModal
                app={app}
                ref={expenseNoteModal}
                onHideModal={() => hideExpenseNoteModal()}
                onUpdateNote={(item, index) => onCreateUpdateExpense(item, index)}
            />
        </div>
    );
}

export default Category;