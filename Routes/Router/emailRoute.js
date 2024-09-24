const express = require("express");
const router = express.Router();

const User = require("../../Controller/emailController");

const { checkTokenExpiry } = User;

router.post("/signin", User.Signin);

router.post("/verify-otp", User.verifyOTP);

router.post("/logout", User.logout);

router.post("/refresh-token", User.refreshToken);

router.post("/validate", User.Validate);

module.exports = router;
