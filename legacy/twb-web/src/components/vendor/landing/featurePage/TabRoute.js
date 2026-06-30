import React from 'react';
import FeaturesSection from '@views/business/sections/featuresPage/FeaturesSection';
import ListingSection from '@views/business/sections/featuresPage/ListingSection';
import ReviewsSection from '@views/business/sections/featuresPage/ReviewsSection';
import DealsSection from '@views/business/sections/featuresPage/DealsSection';
import EventsSection from '@views/business/sections/featuresPage/EventsSection';
import MessagesSection from '@views/business/sections/featuresPage/MessagesSection';
import InsightsSection from '@views/business/sections/featuresPage/InsightsSection';

const TabContent = ({ activeTabId }) => {
    const renderContent = () => {
        switch (activeTabId) {
            case 'features':
                return <FeaturesSection />;
            case 'listing':
                return <ListingSection />;
            case 'reviews':
                return <ReviewsSection />;
            case 'deals':
                return <DealsSection />;
            case 'events':
                return <EventsSection />;
            case 'messages':
                return <MessagesSection />;
            case 'insights':
                return <InsightsSection />;
            default:
                return <FeaturesSection />;
        }
    };

    return <div>{renderContent()}</div>;
};

export default TabContent;