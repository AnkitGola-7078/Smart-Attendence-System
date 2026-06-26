const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["Admin", "Employee", "Student"],
      default: "Student",
    },

    department: {
      type: String,
      default: null,
    },

    resetOtp: {
      type: String,
      default: null,
    },

    resetOtpExpiry: {
      type: Date,
      default: null,
    },

    profileImage: {
      type: String,
      default: null,
    },

    // Stores multiple face embeddings
    faceData: {
      type: [[Number]],
      default: [],
    },

    emailDeliveryStatus: {
      type: String,
      enum: ["Pending", "Sent", "Failed"],
      default: "Pending",
    },

    emailSent: {
      type: Boolean,
      default: false,
    },

    emailSentAt: {
      type: Date,
      default: null,
    },

    lastEmailAttempt: {
      type: Date,
      default: null,
    },

    temporaryPassword: {
      type: String,
      default: null,
    },

    temporaryPasswordCreatedAt: {
      type: Date,
      default: null,
    },

    isPasswordChanged: {
      type: Boolean,
      default: false,
    },

    isDisabled: {
      type: Boolean,
      default: false,
    },

    failedOtpAttempts: {
      type: Number,
      default: 0,
    },

    otpLastRequestedAt: {
      type: Date,
      default: null,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);