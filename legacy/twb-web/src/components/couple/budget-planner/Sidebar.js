import { useRef } from 'react';
import { NavLink } from 'react-router-dom';

function BudgetPlannerSidebar(props) {
    const menuRef = useRef(null);
    const toggleMenu = () => {
        if (menuRef.current.classList.contains('show')) {
            menuRef.current.classList.remove('show');
        } else {
            menuRef.current.classList.add('show');
        }
    }
    return (
        <div className="mb-3">
            <div className="d-flex align-items-center mb-3">
                <h3 className="fw-600 mb-0">Categories</h3>
                <button type="button" onClick={() => props.onShowCategoryActionModal()} className="btn btn-sm text-theme">
                    <span className="bi bi-plus-circle fs-20px"></span>
                </button>
            </div>

            <button type="button" className="btn btn-outline-primary btn-block mb-2 btn-sm-collapse" onClick={() => toggleMenu()}>
                <span className="bi bi-list"></span> Menu
            </button>
            <div ref={menuRef} className="sm-collapse">
                <ul className="list-group">
                    <li className="list-group-item p-1">
                        <NavLink to="/couple/budget-planner" end className="nav-link">
                            <span className="mr-2 bi bi-pie-chart"></span>
                            <span>Stats</span>
                        </NavLink>
                    </li>
                    {props.categories?.map((category, index) => <li className="list-group-item p-1" key={`menu-${index}`}>
                        <NavLink to={`/couple/budget-planner/${category.id}`} end className="nav-link">
                            <span className={`mr-2 ${category.icon}`}></span>
                            <span className="text-capitalize">{category.name}</span>
                        </NavLink>
                    </li>)}
                </ul>
            </div>
        </div>
    );
}

export default BudgetPlannerSidebar;