import React,{useState} from 'react';
import AuthVendorHeader from "@components/auth/AuthVendorHeader";
import AuthVendorFooter from "@components/auth/AuthVendorFooter";
import BusinessHeroSection from "@components/vendor/landing/HeroSection";
import VendorLoginForm from "@components/auth/VendorLoginForm";
import {NavLink} from "react-router-dom";
import PremiumPackages from "@components/vendor/landing/premiumPage/PremiumPackages";

const VendorPremiumService = () => {
    const [selectedType, setSelectedType] = useState('Venue');
    const [packageSelected, setPackageSelected] = useState(null);

    return (
        <>
            <AuthVendorHeader />
            <BusinessHeroSection
                title="Get more leads for your business"
                description="At TamilWeddingBook we are committed to the success of your business. We have a choice of upgraded packages which will increase your exposure to gain new customers."
                showLoginForm={true}
                loginFormContent={<VendorLoginForm />}
                showCTA={true}
            />
            <section className="wide-tb-100">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="ml-2 text-center">
                                <img src="/assets/images/categories/login-icon1.png" className="" width="26%" alt="" />
                            </div>
                            <div className="mt-5">
                                <h3 className="own-color text-center">Best positioning</h3>
                                <p className="mt-5 text-center">Better visibility on our website and mobile apps drives more connections with wedding couples</p>
                            </div>

                        </div>
                        <div className="col-lg-4">
                            <div className="ml-2 text-center">
                                <img src="/assets/images/categories/login-icon2.png" className="" width="26%" alt="" />
                            </div>
                            <div className="mt-5">
                                <h3 className="own-color text-center">Visible data</h3>
                                <p className="mt-5 text-center">You can collect responses from couples along with tracking phone calls and clicks to your website</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="ml-2 text-center">
                                <img src="/assets/images/categories/login-icon3.png" className="" width="26%" alt="" />
                            </div>
                            <div className="mt-5">
                                <h3 className="own-color text-center">More sales</h3>
                                <p className="mt-5 text-center">TamilweddingBook drives 1000s of high-quality leads to wedding professionals every day</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className=" bg-light-gray pb-0">
                <h3 className="txt-dark text-center  fw-6 pt-3">Services from TamilWeddingBook</h3>
                <p className='text-center mb-3'>
                    Discover the plan that best suits your business
                </p>
                <p className='txt-danger text-center mb-4'>
                    Are you a...
                </p>

                <div className="row g-0 justify-content-center mt-2 px-3">
                    <div>
                        <button
                            className={`btn me-0 ${selectedType === 'Venue' ? 'btn-outline-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setSelectedType('Venue')}
                            disabled={selectedType === 'Venue'}
                        >
                            Venue
                        </button>
                    </div>
                    <div>
                        <button
                            className={`btn ms-0 ${selectedType === 'Supplier' ? 'btn-outline-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setSelectedType('Supplier')}
                            disabled={selectedType === 'Supplier'}
                        >
                            Supplier
                        </button>
                    </div>
                </div>
                <div className="text-center mt-5">
                    <hr className="w-60 border-0 mx-auto bg-d9d9d9 h-2"/>
                </div>
                <div>
                    <PremiumPackages
                        selectedType={selectedType}
                        packageSelected={packageSelected}
                        setPackageSelected={setPackageSelected}
                    />
                </div>

            </section>

                <section className="wide-tb-100 pb-0 pt-0">
                <div className="call-out-bg" style={{
                    backgroundImage: `url("../../assets/images/categories/service1.png")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
                    <div className="overlay"></div>
                    <div className="container pt-5">
                        <div className="row align-items-center">
                            <div className="col-lg-8 col-md-8">
                                <h3 className="txt-white fw-6 mb-3">Start now</h3>
                                <p className='text-white mb-5'>
                                    Find out how we can help you grow your business
                                </p>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <p className='text-white text-center mb-3'>
                                            If you need more information contact us
                                        </p>
                                        <NavLink to="www.google.com" className="btn btn-primary own-family d-block mx-auto">
                                            Contact Us
                                        </NavLink>
                                    </div>
                                    <div className="col-lg-6">
                                        <p className='text-white text-center mb-3'>
                                            Call us now & request proposal without commitment
                                        </p>
                                        <NavLink to="www.google.com" className="btn btn-primary own-family d-block mx-auto">
                                            XXXX XXX XXXX
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <AuthVendorFooter />
        </>
    );
};

export default VendorPremiumService;