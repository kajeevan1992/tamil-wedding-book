const express = require("express");
const router = express.Router();
const controller = require("./controller");
const auth = require("../../../services/auth_service")

router.get('/load-guests/:coupleId',
    [auth.requireLogin, auth.onlyCouple],
    controller.loadGuestsData
);

router.post('/create-update-event',
    [auth.requireLogin, auth.onlyCouple],
    controller.createUpdateEvent
);

router.post('/delete-event-option',
    [auth.requireLogin, auth.onlyCouple],
    controller.deleteEventOption
);

router.post('/delete-event/:id',
    [auth.requireLogin, auth.onlyCouple],
    controller.deleteEvent
);

router.post('/load-selected-filter-data',
    [auth.requireLogin, auth.onlyCouple],
    controller.loadSelectedFilterData
);


router.post('/create-update-item',
    [auth.requireLogin, auth.onlyCouple],
    controller.createUpdateItem
);

router.post('/delete-item',
    [auth.requireLogin, auth.onlyCouple],
    controller.deleteItem
);

router.post('/add-guest',
    [auth.requireLogin, auth.onlyCouple],
    controller.addGuest
);

router.post('/update-guest',
    [auth.requireLogin, auth.onlyCouple],
    controller.updateGuest
);

router.post('/action-on-companion',
    [auth.requireLogin, auth.onlyCouple],
    controller.actionOnCompanion
);

router.delete('/delete-guest-with-companions/:id',
    [auth.requireLogin, auth.onlyCouple],
    controller.deleteGuestWithCompanions
);

router.post('/action-on-multiple-guests',
    [auth.requireLogin, auth.onlyCouple],
    controller.actionOnMultipleGuests
);

router.post('/change-guest-event-status',
    [auth.requireLogin, auth.onlyCouple],
    controller.changeGuestEventStatus
);

router.post('/add-guest-by-link',
    controller.addGuestByLink
);

router.post('/bulk-create-by-spreadsheet',
    [auth.requireLogin, auth.onlyCouple],
    controller.bulkCreateBySpreadsheet
);

module.exports = router;