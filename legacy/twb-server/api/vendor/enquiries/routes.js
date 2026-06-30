const express = require("express");
const router = express.Router();
const controller = require("./controller");
const auth = require("../../../services/auth_service");

// Specific routes must come before parameterized routes
router.get(
    "/export",
    [auth.requireLogin, auth.onlyVendor],
    controller.exportToExcel
);

router.get(
    "/:vendorId",
    [auth.requireLogin, auth.onlyVendor],
    controller.loadEnquiries
);

router.get(
    "/:vendorId/:enquiryId",
    [auth.requireLogin, auth.onlyVendor],
    controller.loadEnquiry
);

router.post(
    "/reply",
    [auth.requireLogin, auth.onlyVendor],
    controller.postEnquiryReply
);

router.delete(
    "/:vendorId/:enquiryId",
    [auth.requireLogin, auth.onlyVendor],
    controller.deleteEnquiry
);

module.exports = router;
