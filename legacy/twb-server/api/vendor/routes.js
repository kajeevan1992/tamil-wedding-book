const storefrontRoutes = require('./storefront/routes');
const eventRoutes = require('./storefront/event/routes');
const dealRoutes = require('./storefront/deal/routes');
const menuRoutes = require('./storefront/menu/routes');
const preferredVendorRoutes = require('./storefront/preferred_vendor/routes');
const reviewsRoutes = require('./reviews/routes');
const enquiriesRoutes = require('./enquiries/routes');
const settingsRoutes = require('./settings/routes');

module.exports = {
    storefrontRoutes,
    eventRoutes,
    dealRoutes,
    menuRoutes,
    preferredVendorRoutes,
    reviewsRoutes,
    enquiriesRoutes,
    settingsRoutes
}