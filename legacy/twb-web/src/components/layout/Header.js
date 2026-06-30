import HeaderMenu from "@components/shared/HeaderMenu";
import UserAvatar from "@components/shared/UserAvatar";
import * as authService from "@services/AuthService";
import { toggleLoading } from "@store/AppSlice";
import { coupleLinks, timeAgo, vendorLinks } from "@utilities/CommonUtil";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const app = useSelector((state) => state.app);

    const [emailSent, setEmailSent] = useState(false);
    async function logout() {
        try {
            authService.logout();
            toast.success("Logout successful");
            if (
                app.profile.role === "venue" ||
                app.profile.role === "supplier"
            ) {
                navigate("/vendor-login");
            } else {
                navigate("/login");
            }
        } catch (error) {
            toast.error("Something went wrong, please try again!");
        }
    }

    const resendVerificationEmail = async (e) => {
        e.preventDefault();
        if (emailSent) return;

        try {
            dispatch(toggleLoading(true));

            const response = await authService.resendVerificationEmail();
            dispatch(toggleLoading(false));
            setEmailSent(true);
            toast.success(response.data.message);
        } catch (error) {
            dispatch(toggleLoading(false));
            toast.error("Something went wrong, please try again");
        }
    };

    return (
        <>
            <header className="pb-1px-grey">
                {" "}
                {/** removed fixed-top header-anim */}
                {app.isLoggedIn && !app.profile.verified && (
                    <div className="top-bar-stripe" id="verifiedBanner">
                        <div className="container-fluid px-3">
                            <div className="row align-items-center">
                                <div className="col-sm-12">
                                    <ul className="list-unstyled d-flex justify-content-between align-items-center mb-0 responsive-content pb-1">
                                        <li>
                                            Finish signing up by clicking the
                                            link in the email we sent to{" "}
                                            {app.profile.email}
                                        </li>
                                        <li className="d-flex gap-20px align-items-center">
                                            <NavLink
                                                to="/couple/account/settings"
                                                end
                                                className="btn btn-link btn-sm text-white px-0"
                                            >
                                                Change email
                                            </NavLink>
                                            <button
                                                disabled={emailSent}
                                                onClick={
                                                    resendVerificationEmail
                                                }
                                                className="btn btn-link btn-sm text-white px-0"
                                            >
                                                {emailSent
                                                    ? "Email sent"
                                                    : "Resend Email"}
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <nav className="navbar navbar-expand-lg">
                    {/* ${app.isLoggedIn && app.profile.role === 'venue' || app.profile.role === 'supplier' ? '' : '-fluid'} */}
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

                        {app.isLoggedIn && (
                            <span className="order-lg-last d-inline-flex ml-auto gap-10">
                                <div className="dropdown">
                                    <a
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                        className="dropdown-toggle no-after"
                                        role="button"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        <div className="vendor-header-menu">
                                            <div className="vendor-icon-avatar only-icon">
                                                {app.notifications.length >
                                                    0 && (
                                                    <span className="notification-count">
                                                        {app.notifications
                                                            .length > 9
                                                            ? "9+"
                                                            : app.notifications
                                                                  .length}
                                                    </span>
                                                )}
                                                <i className="bi bi-bell"></i>
                                            </div>
                                        </div>
                                    </a>
                                    {app.notifications.length > 0 && (
                                        <div className="dropdown-menu header-dd custom-menu-profile-dropdown dropdown-menu-right p-0">
                                            <ul className="list-unstyled mb-0 notification-dd">
                                                {app.notifications.map(
                                                    (notification, key) => (
                                                        <li
                                                            key={`notificationsheader-list-${key}`}
                                                        >
                                                            <NavLink
                                                                to={
                                                                    notification.type ===
                                                                    "preferredByBusiness"
                                                                        ? `/${app.profile.role}/storefront/preferred-vendor?preferredtab`
                                                                        : notification.type ===
                                                                          "pricingRequest"
                                                                        ? `/${app.profile.role}/enquiries`
                                                                        : "#"
                                                                }
                                                            >
                                                                <div className="d-flex align-items-center">
                                                                    <div
                                                                        className="notification-icon mr-2"
                                                                        style={{
                                                                            backgroundColor: `${notification.iconColor}`,
                                                                        }}
                                                                    >
                                                                        <span
                                                                            className={`${notification.icon}`}
                                                                        ></span>
                                                                    </div>
                                                                    <div>
                                                                        <strong className="notification-title mb-0">
                                                                            {
                                                                                notification.title
                                                                            }
                                                                        </strong>
                                                                        <p className="mb-0 notification-description">
                                                                            {
                                                                                notification.description
                                                                            }
                                                                        </p>
                                                                        <small className="text-muted notification-timeago">
                                                                            {timeAgo(
                                                                                notification.createdAt
                                                                            )}
                                                                        </small>
                                                                    </div>
                                                                </div>
                                                            </NavLink>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <div className="dropdown">
                                    <a
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                        className="dropdown-toggle no-after"
                                        role="button"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        {app.profile.role === "couple" && (
                                            <UserAvatar
                                                name={app.profile.fullName}
                                                round={true}
                                                size={50}
                                                photo={
                                                    app.profile.photo
                                                        ? app.serverPath +
                                                          app.profile.photo
                                                        : app.profile.couple
                                                              .weddingDetail
                                                              .partnerPhoto &&
                                                          app.profile.primary ==
                                                              false
                                                        ? app.serverPath +
                                                          app.profile.couple
                                                              .weddingDetail
                                                              .partnerPhoto
                                                        : null
                                                }
                                            />
                                        )}
                                        {(app.profile.role === "venue" ||
                                            app.profile.role ===
                                                "supplier") && (
                                            <div className="vendor-header-menu">
                                                <div className="d-flex align-items-center m-2">
                                                    <i className="bi bi-telephone"></i>
                                                    <small>
                                                        Customer service: <br />
                                                        <strong className="text-theme">
                                                            0800 206 1700
                                                        </strong>
                                                    </small>
                                                </div>
                                                <div className="vendor-icon-avatar">
                                                    {app.profile.photo ? (
                                                        <UserAvatar
                                                            round={true}
                                                            size={50}
                                                            photo={
                                                                app.serverPath +
                                                                app.profile
                                                                    .photo
                                                            }
                                                        />
                                                    ) : (
                                                        <i className="bi bi-briefcase"></i>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </a>
                                    <div className="dropdown-menu header-dd custom-menu-profile-dropdown dropdown-menu-right p-3">
                                        <div className="custom-file-wrap d-flex">
                                            <div className="custom-file-holder">
                                                {app.profile.role ===
                                                    "couple" && (
                                                    <UserAvatar
                                                        name={
                                                            app.profile.fullName
                                                        }
                                                        round={true}
                                                        size={50}
                                                        photo={
                                                            app.profile.photo
                                                                ? app.serverPath +
                                                                  app.profile
                                                                      .photo
                                                                : app.profile
                                                                      .couple
                                                                      .weddingDetail
                                                                      .partnerPhoto &&
                                                                  app.profile
                                                                      .primary ==
                                                                      false
                                                                ? app.serverPath +
                                                                  app.profile
                                                                      .couple
                                                                      .weddingDetail
                                                                      .partnerPhoto
                                                                : null
                                                        }
                                                    />
                                                )}
                                            </div>
                                            <div className="custom-file-text ml-3">
                                                <div className="head">
                                                    {app.profile.fullName}
                                                </div>
                                                {app.profile.role ===
                                                    "couple" && (
                                                    <div>
                                                        <span className="text-muted">
                                                            Beginner{" "}
                                                        </span>
                                                        <NavLink
                                                            to={
                                                                "/" +
                                                                app.profile.role
                                                            }
                                                            end
                                                            className="inline-block p-0 profile-link"
                                                        >
                                                            My Profile
                                                        </NavLink>
                                                    </div>
                                                )}
                                                {/* {(app.profile.role === 'venue' || app.profile.role === 'supplier') && <div>
                                                <NavLink to={'/' + app.profile.role + '/settings'} end className="inline-block p-0 profile-link">Settings</NavLink>
                                            </div>} */}
                                                {(app.profile.role ===
                                                    "venue" ||
                                                    app.profile.role ===
                                                        "supplier") && (
                                                    <div className="text-capitalize">
                                                        Business Profile:{" "}
                                                        {app.profile.role}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {app.profile.role === "couple" && (
                                            <div>
                                                <NavLink
                                                    to="/couple"
                                                    className="btn d-flex justify-content-center my-3 btn-sm p-2"
                                                >
                                                    Go to my planner
                                                </NavLink>
                                                <div className="dropdown-divider"></div>
                                                <ul className="nav nav-pills  justify-content-center nav-fill">
                                                    {coupleLinks().map(
                                                        (link, key) => {
                                                            return (
                                                                <li
                                                                    className="nav-item nav-bottom-link"
                                                                    key={`couple-links-dd-${key}`}
                                                                >
                                                                    <NavLink
                                                                        to={`${link.href}`}
                                                                        end
                                                                        className="nav-link py-3 px-0"
                                                                    >
                                                                        <i
                                                                            className={`${link.icon} fn-35`}
                                                                        ></i>
                                                                        <small className="d-block mt-2 fn-bold">
                                                                            {
                                                                                link.name
                                                                            }
                                                                        </small>
                                                                    </NavLink>
                                                                </li>
                                                            );
                                                        }
                                                    )}
                                                </ul>
                                                <div className="dropdown-divider"></div>
                                                <ul className="nav nav-pills  justify-content-center nav-fill">
                                                    <li className="nav-item nav-bottom-link">
                                                        <NavLink
                                                            to="/couple/account/settings"
                                                            end
                                                            className="nav-link w-auto"
                                                        >
                                                            <i className="bi bi-gear fn-35"></i>
                                                            <small className="d-block mt-2 fn-bold">
                                                                Settings
                                                            </small>
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item nav-bottom-link">
                                                        <a
                                                            href="#"
                                                            onClick={(
                                                                event
                                                            ) => {
                                                                event.preventDefault();
                                                                logout();
                                                            }}
                                                            className="nav-link w-auto"
                                                        >
                                                            <i className="bi bi-box-arrow-right fn-35"></i>
                                                            <small className="d-block mt-2 fn-bold">
                                                                Logout
                                                            </small>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                        {(app.profile.role === "venue" ||
                                            app.profile.role ===
                                                "supplier") && (
                                            <div>
                                                <button
                                                    type="button"
                                                    className="btn btn-block my-3"
                                                >
                                                    Boost your results <br />{" "}
                                                    <span className="upgradeLink no-td">
                                                        Upgrade
                                                    </span>
                                                </button>
                                                <div className="dropdown-divider"></div>
                                                <ul className="nav nav-pills  justify-content-center nav-fill">
                                                    {vendorLinks(
                                                        app.profile.role
                                                    ).map((link, key) => {
                                                        return (
                                                            <li
                                                                className="nav-item nav-bottom-link"
                                                                role="presentation"
                                                                key={`vendor-links-key-${key}`}
                                                            >
                                                                <NavLink
                                                                    to={
                                                                        link.href
                                                                    }
                                                                    end
                                                                    className="nav-link py-3 px-0"
                                                                >
                                                                    {/* <i className="fa fa-briefcase fn-35"></i> */}
                                                                    <i
                                                                        className={`bi ${link.icon} fn-35`}
                                                                    ></i>
                                                                    <small className="d-block mt-2 fn-bold">
                                                                        {
                                                                            link.name
                                                                        }
                                                                    </small>
                                                                </NavLink>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                                <div className="dropdown-divider"></div>
                                                <ul className="nav nav-pills  justify-content-center nav-fill">
                                                    <li className="nav-item nav-bottom-link">
                                                        <a
                                                            href="#"
                                                            onClick={(
                                                                event
                                                            ) => {
                                                                event.preventDefault();
                                                                logout();
                                                            }}
                                                            className="nav-link w-auto"
                                                        >
                                                            <i className="bi bi-box-arrow-right fn-35"></i>
                                                            <small className="d-block mt-2 fn-bold">
                                                                Logout
                                                            </small>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </span>
                        )}
                        {!app.isLoggedIn && (
                            <span className="order-lg-last d-inline-flex ml-auto">
                                <NavLink
                                    to={
                                        app.isLoggedIn
                                            ? "/" + app.profile.role
                                            : "/login"
                                    }
                                    end
                                    className="btn btn-primary my_own_btn"
                                    role="button"
                                >
                                    {app.isLoggedIn ? "Dashboard" : "Login"}
                                </NavLink>
                            </span>
                        )}

                        {!app.isLoggedIn && (
                            <span className="order-lg-last ml-3 d-none d-md-inline-flex">
                                <NavLink
                                    to={
                                        app.isLoggedIn
                                            ? "/" + app.profile.role
                                            : "/vendor-login"
                                    }
                                    end
                                    className="btn btn-primary my_own_btn own-btn-business"
                                    role="button"
                                >
                                    {app.isLoggedIn
                                        ? "Dashboard"
                                        : "Business Login"}
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
