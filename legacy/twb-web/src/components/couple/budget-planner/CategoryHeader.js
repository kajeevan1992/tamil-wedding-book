import { convertToNumber } from "@utilities/CommonUtil";
import CurrencyFormat from "@components/shared/CurrencyFormat";

function CategoryHeader(props) {
    const diffOfEstimatedAndFinalCost = () => {
        let estimatedCost = 0.00;
        let finalCost = 0.00;
        props.category?.categoryExpenses.forEach(expense => {
            estimatedCost += convertToNumber(expense.estimatedCost);
            finalCost += convertToNumber(expense.finalCost);
        });

        return estimatedCost - finalCost;
    }

    function CostProgress() {
        let estimatedCost = 0.00;
        let finalCost = 0.00;
        props.category?.categoryExpenses.forEach(expense => {
            estimatedCost += convertToNumber(expense.estimatedCost);
            finalCost += convertToNumber(expense.finalCost);
        });

        let diffOfEstimatedAndFinalCost = estimatedCost - finalCost;
        let percentage = (diffOfEstimatedAndFinalCost * 100) / estimatedCost;

        return (
            <div className="progress mt-4">
                <div className="progress-bar" role="progressbar" style={{ width: `${percentage}%`, backgroundColor: '#eb2327' }}
                    aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                    <CurrencyFormat
                        value={diffOfEstimatedAndFinalCost.toFixed(2)}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="col-12 mt-2">
            <div className="d-flex justify-content-center align-items-center">
                <div className="text-center">
                    <span className={`bi ${props.category?.icon} fs-50px`}></span>
                    <h3 className="mt-3">{props.category?.name}</h3>

                    {!props.generatingPdf && <div className="d-flex gap-10 justify-content-center">
                        <button type="button" onClick={() => props.onShowCategoryActionModal()} className="btn btn-sm btn-outline-success">
                            <span className="bi bi-pencil"></span>
                        </button>
                        <button type="button" onClick={() => props.onDeleteCategory()} className="btn btn-sm btn-outline-danger">
                            <span className="bi bi-trash"></span>
                        </button>
                    </div>}

                    <div className="d-flex justify-content-between mt-3">
                        <div className="mx-2">
                            <span className="fw-600">Estimated Cost:</span> {props.estimatedCost}
                        </div>
                        <div className="mx-2">
                            <span className="fw-600">Final Cost:</span> {props.finalCost}
                        </div>
                    </div>

                    <CostProgress />
                </div>
            </div>
        </div>
    );
}

export default CategoryHeader;