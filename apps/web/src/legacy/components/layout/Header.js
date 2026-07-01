'use client';

import HeaderMenu from '../shared/HeaderMenu';
import { NavLink } from '../NextNavLink';

function Header({ app }) {
    return (
        <>
            <header className="pb-1px-grey">
                <nav className="navbar navbar-expand-lg">
                    <div className={`text-nowrap bdr-nav container-fluid `}>
                        <div className="d-flex">
                            <NavLink to="/" end className="navbar-brand">
                                <img
                                    src="/assets/images/about/Tamil_Wedding_Book.png"
                                    alt="Tamil Wedding Book"
                                    className="own-pl-image"
                                />
                            </NavLink>
                        </div>

                        {!app.isLoggedIn && (
                            <span className="order-lg-last d-inline-flex ml-auto">
                                <NavLink to="/login" end className="btn btn-primary my_own_btn" role="button">
                                    Login
                                </NavLink>
                            </span>
                        )}

                        {!app.isLoggedIn && (
                            <span className="order-lg-last ml-3 d-none d-md-inline-flex">
                                <NavLink to="/vendor-login" end className="btn btn-primary my_own_btn own-btn-business" role="button">
                                    Business Login
                                </NavLink>
                            </span>
                        )}

                        <button
                            className="navbar-toggler x collapsed"
                            type="button"
                            data-toggle="collapse"
                            data-target="#navbarCollapse"
                            aria-controls="navbarCollapse"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>

                        <div
                            className="collapse navbar-collapse ml-3"
                            id="navbarCollapse"
                            data-hover="dropdown"
                            data-animations="slideInUp slideInUp slideInUp slideInUp"
                        >
                            <HeaderMenu app={app} />
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
}

export default Header;
