const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.get('/load-categories', controller.categories);

module.exports = router;