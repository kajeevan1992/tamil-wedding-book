import React, { useState } from 'react';
import AuthVendorHeader from "@components/auth/AuthVendorHeader";
import BusinessHeroSection from "@components/vendor/landing/HeroSection";
import TabNavigation from "@components/vendor/landing/featurePage/TabNavigation";
import TabContent from "@components/vendor/landing/featurePage/TabRoute";
import {FeatureTabData} from "@components/vendor/landing/featurePage/FeatureTabData";
import AuthVendorFooter from "@components/auth/AuthVendorFooter";
import VendorLoginForm from "@components/auth/VendorLoginForm";

const VendorFeatures = () => {
    const [activeTab, setActiveTab] = useState('features');

    const activeTabData = FeatureTabData.find(tab => tab.id === activeTab);

    return (
        <>
            <AuthVendorHeader />

            <BusinessHeroSection
                title={activeTabData.heroContent.title}
                description={activeTabData.heroContent.description}
                showLoginForm={true}
                loginFormContent={<VendorLoginForm />}
                showCTA={true}
            />

            <TabNavigation
                tabs={FeatureTabData}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
            <TabContent activeTabId={activeTab} />

            <AuthVendorFooter />
        </>
    );
};

export default VendorFeatures;