const accountRoutes = require('./account/routes');
const checklistRoutes = require('./checklist/routes');
const supplierRoutes = require('./vendors/routes');
const guestListRoutes = require('./guests/routes');
const seatingChartRoutes = require('./seating-chart/routes');
const budgetPlannerRoutes = require('./budget-planner/routes');

module.exports = {
    accountRoutes,
    checklistRoutes,
    supplierRoutes,
    guestListRoutes,
    seatingChartRoutes,
    budgetPlannerRoutes,
}