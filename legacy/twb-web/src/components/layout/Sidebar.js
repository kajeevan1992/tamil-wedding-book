import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    function handleMouseOver() {
        setSidebarOpen(true);
    };

    function handleMouseLeave() {
        setSidebarOpen(false);
    };

    function collapseSideBar() {
        let body = document.getElementsByTagName("body")[0];
        if (body.classList.contains("menu-expanded")) {
            let body = document.getElementsByTagName("body")[0];
            body.classList.remove("menu-expanded");
            body.classList.add("menu-collapsed");
            document.getElementById('menuFixingIcon').innerHTML = 'radio_button_unchecked';
        } else {
            body.classList.remove("menu-collapsed");
            body.classList.add("menu-expanded");
            document.getElementById('menuFixingIcon').innerHTML = 'radio_button_checked';
        }
    }

    function toggleSidebar() {
        let body = document.getElementsByTagName('body')[0];
        if (body.classList.contains('menu-hide')) {
            body.classList.remove('menu-hide');
            body.classList.add('menu-open');
        } else {
            body.classList.add('menu-hide');
            body.classList.remove('menu-open');
        }
    }

    return (
        <>
            {/* <div className={'main-menu menu-fixed menu-light menu-accordion menu-shadow ' + (sidebarOpen ? 'expanded' : '')} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
                <div className="navbar-header">
                    <ul className="nav navbar-nav flex-row">
                        <li className="nav-item me-auto">
                            <NavLink to="/admin" end className="navbar-brand">
                                <span className="brand-logo">
                                    <img src="/assets/images/logo.png" />
                                </span>
                                <h2 className="brand-text"><span className='logo-first'>Tamil</span><span className='logo-second'>Book</span></h2>
                            </NavLink>
                        </li>
                        <li className="nav-item nav-toggle">
                            <a href="#" className="nav-link modern-nav-toggle pe-0">
                                <i className="d-none d-xl-block collapse-toggle-icon font-medium-4  text-primary material-symbols-outlined"
                                    id="menuFixingIcon" onClick={collapseSideBar}>radio_button_checked</i>

                                <i className="d-block d-xl-none text-primary toggle-icon font-medium-4 material-symbols-outlined"
                                    onClick={toggleSidebar}>close</i>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="main-menu-content">
                    <ul className="navigation navigation-main" id="main-menu-navigation" data-menu="menu-navigation">
                        <li className="nav-item">
                            <NavLink to="/admin" end className={({ isActive }) =>
                                isActive ? 'active' : ''
                            }>
                                <div className="d-flex align-items-center">
                                    <i className="material-symbols-outlined text-primary">home</i>
                                    <span className="menu-title mt-5px text-primary">Dashboard</span>
                                </div>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div> */}

            {/* <aside className="offcanvas-collapse">
                <div className="avatar-wrap">
                    <img src="assets/images/dashboard/avatar_img.jpg" alt="" />
                    <h3>Hitesh Mahavar</h3>
                </div>
                <div className="sidebar-nav">
                    <ul className="list-unstyled">
                        <li className="active">
                            <a href="couple-dashboard.html"><i className="tamilweddingbook_heart_ring"></i> Dashboard</a>
                        </li>
                        <li>
                            <a href="couple-dashboard-todo-list.html"><i className="tamilweddingbook_checklist"></i>
                                Checklist</a>
                        </li>
                        <li>
                            <a href="couple-dashboard-vendor-manager.html"><i className="tamilweddingbook_vendor_manager"></i>
                                Vendor Manager</a>
                        </li>
                        <li>
                            <a href="couple-dashboard-guest-manager.html"><i className="tamilweddingbook_guestlist"></i> Guest
                                List</a>
                        </li>
                        <li>
                            <a href="couple-dashboard-budget.html"><i className="tamilweddingbook_budget"></i> Budget</a>
                        </li>
                        <li>
                            <a href="couple-dashboard-realwedding.html"><i className="tamilweddingbook_dove"></i>
                                RealWedding</a>
                        </li>
                        <li>
                            <a href="#" onClick={event => event.preventDefault()}><i className="tamilweddingbook_seating_chart"></i> Seating Chart</a>
                        </li>
                        <li>
                            <a href="#" onClick={event => event.preventDefault()}><i className="tamilweddingbook_love_gift"></i> Registry</a>
                        </li>
                        <li>
                            <a href="#" onClick={event => event.preventDefault()}><i className="tamilweddingbook_chat"></i> Chat</a>
                        </li>
                        <li>
                            <a href="couple-dashboard-profile.html"><i className="tamilweddingbook_my_profile"></i> My
                                Profile</a>
                        </li>
                        <li>
                            <a href="#" onClick={event => event.preventDefault()}><i className="tamilweddingbook_websote_demo"></i> Wedding Website</a>
                        </li>

                        <li>
                            <a href="#" onClick={event => event.preventDefault()}><i className="tamilweddingbook_logout"></i> Logout</a>
                        </li>
                    </ul>
                </div>
            </aside> */}
        </>
    );
}

export default Sidebar;