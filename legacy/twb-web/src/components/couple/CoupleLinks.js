import { NavLink } from 'react-router-dom';
import { coupleLinks } from "@utilities/CommonUtil";

function CoupleLinks() {
    return (
        <section className="vendor-nav-sticky pb-1px-grey bg-white-full"> {/**removed class: bg-light-gray */}
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <ul className="nav nav-pills my-listing-tab  justify-content-center nav-fill pt-2 pb-0" id="pills-tab1"
                            role="tablist">
                            {coupleLinks().map((link, key) => {
                                return (
                                    <li className="nav-item nav-bottom-link" role="presentation" key={`couple-link-main-${key}`}>
                                        <NavLink to={link.href} end className="nav-link">
                                            <i className={`${link.icon} fn-35`}></i>
                                            <small className="d-block mt-2 fn-bold">{link.name}</small>
                                        </NavLink>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CoupleLinks;