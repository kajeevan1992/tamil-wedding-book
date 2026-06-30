import moment from "moment";
import { useRef, useState } from "react";
import CurrencyFormat from "@components/shared/CurrencyFormat";
import { convertToNumber } from "@utilities/CommonUtil";
import ExpensePaymentModal from "@components/couple/budget-planner/ExpensePaymentModal";

function Payments(props) {
    const [type, setType] = useState('all');
    const [categoryIndex, setCategoryIndex] = useState(null);

    // useEffect(() => {
    //     // let all = [];
    //     // props.budgetPlanner.budgetPlannerCategories.forEach(category => {
    //     //     category.
    //     // });
    //     // if (props.budgetPlanner) {
    //     //     state[0].all = props.budgetPlanner;
    //     //     state[0].paid = props.budgetPlanner.filter(budget => budget.status === 'paid');
    //     //     state[0].pending = props.budgetPlanner.filter(budget => budget.status === 'pending');
    //     // }    
    // }, [props.budgetPlanner]);

    //? Category Payment Modal
    const expensePaymentModal = useRef(null);
    const showExpensePaymentModal = (categoryIndex, action = 'add', payment = null, indexPayment = null, expense, indexExpense) => {
        setCategoryIndex(categoryIndex);
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

    return (
        <div className="col-md-12 mt-11px">
            <div className="card">
                {!props.generatingPdf && <div className="card-header d-flex align-items-center">
                    <strong>Show: &nbsp;</strong>
                    <ul className="nav">
                        <li className={`nav-item ${type === 'all' ? 'active' : ''}`}>
                            <button type="button" onClick={() => setType('all')} className="btn btn-sm nav-link">All </button>
                        </li>
                        <li className={`nav-item ${type === 'paid' ? 'active' : ''}`}>
                            <button type="button" onClick={() => setType('paid')} className="btn btn-sm nav-link">Paid </button>
                        </li>
                        <li className={`nav-item ${type === 'pending' ? 'active' : ''}`}>
                            <button type="button" onClick={() => setType('pending')} className="btn btn-sm nav-link">Pending </button>
                        </li>
                    </ul>
                </div>}
                <div className="card-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Expense</th>
                                <th>Details</th>
                                <th className="text-right">Amount</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.budgetPlanner.budgetPlannerCategories.map((category, categoryKey) => (
                                category.categoryExpenses.map((expense, expenseKey) => (
                                    expense.payments.map((payment, paymentKey) => (<tr key={`c-e-p-${categoryKey}-${expenseKey}-${paymentKey}`} className={`${(type === 'all' || (type === 'paid' && payment.paid) || (type === 'pending' && !payment.paid)) ? 'visible-row' : 'hidden-row'}`}>
                                        <td className="va-middle">{payment.paid ? (<span className="badge badge-success">Paid</span>) : (<span className="badge badge-warning">Pending</span>)}</td>
                                        <td className="va-middle">
                                            <strong>{expense.name}</strong> <br />
                                            <small className="text-muted">{category.name}</small>
                                        </td>
                                        <td className="text-muted va-middle">
                                            {payment.paid ? <small>{moment(payment.paymentDate).format('DD/MM/YYYY')} <br /> {payment.paymentMethod}</small> : <small> Due on {moment(payment.dueDate).format('DD/MM/YYYY')}</small>} <br />
                                            {payment.paidBy && <small>By: {payment.paidBy}</small>}
                                        </td>
                                        <td className="va-middle text-right">
                                            <CurrencyFormat
                                                value={convertToNumber(payment.amount).toFixed(2)}
                                            />
                                        </td>
                                        <td className="va-middle text-center">
                                            <button type="button" onClick={() => showExpensePaymentModal(categoryKey, 'edit', payment, paymentKey, expense, expenseKey)} className="btn btn-outline-success btn-sm">
                                                <span className="bi bi-pencil"> </span>
                                            </button>
                                        </td>
                                    </tr>))
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ExpensePaymentModal
                app={props.app}
                ref={expensePaymentModal}
                onHideModal={() => hideExpensePaymentModal()}
                onItemUpdated={(item, indexExpense, indexPayment) => props.onUpdatePayment(categoryIndex, item, indexExpense, indexPayment)}
            />
        </div>
    );
}

export default Payments;