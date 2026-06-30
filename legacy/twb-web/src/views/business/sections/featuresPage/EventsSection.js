import React from 'react';
import {NavLink} from "react-router-dom";

const EventsSection = () => {
    return (
        <>
            <div className="own-container-bg h-100">
                <div className="container">
                    <div className="row p-3 p-md-5 equal-height-row align-items-stretch">
                        <div className="col-lg-6">
                            <div className="h-100 d-flex p-3">
                                <img src="/assets/images/categories/login-13.png" alt=""/>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="p-5">
                                <h3 className="mt-4 fw-6 own-color">Promote Your Upcoming Events</h3>
                                <div className="mt-4">
                                    <p>From open houses to wedding fairs, advertise any wedding events you are hosting on your Hitched listing and encourage couples to attend and learn more about your business.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white">
                <div className="container">
                    <div className="row p-3 p-md-5 equal-height-row align-items-stretch">
                        <div className="col-lg-6">
                            <div className="p-5">
                                <h3 className="mt-4 fw-6 own-color">Share Key Event Details</h3>
                                <div className="mt-4">
                                    <p>Include date, time, location, and a description of your event so that couples have all the information they need to attend in one place.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div  className="h-100 d-flex p-5">
                                <img src="/assets/images/categories/login-14.png" alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="own-container-bg h-100">
                <div className="container">
                    <div className="row p-3 p-md-5 equal-height-row align-items-stretch">
                        <div className="col-lg-6">
                            <div className="h-100 d-flex p-3">
                                <img src="/assets/images/categories/login-15.png" alt=""/>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="p-5">
                                <h3 className="mt-4 fw-6 own-color">Meet More Engaged Couples</h3>
                                <div className="mt-4">
                                    <p>Hosting events helps to promote your wedding business and services and allows you to meet more couples in-person.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white">
                <div className="container">
                    <div className="row p-3 p-md-5 equal-height-row align-items-stretch">
                        <div className="col-lg-6">
                            <div className="p-5">
                                <h3 className="mt-4 fw-6 own-color">Manage your reviews</h3>
                                <div className="mt-4">
                                    <p>Request, respond and even dispute reviews right from your account dashboard or TamilWeddingBook Business app.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div>
                                <img src="/assets/images/categories/login-8.png" alt=""/>
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

export default EventsSection;