const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Alert = require("../models/Alert");
const AccessRequest = require("../models/AccessRequest");
const emailService = require("../services/EmailService");

// ==========================
// GET ALL USERS
// ==========================
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();

    const result = users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      profileImage: user.profileImage,
      hasFaceData: user.faceData?.length > 0,
      emailDeliveryStatus: user.emailDeliveryStatus,
      lastEmailAttempt: user.lastEmailAttempt,
      createdAt: user.createdAt,
      isDisabled: user.isDisabled,
      temporaryPassword: user.temporaryPassword,
      temporaryPasswordCreatedAt: user.temporaryPasswordCreatedAt,
      isPasswordChanged: user.isPasswordChanged,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================
// GET USER
// ==========================
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================
// CREATE USER
// ==========================
exports.createUser = async (req, res) => {
  try {
    const data = req.body;

    const exists = await User.findOne({
      email: data.email,
    });

    if (exists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    data.password = await bcrypt.hash(data.password, 10);

    const user = await User.create(data);

    const response = user.toObject();
    delete response.password;

    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================
// UPDATE USER
// ==========================
exports.updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================
// DELETE USER
// ==========================
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    await User.findByIdAndDelete(req.params.id);

    await Attendance.deleteMany({
      userId: req.params.id,
    });

    await Alert.deleteMany({
      userId: req.params.id,
    });

    await AccessRequest.deleteMany({
      email: user.email,
    });

    res.json({
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================
// RESEND CREDENTIALS
// ==========================
exports.resendCredentials = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    const password = `User@${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    user.password = await bcrypt.hash(password, 10);
    user.temporaryPassword = password;
    user.temporaryPasswordCreatedAt = new Date();
    user.isPasswordChanged = false;
    user.emailDeliveryStatus = "Pending";

    await user.save();

    await emailService.sendWelcomeEmail(user, password);

    res.json({
      message: "Credentials sent successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================
// GENERATE CREDENTIALS
// ==========================
exports.generateCredentials = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    const password = `User@${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    user.password = await bcrypt.hash(password, 10);
    user.temporaryPassword = password;
    user.temporaryPasswordCreatedAt = new Date();
    user.isPasswordChanged = false;

    await user.save();

    res.json({
      password,
      message: "Temporary password generated",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================
// ENABLE / DISABLE USER
// ==========================
exports.toggleStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    user.isDisabled = !user.isDisabled;

    await user.save();

    res.json({
      message: user.isDisabled
        ? "User Disabled"
        : "User Enabled",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};