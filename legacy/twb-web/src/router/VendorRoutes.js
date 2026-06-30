import DashboardLayout from "@views/dashboard/Layout";
import Dashboard from "@views/dashboard/vendor/Dashboard";
import EnquiriesLayout from "@views/dashboard/vendor/EnquiriesLayout";
import VendorLayout from "@views/dashboard/vendor/Layout";
import StorefrontLayout from "@views/dashboard/vendor/StorefrontLayout";
import ExportToExcel from "@views/dashboard/vendor/enquiries/ExportToExcel";
import EnquiriesInbox from "@views/dashboard/vendor/enquiries/Inbox";
import StorefrontBusinessDetail from "@views/dashboard/vendor/storefront/BusinessDetail";
import StorefrontBusinessImages from "@views/dashboard/vendor/storefront/BusinessImages";
import StorefrontBusinessLocation from "@views/dashboard/vendor/storefront/BusinessLocation";
import StorefrontBusinessVideos from "@views/dashboard/vendor/storefront/BusinessVideos";
import { Route, Routes } from "react-router-dom";

import NotFound from "@views/NotFound";

// Account
import InvoicesLayout from "@views/dashboard/vendor/InvoicesLayout";
import ReviewsLayout from "@views/dashboard/vendor/ReviewsLayout";
import SettingsLayout from "@views/dashboard/vendor/SettingsLayout";
import CreateStorefront from "@views/dashboard/vendor/account/CreateStoreFront";
import PaymentsMethods from "@views/dashboard/vendor/invoices/PaymentsMethods";
import Badges from "@views/dashboard/vendor/reviews/Badges";
import ReviewCollector from "@views/dashboard/vendor/reviews/ReviewCollector";
import ReviewWidget from "@views/dashboard/vendor/reviews/ReviewWidget";
import Reviews from "@views/dashboard/vendor/reviews/Reviews";
import Settings from "@views/dashboard/vendor/settings/Settings";
import BusinessDeals from "@views/dashboard/vendor/storefront/BusinessDeals";
import BusinessEvent from "@views/dashboard/vendor/storefront/BusinessEvents";
import BusinessMenus from "@views/dashboard/vendor/storefront/BusinessMenus";
import FAQs from "@views/dashboard/vendor/storefront/FAQs";
import PreferredVendors from "@views/dashboard/vendor/storefront/PreferredVendors";
import SocialLinks from "@views/dashboard/vendor/storefront/SocialLinks";
import TamilWeddingBookButton from "@views/dashboard/vendor/storefront/TamilWeddingBookButton";

function VendorRoute() {
    return (
        <>
            <Routes>
                <Route element={<DashboardLayout />}>
                    <Route path="" element={<VendorLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="storefront" element={<StorefrontLayout />}>
                            <Route
                                index
                                element={<StorefrontBusinessDetail />}
                            />
                            <Route
                                path="location"
                                element={<StorefrontBusinessLocation />}
                            />
                            <Route
                                path="images"
                                element={<StorefrontBusinessImages />}
                            />
                            <Route
                                path="videos"
                                element={<StorefrontBusinessVideos />}
                            />
                            <Route path="faqs" element={<FAQs />} />
                            <Route path="events" element={<BusinessEvent />} />
                            <Route path="deals" element={<BusinessDeals />} />
                            <Route path="menus" element={<BusinessMenus />} />
                            <Route
                                path="social-links"
                                element={<SocialLinks />}
                            />
                            <Route
                                path="preferred-vendor"
                                element={<PreferredVendors />}
                            />
                            <Route
                                path="tamil-wedding-book-button"
                                element={<TamilWeddingBookButton />}
                            />
                        </Route>
                        <Route path="enquiries" element={<EnquiriesLayout />}>
                            <Route index element={<EnquiriesInbox />} />
                            <Route path="unread" element={<EnquiriesInbox />} />
                            <Route path="read" element={<EnquiriesInbox />} />
                            <Route
                                path="pending"
                                element={<EnquiriesInbox />}
                            />
                            <Route
                                path="responded"
                                element={<EnquiriesInbox />}
                            />
                            <Route path="booked" element={<EnquiriesInbox />} />
                            <Route
                                path="export-to-excel"
                                element={<ExportToExcel />}
                            />
                            <Route
                                path=":enquiryId"
                                element={<EnquiriesInbox />}
                            />
                        </Route>
                        <Route path="reviews" element={<ReviewsLayout />}>
                            <Route index element={<ReviewCollector />} />
                            <Route path="reviews-list" element={<Reviews />} />
                            <Route path="badges" element={<Badges />} />
                            <Route
                                path="review-widget"
                                element={<ReviewWidget />}
                            />
                        </Route>
                        <Route path="invoices" element={<InvoicesLayout />}>
                            <Route index element={<PaymentsMethods />} />
                        </Route>
                        <Route path="settings" element={<SettingsLayout />}>
                            <Route index element={<Settings />} />
                        </Route>
                        <Route path="create-storefront">
                            <Route index element={<CreateStorefront />} />
                        </Route>
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </>
    );
}

export default VendorRoute;
