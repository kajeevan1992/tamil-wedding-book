const express = require("express");
const router = express.Router();
const controller = require("./controller");
const auth = require("../../../services/auth_service");

router.post(
    "/request",
    [auth.requireLogin, auth.onlyVendor],
    controller.reviewRequest
);

router.get(
    "/:vendorId",
    [auth.requireLogin, auth.onlyVendor],
    controller.loadReviews
);

module.exports = router;
