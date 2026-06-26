
const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    adminName: {
      type: String,
      required: true,
      trim: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    attendanceStatus: {
      type: String,
      enum: ["Present", "Late", "Absent"],
      required: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },

    source: {
      type: String,
      default: "Manual Override",
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);