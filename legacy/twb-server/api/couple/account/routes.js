const express = require("express");
const router = express.Router();
const controller = require("./controller");
const auth = require("../../../services/auth_service")

router.post('/update-laststep-wedding-details',
    [auth.requireLogin, auth.onlyCouple],
    controller.updateLastStepWeddingDetails
);

router.post('/link-account-invitation',
    [auth.requireLogin, auth.onlyCouple],
    controller.linkAccountInvitation
);

router.post('/remove-linked-account',
    [auth.requireLogin, auth.onlyCouple],
    controller.removeLinkedAccount
);

router.post('/accept-linking-account-invitation',
    controller.acceptLinkingAccountInvitation
);

router.get('/wedding-details/:coupleId',
    controller.getWeddingDetails
);

router.post('/update-profile-and-wedding-detail',
    [auth.requireLogin, auth.onlyCouple],
    controller.updateProfileAndWeddingDetail
);

router.post('/update-wedding-card-photo',
    [auth.requireLogin, auth.onlyCouple],
    controller.updateWeddingCardPhoto
);


module.exports = router;