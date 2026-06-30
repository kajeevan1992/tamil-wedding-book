import React from 'react';
import { NavLink } from 'react-router-dom';

const FeaturesSection = () => {
    const features = [
        {
            icon: "bi bi-list-ul",
            title: "Listing",
            description: "Beautifully display your business information and details on your custom, mobile-friendly TamilWeddingBook listing."
        },
        {
            icon: "bi bi-star",
            title: "Reviews",
            description: "Easily request, collect, and respond to reviews from past clients on TamilWeddingBook to build your online reputation."
        },
        {
            icon: "bi bi-file-text",
            title: "Deals",
            description: "Advertise special offers and discounts to attract new business and gain greater visibility in the TamilWeddingBook Directory."
        },
        {
            icon: "bi bi-calendar4-event",
            title: "Events",
            description: "Promote upcoming events on your listings to encourage couples to attend and learn more about your business."
        },
        {
            icon: "bi bi-chat-square-text",
            title: "Messages",
            description: "Receive instant lead notifications to your email and phone. Plus, save templates to quickly respond to couples."
        },
        {
            icon: "bi bi-view-list",
            title: "Insights",
            description: "Monitor your listing performance details including visits, leads received, average response time, and more."
        }
    ];

    return (
        <section className="pt-5 bg-white">
            <div className="container-fluid features-container">
                <div className="row">
                    {features.map((feature, index) => (
                        <div key={index} className="col-lg-4 col-md-6">
                            <div className="text-center p-4 h-100">
                                <div className="pb-3">
                                    <i className={feature.icon} style={{ fontSize: '2.5rem' }}></i>
                                </div>
                                <h4 className="fw-6 mb-3">{feature.title}</h4>
                                <p className="text-muted">{feature.description}</p>
                            </div>
                        </div>
                    ))}
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
        </section>
    );
};

export default FeaturesSection;
