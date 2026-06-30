const express = require("express");
const router = express.Router();
const controller = require("./controller");
const auth = require("../../../../services/auth_service");

router.get('/menus/:vendorId',
    [auth.requireLogin, auth.onlyVendor],
    controller.index
);

router.post('/menus',
    [auth.requireLogin, auth.onlyVendor],
    controller.store
);

router.post('/menus/:id',
    [auth.requireLogin, auth.onlyVendor],
    controller.update
);

router.delete('/menus/:id',
    [auth.requireLogin, auth.onlyVendor],
    controller.destroy
);

module.exports = router;