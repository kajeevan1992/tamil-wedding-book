const express = require("express");
const router = express.Router();
const controller = require("./controller");
const auth = require("../../../services/auth_service");

router.get('/:vendorId',
    [auth.requireLogin, auth.onlyVendor],
    controller.getSettings
);

router.post('/:id',
    [auth.requireLogin, auth.onlyVendor],
    controller.updateSettings
);

module.exports = router;