const express = require("express");
const router = express.Router();
const auth = require("../../services/auth_service");
const controller = require("./controller");

// Couple
router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/profile', auth.requireLogin, controller.profile);
router.post('/request-reset-password', controller.requestResetPassword);
router.post('/verify-user', controller.verifyUser);
router.post('/reset-password', controller.resetPassword);
router.get('/resend-verification-email', controller.resendVerificationEmail);

// Vendor
router.post('/register-vendor', controller.registerVendor);


module.exports = router;    