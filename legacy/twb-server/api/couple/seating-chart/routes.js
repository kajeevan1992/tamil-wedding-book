const express = require("express");
const router = express.Router();
const controller = require("./controller");
const auth = require("../../../services/auth_service")

router.get('/load-wedding-events/:coupleId',
    [auth.requireLogin, auth.onlyCouple],
    controller.loadWeddingEvents
);

router.get('/load-event-tables-and-guests/:eventId',
    [auth.requireLogin, auth.onlyCouple],
    controller.loadEventTablesAndGuests
);

router.post('/set-table-position',
    [auth.requireLogin, auth.onlyCouple],
    controller.setTablePosition
);

router.post('/set-guest-seat',
    [auth.requireLogin, auth.onlyCouple],
    controller.setGuestSeat
);

router.post('/un-seat-guest',
    [auth.requireLogin, auth.onlyCouple],
    controller.unSeatGuest
);

router.delete('/delete-table/:eventId/:tableId',
    [auth.requireLogin, auth.onlyCouple],
    controller.deleteTable
);

router.post('/change-window-height',
    [auth.requireLogin, auth.onlyCouple],
    controller.changeWindowHeight
);

module.exports = router;