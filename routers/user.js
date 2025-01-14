const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../loginMiddleware.js");

const userController = require("../controllers/user.js")

router.route("/signup")
.get(userController.renderSignupPage)
.post(wrapAsync(userController.createUser))

router.route("/login")
    .get(userController.renderLoginPage)
    .post(
        saveRedirectUrl, // Save the redirect URL before login
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }),
        userController.postLogin  // Handle login after saving redirect URL
    );
router.get("/logout",userController.userLogout)


module.exports = router;