const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const usersController = require("../controllers/UsersController");
const authController = require("../controllers/AuthController");

// ================= AUTH =================

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// ================= PROFILE =================

// Logged in user profile
router.get("/profile", auth, authController.profile);

// Update own profile
router.put("/profile", auth, authController.updateProfile);

// Forgot Password
router.post("/forgot-password", authController.forgotPassword);

// Verify OTP
router.post("/verify-otp", authController.verifyOtp);

// Reset Password
router.post("/reset-password", authController.resetPassword);

// ================= USERS CRUD =================

// Get all users
router.get("/", auth, usersController.getUsers);

// Get single user
router.get("/:id", auth, usersController.getUser);

// Create user
router.post("/", auth, usersController.createUser);

// Update user
router.put("/:id", auth, usersController.updateUser);

// Delete user
router.delete("/:id", auth, usersController.deleteUser);

// Generate credentials
router.post(
  "/:id/generate-credentials",
  auth,
  usersController.generateCredentials
);

// Resend credentials
router.post(
  "/:id/resend-credentials",
  auth,
  usersController.resendCredentials
);

// Enable / Disable user
router.put(
  "/:id/toggle-status",
  auth,
  usersController.toggleStatus
);

module.exports = router;