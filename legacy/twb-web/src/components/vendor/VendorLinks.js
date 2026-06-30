import { NavLink } from 'react-router-dom';
import * as authService from '@services/AuthService';
import { vendorLinks } from '@utilities/CommonUtil';
import { useSelector } from 'react-redux';

function VendorLinks(props) {
    const app = useSelector(state => state.app);

    let stepsCount = 0;
    if (app.profile.storeFrontFirstStepDone) stepsCount++;
    if (app.profile.storeFrontSecondStepDone) stepsCount++;
    if (app.profile.storeFrontThirdStepDone) stepsCount++;

    return (
        <section className="vendor-nav-sticky pb-1px-grey bg-white-full">
            <div className="container">
                <div className="row d-flex align-items-center">
                    <div className="col-md-9">
                        <ul className="nav nav-pills my-listing-tab  justify-content-start nav-fill pt-2 pb-0 li-flex-0p13" id="pills-tab1"
                            role="tablist">
                            {vendorLinks(app.profile.role).map((link, key) => {
                                return (
                                    <li className="nav-item nav-bottom-link" role="presentation" key={`vendor-link-main-${key}`}>
                                        <NavLink to={link.href} end className="nav-link">
                                            <i className={`bi ${link.icon} fn-35`}></i>
                                            <small className="d-block mt-2 fn-bold">{link.name}</small>
                                        </NavLink>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="col-md-3">
                        <NavLink to={`/${authService.getUserRole()}/create-storefront`} end>
                            <div className="d-flex justify-content-between">
                                <strong>Create your storefront</strong>
                                <strong>{stepsCount}/3</strong>
                            </div>
                            <div className="progress mt-1">
                                <div className="progress-bar" role="progressbar" style={{ width: `${33.33 * stepsCount}%`, backgroundColor: '#28a745' }}
                                    aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                </div>
                            </div>
                        </NavLink>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default VendorLinks;