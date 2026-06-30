import React from 'react';
import { NavLink } from 'react-router-dom';

const BusinessHeroSection = ({
                                 title='',
                                 bullets = [],
                                 description = '',
                                 showLoginForm = false,
                                 loginFormContent = null,
                                 showCTA = true,
                                 ctaText = "Create Your Account",
                                 ctaLink = "/vendor-register",
                                 bgImage = "./assets/images/vendors/heroSection1.jpg",
                             }) => {
    return (
        <main id="body-content">
            <section className="callout-main bg-light-gray pb-0">
                <div className="call-out-bg" style={{ backgroundImage: `url(${bgImage})` }}>
                <div className="overlay"></div>
                <div className="container pt-5">
                    <div className="row">
                        {/* Left Side - Hero Content */}
                        <div className="col-lg-8 col-md-8">
                            <h3 className="txt-white fw-6 mb-5">
                                {title}
                            </h3>

                            {/* Description */}
                            {description && (
                                <p className={`text-white ${!showLoginForm ? 'text-center' : ''}`}>
                                    {description}
                                </p>
                            )}

                            {/* If Bullet Points  Exist */}
                            {bullets.length > 0 && !description && (
                                <ul className={`list-unstyled ${!showLoginForm ? 'text-center' : ''}`}>
                                    {bullets.map((bullet, index) => (
                                        <li key={index} className="text-white own-themify mt-2">
                                            <i className="fa fa-check own-color"></i> &nbsp;
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {showCTA && (
                                <div className="d-flex justify-content-center justify-content-md-start mt-4">
                                    <NavLink to={ctaLink} end className="btn btn-primary own-family mt-4">
                                        {ctaText}
                                    </NavLink>
                                </div>
                            )}
                        </div>

                        {/* Right Side - Login Form */}
                        {showLoginForm && (
                            <div className="col-lg-4 col-md-4 col-12 mt-4 mt-md-0 px-4 px-md-3">
                                {loginFormContent}
                            </div>
                        )}
                    </div>

                </div>
                </div>




        </section>

        </main>
    );
};

export default BusinessHeroSection;