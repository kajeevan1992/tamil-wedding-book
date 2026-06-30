const express = require("express");
const router = express.Router();
const controller = require("./controller");
const auth = require("../../../services/auth_service")

router.get('/load-checklists/:coupleId',
    [auth.requireLogin, auth.onlyCouple],
    controller.loadChecklists
);
router.post('/create-update-checklist',
    [auth.requireLogin, auth.onlyCouple],
    controller.createUpdateChecklist
);

router.post('/change-checklist-status',
    [auth.requireLogin, auth.onlyCouple],
    controller.changeChecklistStatus
);


module.exports = router;