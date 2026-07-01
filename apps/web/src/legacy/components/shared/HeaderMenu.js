'use client';

import { navigations } from '../../utilities/CommonUtil';
import React from "react";
import { NavLink } from '../NextNavLink';

export default function HeaderMenu(props) {
    let roleType = window.location.href;
    if (
        props.app.isLoggedIn &&
        (roleType.includes("venue") || roleType.includes("supplier")) &&
        (props.app?.profile?.role === "venue" ||
            props.app?.profile?.role === "supplier")
    ) {
        return (
            <>
                <div style={{ padding: "1.8rem 0.3rem" }}>
                    <div className="boostTextDiv">
                        <p className="boostText">
                            <span className="text-success">LITE</span> Boost
                            your results
                        </p>
                        <a className="upgradeLink">UPGRADE</a>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <ul className="navbar-nav inner-li-pos-static">
                    {navigations(
                        props.app?.profile?.role,
                        props.app?.categories
                    ).map((navigation, index) => (
                        <li
                            className="nav-item dropdown"
                            key={`header-menu-${index}`}
                        >
                            <NavLink
                                className="nav-link dropdown-toggle-mob"
                                to={navigation.href}
                                id={`menu-id-${index}`}
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                {navigation.name}
                            </NavLink>
                            {navigation.subMenu?.length > 0 ? (
                                <ul
                                    className="dropdown-menu grey-top-border down-shadow dropdownhover-bottom own-dropdown dropdown-menu2"
                                    aria-labelledby={`menu-id-${index}`}
                                >
                                    <div className="row own-pl-image px-5">
                                        <div className="col-lg-8">
                                            <h5 className="mt-3 mb-4 own-title-2">
                                                {navigation.subMenuHeading}
                                            </h5>
                                            <div className="row my-3">
                                                {navigation.subMenu.map(
                                                    (
                                                        menuItem,
                                                        subMenuIndex
                                                    ) => (
                                                        <div
                                                            className="col-lg-4 mb-4"
                                                            key={`sub-menu-${subMenuIndex}`}
                                                        >
                                                            <div className="d-flex align-items-center">
                                                                {menuItem.icon && (
                                                                    <i
                                                                        className={`${menuItem.icon} own-icon-3`}
                                                                    ></i>
                                                                )}
                                                                <NavLink
                                                                    to={
                                                                        menuItem.href
                                                                    }
                                                                    className="own-card own-family p-0 ml-2 mb-0 border-bottom-0"
                                                                >
                                                                    <p className="own-card-3 p-0 mb-0">
                                                                        {
                                                                            menuItem.name
                                                                        }
                                                                    </p>
                                                                </NavLink>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-lg-4 my-3">
                                            {navigation.rightSideContent &&
                                                React.createElement(
                                                    navigation.rightSideContent
                                                )}
                                        </div>
                                    </div>
                                </ul>
                            ) : (
                                <ul className="dropdown-menu d-none"></ul>
                            )}
                        </li>
                    ))}
                </ul>
            </>
        );
    }
}
