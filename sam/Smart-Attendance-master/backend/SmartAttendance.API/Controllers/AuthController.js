const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const emailService = require("../services/EmailService");

// ============================
// Generate JWT
// ============================
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ============================
// REGISTER
// POST /api/auth/register
// ============================
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      department,
      profileImage,
    } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      profileImage,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ============================
// LOGIN
// POST /api/auth/login
// ============================
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    if (user.isDisabled) {
      return res.status(403).json({
        message: "Account Disabled",
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match)
      return res.status(401).json({
        message: "Invalid Password",
      });

    if (
      role &&
      user.role.toLowerCase() !==
        role.toLowerCase()
    ) {
      return res.status(401).json({
        message: "Role mismatch",
      });
    }

    const token = generateToken(user);

    const response = user.toObject();

    delete response.password;
    delete response.faceData;

    res.json({
      message: "Login Successful",
      token,
      user: response,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ============================
// PROFILE
// GET /api/auth/profile
// ============================
exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

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

// ============================
// UPDATE PROFILE
// PUT /api/auth/profile
// ============================
exports.updateProfile = async (
  req,
  res
) => {
  try {
    const updateData = {
      ...req.body,
    };

    delete updateData.password;

    const user =
      await User.findByIdAndUpdate(
        req.user.id,
        updateData,
        {
          new: true,
        }
      ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ============================
// FORGOT PASSWORD
// ============================
exports.forgotPassword =
  async (req, res) => {
    try {
      const { email } = req.body;

      const user =
        await User.findOne({
          email,
        });

      if (!user)
        return res
          .status(404)
          .json({
            message:
              "User not found",
          });

      const otp = Math.floor(
        100000 +
          Math.random() *
            900000
      ).toString();

      user.resetOtp = otp;
      user.resetOtpExpiry =
        new Date(
          Date.now() +
            10 * 60 * 1000
        );

      await user.save();

      await emailService.sendResetOtp(
        user,
        otp
      );

      res.json({
        message:
          "OTP sent successfully",
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };

// ============================
// VERIFY OTP
// ============================
exports.verifyOtp = async (
  req,
  res
) => {
  try {
    const { email, otp } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user)
      return res
        .status(404)
        .json({
          message:
            "User not found",
        });

    if (
      user.resetOtp !== otp
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid OTP",
        });
    }

    if (
      user.resetOtpExpiry <
      new Date()
    ) {
      return res
        .status(400)
        .json({
          message:
            "OTP Expired",
        });
    }

    res.json({
      message:
        "OTP Verified",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ============================
// RESET PASSWORD
// ============================
exports.resetPassword =
  async (req, res) => {
    try {
      const {
        email,
        otp,
        newPassword,
      } = req.body;

      const user =
        await User.findOne({
          email,
        });

      if (!user)
        return res
          .status(404)
          .json({
            message:
              "User not found",
          });

      if (
        user.resetOtp !== otp
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid OTP",
          });
      }

      if (
        user.resetOtpExpiry <
        new Date()
      ) {
        return res
          .status(400)
          .json({
            message:
              "OTP Expired",
          });
      }

      user.password =
        await bcrypt.hash(
          newPassword,
          10
        );

      user.resetOtp = null;
      user.resetOtpExpiry =
        null;
      user.isPasswordChanged = true;

      await user.save();

      res.json({
        message:
          "Password Reset Successfully",
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };