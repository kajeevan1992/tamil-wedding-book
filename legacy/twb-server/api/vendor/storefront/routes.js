const express = require("express");
const router = express.Router();
const controller = require("./controller");
const auth = require("../../../services/auth_service");

router.get('/store-front-initials',
    [auth.requireLogin, auth.onlyVendor],
    controller.storeFrontInitials
);

router.post('/store-front-initials',
    [auth.requireLogin, auth.onlyVendor],
    controller.createStoreFrontInitials
);

router.post('/delete-storefront-image',
    [auth.requireLogin, auth.onlyVendor],
    controller.deleteStorefrontImage
);

router.post('/update-faqs',
    [auth.requireLogin, auth.onlyVendor],
    controller.updateFaqs
);

router.get('/get-social-links/:vendorId',
    [auth.requireLogin, auth.onlyVendor],
    controller.getSocialLinks
);

router.post('/update-social-links/:vendorId',
    [auth.requireLogin, auth.onlyVendor],
    controller.updateSocialLinks
);

router.post('/create-and-invite-vendor',
    [auth.requireLogin, auth.onlyVendor],
    controller.createAndInviteVendor
);
module.exports = router;