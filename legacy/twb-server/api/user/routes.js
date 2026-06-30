const express = require("express");
const router = express.Router();
const auth = require("../../services/auth_service");
const controller = require("./controller");

router.post('/vendors/search', controller.search);
router.post('/vendors/filter', controller.filter);
router.get('/vendors/:id', controller.loadVendor);
router.get('/notifications', auth.requireLogin, controller.notifications);
router.get('/vendors/:id/gallery', controller.loadGallery);
router.get('/vendors/:id/reviews', controller.loadReviews);
router.post('/vendors/reviews', controller.postReview);
router.post('/vendors/pricing-request', controller.requestPricing);

module.exports = router;    