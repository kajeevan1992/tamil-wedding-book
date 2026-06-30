import { NavLink } from "react-router-dom";

export default function RegisterWelcome(props) {
    return (
        <div className="col-12 col-lg-12 px-xl-2 mx-auto min-h-100vh d-flex align-items-center">
            <div className="col-9">
                <h1 className="welcomeStTitle">
                    <i className="bi bi-check-circle-fill text-success"></i> Welcome to Tamil Wedding Book!
                </h1>
                <p className="welcomeStDescription">
                    You're one step away from growing your business.
                </p>
                <div className="welcomeStoreFront">
                    <div className="nextButtonDiv">
                        <p className="nextButtonText">next</p>
                    </div>
                    <div className="d-flex align-items-center ">
                        <div>
                            <h3 className="welcomeSubTitle">
                                Prepare your storefront
                            </h3>
                            <p className="welcomeSubDesc">
                                Follow these simple steps to create a storefront
                                that will attract your ideal couples.
                            </p>
                        </div>
                        <div>
                            <img
                                src="/assets/images/store_front_img.png"
                                alt="store front image"
                                className="storeFrontIcon"
                            />
                        </div>
                    </div>
                    <NavLink to={`/${props.app.profile.role}/create-storefront`} className="btn btn-primary">
                        Create your storefront
                    </NavLink>
                </div>
            </div>
        </div>
    );
}