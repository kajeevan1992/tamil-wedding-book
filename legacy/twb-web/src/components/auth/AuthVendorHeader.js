import { NavLink } from 'react-router-dom';

export default function AuthVendorHeader() {
    return (
        <>
            <header className="fixed-top header-anim">
                {/* <div className="top-bar-stripe">
                    <div className="container px-md-0">
                        <div className="row align-items-center">
                            <div className="col-sm-12 col-lg-12 text-center">

                                <ul className="list-unstyled">
                                    <p className="text-white mt-2">We're here to help you keep moving forward, no matter what your
                                        plans are.</p>

                                </ul>
                            </div>
                        </div>
                    </div>
                </div> */}
                <nav className="navbar navbar-expand-lg">
                    <div className="container-fluid text-nowrap bdr-nav">
                        <div className="d-flex mr-auto">
                            <NavLink to="/" end className="navbar-brand">
                                <img src="/assets/images/about/Tamil_Wedding_Book.png" alt="Tamil Wedding Book" className="own-pl-image" />
                            </NavLink>
                        </div>

                        <button className="navbar-toggler x collapsed" type="button" data-toggle="collapse"
                            data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false"
                            aria-label="Toggle navigation">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>

                        <div className="collapse navbar-collapse ml-3" id="navbarCollapse" data-hover="dropdown"
                            data-animations="slideInUp slideInUp slideInUp slideInUp">
                            <ul className="navbar-nav header-menu">
                                <li className="nav-item">
                                    <NavLink to="/vendor-login" end className="nav-link">
                                        BUSINESS LOGIN
                                    </NavLink>
                                </li>
                                <li className="nav-item ">
                                    <a className="nav-link" href="login-feature-page.html" aria-haspopup="true"
                                        aria-expanded="false">FEATURES </a>

                                </li>
                                <li className="nav-item">
                                    <a className="nav-link dropdown-toggle-mob" href="login-premium.html" aria-haspopup="true"
                                        aria-expanded="false">PREMIUM SERVICE </a>

                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="get-app.html" aria-haspopup="true" aria-expanded="false">GET THE
                                        APP</a>

                                </li>

                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
}