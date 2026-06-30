import { NavLink } from "react-router-dom";

export default function Sidebar(props) {
  return (
    <>
      <div className="nav flex-column budget-tab ">
        <NavLink
          to={`/${props.app.profile.role}/settings`}
          end
          className="nav-link nav-list-item"
        >
          <i className="bi bi-gear"></i>&nbsp;
          <span> Settings</span>
        </NavLink>
      </div>
    </>
  );
}
