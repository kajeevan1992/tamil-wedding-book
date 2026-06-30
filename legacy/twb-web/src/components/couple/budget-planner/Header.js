export default function BudgetPlannerHeader(props) {
    return (
        <div className="col-md-12">
            <div className="d-flex align-items-center justify-content-between">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <button type="button" onClick={() => { props.onTabSelect('budget-planner') }} className={`nav-link ${props.selectedTab === 'budget-planner' ? 'active' : ''}`}>Budget Planner</button>
                    </li>
                    <li className="nav-item">
                        <button type="button" onClick={() => { props.onTabSelect('payments') }} className={`nav-link ${props.selectedTab === 'payments' ? 'active' : ''}`}>Payments</button>
                    </li>
                </ul>
                <button type="button" onClick={() => props.onExportToPdf()} className="btn btn-white btn-sm text-danger">
                    <span className="bi bi-cloud-download"></span> PDF
                </button>
            </div>
        </div>
    );
}