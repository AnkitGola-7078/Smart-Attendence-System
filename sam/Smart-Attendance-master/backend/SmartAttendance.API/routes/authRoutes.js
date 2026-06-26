const express = require("express");

const router = express.Router();

const authController = require("../controllers/AuthController");
const auth = require("../middleware/auth");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/profile", auth, authController.profile);

router.put("/profile", auth, authController.updateProfile);

router.post("/forgot-password", authController.forgotPassword);

router.post("/verify-otp", authController.verifyOtp);

router.post("/reset-password", authController.resetPassword);

module.exports = router;