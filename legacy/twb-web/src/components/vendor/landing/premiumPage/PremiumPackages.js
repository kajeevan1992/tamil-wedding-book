import React from 'react';
import {venuePackages, supplierPackages, UpgradePackages} from '../premiumPage/PremiumPackageList';

const PremiumPackages = ({selectedType, packageSelected, setPackageSelected}) => {
    const packagesList =
        selectedType === 'Venue' ? venuePackages : supplierPackages;

    return (
        <div className="container py-3 p-5">
            <div className="row g-4 justify-content-center  mb-4 mb-lg-0 ">
                {packagesList.map((pkg, index) => (
                    <div key={index} className="col-lg-3 col-md-6 col-sm-10 col-11 px-2">
                        <div className="card card-shadow mb-3 mb-sm-4  card-header-clickable"
                             onClick={() => setPackageSelected(index)}>
                            <div
                                className={`text-center py-4 ${
                                    packageSelected === index ? 'bg-danger text-white' : 'bg-grey'
                                }`}
                            >
                                <h5 className="fw-6 mb-0">
                                    {pkg.name}
                                </h5>
                            </div>
                            <p className="text-muted text-center small m-2">
                                {pkg.description}
                            </p>
                            <div className="p-3 m-2 text-center d-flex justify-content-center">
                                <button className='btn own-button fw-6 w-100 w-md-auto'>
                                    Choose a plan
                                </button>
                            </div>


                        </div>

                        {/* Features */}
                        <div className="card card-shadow mb-4 mb-lg-0">
                            <div className="card-body p-4">
                                <ul className="list-unstyled mb-0 small">
                                    {pkg.features.map((feature, i) => (
                                        <li key={i} className="mb-2">
                                            {feature}
                                            <hr className="w-100 border-0 mx-auto bg-d9d9d9 h-2"/>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}

            </div>

            {selectedType === "Supplier" && (
                <div className="text-center pb-4 mt-5">
                    <h5 className="fw-6">Upgrades</h5>
                    <p className="text-muted small m-2">Explore add-ons that'll boost your exposure</p>

                    <div className="row justify-content-center mt-4 g-4 mb-5">
                        {UpgradePackages.map((pkg, index) => (
                            <div key={index} className="col-lg-3 col-md-6 col-sm-10 mt-3 col-11 px-2">
                                <div className="card card-shadow h-100 mb-4 mb-lg-0">
                                    <div className="text-center py-4 bg-grey">
                                        <h5 className="fw-6 mb-0">{pkg.name}</h5>
                                    </div>
                                    <p className="text-muted text-center small m-2 p-3">
                                        {pkg.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}


        </div>
    );
};

export default PremiumPackages;
