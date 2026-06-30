import { NavLink } from 'react-router-dom';

function CoupleAccountSidebar() {
    return (
        <>
            <h3 className="mb-3 fw-600">Settings</h3>
            <ul className="nav flex-column couple-account">
                <li className="nav-item">
                    <NavLink to="/couple/account" end className="nav-link">
                        User Information
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/couple/account/settings" end className="nav-link">
                        Account Settings
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/couple/account/notifications" end className="nav-link">
                        Notifications
                    </NavLink>
                </li>
            </ul>
        </>

    );
}

export default CoupleAccountSidebar;