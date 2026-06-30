import { NavLink } from "react-router-dom";

export default function Sidebar(props) {
  return (
    <>
      <div className="nav flex-column budget-tab ">
        <NavLink
          to={`/${props.app.profile.role}/invoices`}
          end
          className="nav-link nav-list-item"
        >
          <i className="bi bi-credit-card-2-front"></i>&nbsp;
          <span> Payments methods</span>
        </NavLink>
      </div>
    </>
  );
}
