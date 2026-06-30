import CoupleAccountSidebar from "@components/couple/account/Sidebar";
import CoupleLinkAccount from "@components/couple/account/LinkAccount";
import SocialSignin from "@components/auth/SocialSignin";
import { useSelector } from "react-redux";

function AccountSettings() {
    const app = useSelector(state => state.app);
    return (
        <>
            <div className="container spacer">
                <div className="row">
                    <div className="col-md-2">
                        <CoupleAccountSidebar />
                    </div>
                    <div className="col-md-10">
                        <h2 className="mb-4">Account Settings</h2>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header fw-600">
                                        LINK ACCOUNTS
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-7">
                                                <h6>Link your Tamil Wedding Book account</h6>
                                                <p className="text-muted mt-3"><span className="fa fa-copy"></span>&nbsp;&nbsp;&nbsp; Modify your profile photo with one click</p>
                                                <p className="text-muted mt-2"><span className="fa fa-shield"></span>&nbsp;&nbsp;&nbsp; We will never publish anything without your permission</p>
                                            </div>
                                            <div className="col-md-5">
                                                <div className="row">
                                                    <div className="col-9">
                                                        <SocialSignin />
                                                    </div>
                                                    <div className="col-3">
                                                        <button type="button" className="btn btn-link text-danger pb-0 pl-0">
                                                            Unlink
                                                        </button>
                                                        <button type="button" className="btn btn-link text-danger pb-0 pl-0 pt-3">
                                                            Unlink
                                                        </button>
                                                        <button type="button" className="btn btn-link text-danger pb-0 pl-0 pt-3">
                                                            Unlink
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-12 mt-4" id="changeEmailPassword">
                                <div className="row">
                                    <div className="col-6">
                                        <div className="card h-100percent">
                                            <div className="card-header fw-600">
                                                EMAIL
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <h6 className="">All emails will be sent to <strong>kajee-kj@live.co.uk</strong></h6>
                                                        <div className="mb-5 mt-4">
                                                            <label>Email</label>
                                                            <div className="input-group password-hidden">
                                                                <input
                                                                    type="email"
                                                                    name="email"
                                                                    id="email"
                                                                    placeholder="Enter your new email"
                                                                    className="form-control own-input only-b-brdr-grey"
                                                                />
                                                                <span
                                                                    className="input-group-text cursor-pointer transparent-password-toggle">
                                                                    <i className="bi bi-envelope"></i>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button type="submit" className="btn btn-outline-primary btn-sm">Change</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="card h-100percent">
                                            <div className="card-header fw-600">
                                                YOUR PASSWORD
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-7">
                                                        <div className="mb-3">
                                                            <label>PASSWORD</label>
                                                            <div className="input-group password-hidden">
                                                                <input
                                                                    type="password"
                                                                    name="password"
                                                                    id="password"
                                                                    placeholder="Enter your new password"
                                                                    className="form-control own-input only-b-brdr-grey"
                                                                />
                                                                <span
                                                                    className="input-group-text cursor-pointer transparent-password-toggle"
                                                                // onClick={togglePasswordView}
                                                                >
                                                                    {/* <i className={state.passwordHidden ?
                                                                        'bi bi-eye' :
                                                                        'bi bi-eye-slash'}></i>  */}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="mb-5 mt-4">
                                                            <label>REPEAT PASSWORD</label>
                                                            <div className="input-group password-hidden">
                                                                <input
                                                                    type="password"
                                                                    name="password"
                                                                    id="password"
                                                                    placeholder="Confirm new password"
                                                                    className="form-control own-input only-b-brdr-grey"
                                                                />
                                                                <span
                                                                    className="input-group-text cursor-pointer transparent-password-toggle"
                                                                // onClick={togglePasswordView}
                                                                >
                                                                    {/* <i class={state.passwordHidden ?
                                                                        'bi bi-eye' :
                                                                        'bi bi-eye-slash'}></i>  */}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button className="btn btn-outline-primary btn-sm">Change</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {app.profile.primary && <CoupleLinkAccount />}

                            <div className="col-md-12 mt-4">
                                <div className="card h-100percent">
                                    <div className="card-header fw-600">
                                        VISIBILITY
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    name="acceptTermAndPrivacyPolicy"
                                                    id="acceptTermAndPrivacyPolicy"
                                                    // onChange={handleInputChange}
                                                    className="form-check-input w-h-17px theme-color-bg"
                                                />
                                                <label className="form-check-label" htmlFor="acceptTermAndPrivacyPolicy">
                                                    &nbsp; I would like anyone to be able to send me messages in the Community (if not, only your friends will be able to send you messages).
                                                </label>
                                            </div>
                                        </div>

                                        <button type="button" className="btn btn-outline-primary btn-sm">Modify Visibility</button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-12 mt-4 mb-3">
                                <div className="card h-100percent">
                                    <div className="card-header fw-600">
                                        DELETE ACCOUNT
                                    </div>
                                    <div className="card-body">
                                        <p className="mb-3">Your account and all the personal information and content saved in that account will be removed. Any forum posts made through your account will remain active. Are you sure you want to delete your account?</p>
                                        <button type="button" className="btn btn-link text-danger btn-sm pl-0">Delete Account</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AccountSettings;