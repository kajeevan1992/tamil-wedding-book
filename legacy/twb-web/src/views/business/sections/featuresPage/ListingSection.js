import React from 'react';
import {NavLink} from "react-router-dom";

const ListingSection = () => {
    return (
        <>
            <div className="own-container-bg h-100">
                <div className="container">
                    <div className="row p-3 p-md-5 equal-height-row align-items-stretch">
                        <div className="col-lg-6">
                            <div className="p-5">
                                <h3 className="mt-4 fw-6 own-color">Get Greater Exposure For Your Business</h3>
                                <div className="mt-4">
                                    <p>Be visible to couples on top search engines with your custom, mobile friendly
                                        listing.
                                        Our Content Team will review and optimise your business description, photos,
                                        and videos to boost your SEO ranking.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div>
                                <img src="/assets/images/categories/login-1.png" alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white">
                <div className="container">
                    <div className="row p-3 p-md-5 equal-height-row align-items-stretch">
                        <div className="col-lg-6">
                            <div>
                                <img src="/assets/images/categories/login-2.png" alt=""/>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="p-5">
                                <h3 className="mt-4 fw-6 own-color">Add Unlimited Photos To Your Gallery</h3>
                                <div className="mt-4">
                                    <p>Show off your work to engaged couples by uploading high-quality images that
                                        showcase your wedding business and services.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="own-container-bg">
                <div className="container">
                    <div className="row p-3 p-md-5 equal-height-row align-items-stretch">
                        <div className="col-lg-6">
                            <div className="p-5">
                                <h3 className="mt-4 fw-6 own-color">Upload Videos</h3>
                                <div className="mt-4">
                                    <p>Promote your wedding business and services by adding unlimited videos to your
                                        listing.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div>
                                <img src="/assets/images/categories/login-3.png" alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white">
                <div className="container">
                    <div className="row p-3 p-md-5 equal-height-row align-items-stretch">
                        <div className="col-lg-6">
                            <div>
                                <img src="/assets/images/categories/login-4.png" alt=""/>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="p-5">
                                <h3 className="mt-4 fw-6 own-color">Attract Engaged Couples</h3>
                                <div className="mt-4">
                                    <p>Share key details about your business to help couples find what they need,
                                        including pricing and FAQs.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="brown-bg-section">
                <div className="container-fluid px-0">
                    <div className="row equal-height-row align-items-stretch no-gutters">
                        <div className="col-lg-6 p-0">
                            <img src="/assets/images/categories/featurebg.png"
                                 className="img-fluid w-100 h-100"/>
                        </div>
                        <div className="col-lg-6 d-flex align-items-center p-5">
                            <div  className="m-auto">
                                <h2 className="fw-6 text-white mb-5">Grow Your Business with TamilWeddingBook!</h2>
                                <NavLink to="/vendor-register" className="btn btn-primary px-5 py-3 mt-2">
                                    Create Your Account
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
};

export default ListingSection;