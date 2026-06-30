const express = require("express");
const router = express.Router();
const controller = require("./controller");
const auth = require("../../../services/auth_service")

router.get('/load-suppliers/:coupleId',
    [auth.requireLogin, auth.onlyCouple],
    controller.loadSuppliers
);

router.get('/load-vendors/:coupleId/:vendorCategoryId',
    [auth.requireLogin, auth.onlyCouple],
    controller.loadVendorsByCategory
);

router.post('/search',
    [auth.requireLogin, auth.onlyCouple],
    controller.search
);

router.post('/store-supplier',
    [auth.requireLogin, auth.onlyCouple],
    controller.storeSupplier
);

router.post('/create-and-invite-vendor',
    [auth.requireLogin, auth.onlyCouple],
    controller.createAndInviteVendor
);

router.post('/change-selected-vendor',
    [auth.requireLogin, auth.onlyCouple],
    controller.changeSelectedVendor
);

router.post('/remove-selected-vendor',
    [auth.requireLogin, auth.onlyCouple],
    controller.removeSelectedVendor
);

module.exports = router;