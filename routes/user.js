const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/users.js');


// signup releted
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(userController.signUp);

// login releted

router.route("/login")
    .get(userController.renderloginForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login);



// logout Route
router.get("/logout", userController.logout);

module.exports = router;