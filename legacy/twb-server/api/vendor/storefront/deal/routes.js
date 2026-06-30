const express = require("express");
const router = express.Router();
const controller = require("./controller");
const auth = require("../../../../services/auth_service");

router.get('/deals/:vendorId',
    [auth.requireLogin, auth.onlyVendor],
    controller.index
);

router.post('/deals',
    [auth.requireLogin, auth.onlyVendor],
    controller.store
);

router.post('/deals/:id',
    [auth.requireLogin, auth.onlyVendor],
    controller.update
);

router.delete('/deals/:id',
    [auth.requireLogin, auth.onlyVendor],
    controller.destroy
);

module.exports = router;