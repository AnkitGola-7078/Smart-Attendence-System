const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Present", "Late", "Absent"],
      default: "Present",
    },

    method: {
      type: String,
      enum: ["AI", "Manual", "Auto"],
      default: "Manual",
    },

    role: {
      type: String,
      enum: ["Student", "Staff", "Admin"],
      default: "Student",
    },

    confidence: {
      type: Number,
      default: null,
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Optional: Prevent duplicate attendance for the same user on the same date
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);