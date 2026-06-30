import React from 'react';
import {NavLink} from "react-router-dom";

const DealsSection = () => {
    return (
        <>
            <div className="own-container-bg h-100">
                <div className="container">
                    <div className="row p-3 p-md-5 equal-height-row align-items-stretch">
                        <div className="col-lg-6">
                            <div className="p-5">
                                <h3 className="mt-4 fw-6 own-color">Stand Out From Competitors</h3>
                                <div className="mt-4">
                                    <p>Add a Deal for your business to automatically receive a promotional flag on your listing.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div>
                                <img src="/assets/images/categories/login-9.png" alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white">
                <div className="container">
                    <div className="row p-3 p-md-5 equal-height-row align-items-stretch">
                        <div className="col-lg-6">
                            <div className="h-100 d-flex p-4">
                                <img src="/assets/images/categories/login-10.png" alt=""/>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="p-5">
                                <h3 className="mt-4 fw-6 own-color">Attract More Couples</h3>
                                <div className="mt-4">
                                    <p>Drive new business and fill your calendar by offering seasonal promotions to help meet your booking goals.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="own-container-bg h-100">
                <div className="container">
                    <div className="row p-3 p-md-5 equal-height-row align-items-stretch">
                        <div className="col-lg-6">
                            <div className="p-5">
                                <h3 className="mt-4 fw-6 own-color">Offer Exclusive Hitched Discounts</h3>
                                <div className="mt-4">
                                    <p>Offer a discount to couples who find and book you on Hitched and gain greater visibility within directory searches.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div>
                                <img src="/assets/images/categories/login-11.png" alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white">
                <div className="container">
                    <div className="row p-3 p-md-5 equal-height-row align-items-stretch">
                        <div className="col-lg-6">
                            <div  className="h-100 d-flex p-0">
                                <img src="/assets/images/categories/login-12.png" alt=""/>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="p-5">
                                <h3 className="mt-4 fw-6 own-color">Get More Exposure</h3>
                                <div className="mt-4">
                                    <p>Post a special offer or discount to get displayed in the Deals section on Hitched. You could also be included in our weekly newsletter to couples!</p>
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

export default DealsSection;