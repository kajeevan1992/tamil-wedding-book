const express = require("express");
const router = express.Router();
const controller = require("./controller");
const auth = require("../../../../services/auth_service");

router.get('/events/:vendorId',
    [auth.requireLogin, auth.onlyVendor],
    controller.index
);

router.post('/events',
    [auth.requireLogin, auth.onlyVendor],
    controller.store
);

router.post('/events/:id',
    [auth.requireLogin, auth.onlyVendor],
    controller.update
);

router.delete('/events/:id',
    [auth.requireLogin, auth.onlyVendor],
    controller.destroy
);

module.exports = router;