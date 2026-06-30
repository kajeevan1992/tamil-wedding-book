const express = require("express");
const router = express.Router();
const controller = require("./controller");
const auth = require("../../../../services/auth_service");

router.get('/preferred-vendor/:vendorId',
    [auth.requireLogin, auth.onlyVendor],
    controller.index
);

router.post('/preferred-vendor/search',
    [auth.requireLogin, auth.onlyVendor],
    controller.search
);

router.post('/preferred-vendor',
    [auth.requireLogin, auth.onlyVendor],
    controller.store
);

router.delete('/preferred-vendor/:id',
    [auth.requireLogin, auth.onlyVendor],
    controller.destroy
);

router.post('/preferred-vendor/:id',
    [auth.requireLogin, auth.onlyVendor],
    controller.update
);

module.exports = router; 