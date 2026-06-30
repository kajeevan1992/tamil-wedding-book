import React, { useState } from "react";

export default function BudgetPlannerExpenses(props) {
    const [state, setState] = useState({
        payment: {},
        action: null,
        indexPayment: null,
        expense: null,
        indexExpense: null,

        errors: {}
    });

    return (
        <table className="table table-sm vertical-align-middle table-responsive">
            <thead>
                <tr>
                    <th>Expenses</th>
                    <th className="text-right">Estimated Cost</th>
                    <th className="text-right">Final Cost</th>
                    <th className="text-center">Action</th>
                </tr>
            </thead>
            <tbody className="table-sm-body">
                {props.budgetPlannerCategory?.categoryExpenses?.map((expense, indexExpense) => {
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
                                                props.onHandleInputChange(e);
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
                                                props.onCreateUpdateExpense({ ...expense }, indexExpense);
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
                                                    props.onHandleInputChange(e);
                                                }
                                            }}
                                            onBlur={(e) => {
                                                if (!e.target.value.length) {
                                                    expense.estimatedCost = 0;
                                                    props.onHandleInputChange(e);
                                                }

                                                if (expense.id) {
                                                    props.onCreateUpdateExpense({ ...expense }, indexExpense);
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
                                                    props.onHandleInputChange(e);
                                                }
                                            }}
                                            onBlur={(e) => {
                                                if (!e.target.value.length) {
                                                    expense.finalCost = 0;
                                                    props.onHandleInputChange(e);
                                                }

                                                if (expense.id) {
                                                    props.onCreateUpdateExpense({ ...expense }, indexExpense);
                                                }
                                            }}
                                        />
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="btn-group">
                                        <button type="button" className="btn dropdown-toggle no-after" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <span className="bi bi-three-dots-vertical fs-20px"></span>
                                        </button>
                                        <div className="dropdown-menu dropdown-menu-right">
                                            <button type="button" onClick={() => props.onDeleteExpense(expense, indexExpense)} className="dropdown-item">
                                                <span className="bi bi-trash text-danger"></span>
                                                &nbsp; Delete
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </React.Fragment>
                    );
                })}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={4}>
                        <button type="button" onClick={() => props.onAddNewExpense()} className="btn btn-sm btn-link text-theme px-0">
                            <span className="bi bi-plus-circle"></span> Add new expense
                        </button>
                    </td>
                </tr>
            </tfoot>
        </table>
    );
}