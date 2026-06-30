import PieDoughnutChart from "@components/shared/PieDoughnutChart";
import StatsHeader from "@components/couple/budget-planner/StatsHeader";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
// import BudgetModal from "@components/couple/budget-planner/BudgetModal";
// import CurrencyFormat from "@components/shared/CurrencyFormat";
import { convertToNumber } from "@utilities/CommonUtil";

function Stats() {
    const { budgetPlanner } = useOutletContext();
    const [data, setData] = useState([]);

    useEffect(() => {
        let dataPoints = [];
        let totalFinalCost = 0.00;

        budgetPlanner?.budgetPlannerCategories.forEach(category => {
            let dataPoint = {
                label: category?.name,
                y: 0,
                total: 0,
            };

            category?.categoryExpenses.forEach(expense => {
                let finalCost = convertToNumber(expense.finalCost);
                totalFinalCost += finalCost;
                dataPoint.total += finalCost;
            });

            // dataPoint.total = (dataPoint.total / budgetPlanner?.totalEstimatedCost) * 100;
            dataPoints.push(dataPoint);
        });

        dataPoints.forEach((dataPoint) => {
            dataPoint.y = dataPoint.total > 0 ?? ((dataPoint.total / totalFinalCost) * 100).toFixed(2);
        });

        setData(dataPoints);

        // return (<CurrencyFormat
        //     value={total.toFixed(2)}
        // />);

        setTimeout(() => {
            console.log(dataPoints);
        }, 3000);
    }, [budgetPlanner]);

    //? Budget Modal
    // const budgetModal = useRef(null);
    // const showBudgetModal = (budget) => {
    //     budgetModal.current.showModal(budget);
    // }
    // const hideBudgetModal = () => {
    //     budgetModal.current.hideModal();
    // }
    // const updateBudget = (item) => { }

    return (
        <div className="col-md-12 mt-11px">
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <StatsHeader
                            budgetPlanner={budgetPlanner}
                        // onShowBudgetModal={() => showBudgetModal(6402)}
                        />

                        <div className="col-12">
                            <hr />
                        </div>
                        <div className="col-12 mt-4">

                            <PieDoughnutChart
                                type="pie"
                                data={data}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* <BudgetModal
                app={app}
                ref={budgetModal}
                onHideModal={() => hideBudgetModal()}
                onItemUpdated={(item) => updateBudget(item)}
            /> */}
        </div>
    );
}

export default Stats;