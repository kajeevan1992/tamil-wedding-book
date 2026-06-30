const authRoutes = require('./api/auth/routes');
const userRoutes = require('./api/user/routes');
const categoriesRoutes = require('./api/categories/routes');
const coupleRoutes = require('./api/couple/routes');
const vendorRoutes = require('./api/vendor/routes');

const registerRoutes = (app) => {
    app.use('/api/auth', authRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/categories', categoriesRoutes);
    app.use('/api/couple/account', coupleRoutes.accountRoutes);
    app.use('/api/couple/checklist', coupleRoutes.checklistRoutes);
    app.use('/api/couple/suppliers', coupleRoutes.supplierRoutes);
    app.use('/api/couple/guests', coupleRoutes.supplierRoutes);
    app.use('/api/couple/guests', coupleRoutes.guestListRoutes);
    app.use('/api/couple/seating-chart', coupleRoutes.seatingChartRoutes);
    app.use('/api/couple/budget-planner', coupleRoutes.budgetPlannerRoutes);
    app.use('/api/vendor/storefront', vendorRoutes.storefrontRoutes);
    app.use('/api/vendor/storefront', vendorRoutes.eventRoutes);
    app.use('/api/vendor/storefront', vendorRoutes.dealRoutes);
    app.use('/api/vendor/storefront', vendorRoutes.menuRoutes);
    app.use('/api/vendor/storefront', vendorRoutes.preferredVendorRoutes);
    app.use('/api/vendor/reviews', vendorRoutes.reviewsRoutes);
    app.use('/api/vendor/enquiries', vendorRoutes.enquiriesRoutes);
    app.use('/api/vendor/settings', vendorRoutes.settingsRoutes);
}

module.exports = registerRoutes;