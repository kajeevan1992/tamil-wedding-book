import { convertToNumber } from "@utilities/CommonUtil";
import CurrencyFormat from "@components/shared/CurrencyFormat";

function StatsHeader(props) {
    const totalOf = (type) => {
        let total = 0.00;

        props.budgetPlanner?.budgetPlannerCategories.forEach(category => {
            category?.categoryExpenses.forEach(expense => {
                total += convertToNumber(expense[type]);
            });
        });

        return (<CurrencyFormat
            value={total.toFixed(2)}
        />);
    }

    const totalOfPayment = (type) => {
        let total = 0.00;

        props.budgetPlanner?.budgetPlannerCategories.forEach(category => {
            category?.categoryExpenses.forEach(expense => {
                expense?.payments.forEach(payment => {
                    if (payment.paid === type) {
                        total += convertToNumber(payment.amount);
                    }
                });
            });
        });

        return (<CurrencyFormat
            value={total.toFixed(2)}
        />);
    }

    return (
        <>
            <div className="col-5 mt-2">
                <div className="d-flex justify-content-center align-items-center">
                    <div className="text-center">
                        <span className="bi bi-bank fs-24px"></span>
                        <h4 className="mt-3">Estimated Cost</h4>
                        <h3 className="fw-600 mt-3">{totalOf('estimatedCost')}</h3>
                        {/* <button type="button" onClick={() => { props.onShowBudgetModal() }} className="btn btn-sm text-theme">Edit Budget</button> */}
                    </div>
                </div>
            </div>
            <div className="col-2 d-flex justify-content-center">
                <div className="vertical-separator"></div>
            </div>
            <div className="col-5 mt-2">
                <div className="d-flex justify-content-center align-items-center">
                    <div className="text-center">
                        <span className="bi bi-cash-coin fs-24px"></span>
                        <h4 className="mt-3">Final Cost</h4>
                        <h3 className="fw-600 text-theme mt-3">{totalOf('finalCost')}</h3>
                        <div className="d-flex justify-content-between mt-3">
                            <div className="mx-2">
                                <span className="fw-600">Paid:</span> {totalOfPayment(true)}
                            </div>
                            <div className="mx-2">
                                <span className="fw-600">Pending:</span> {totalOfPayment(false)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default StatsHeader;