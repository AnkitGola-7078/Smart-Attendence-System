const cron = require("node-cron");
const User = require("../models/User");
const Attendance = require("../models/Attendance");

const startAutoAbsentService = () => {
  console.log("✅ AutoAbsentService Started...");

  // Runs every day at 11:59 PM IST
  cron.schedule(
    "59 23 * * *",
    async () => {
      try {
        console.log("🔄 Running Daily Absent Job...");

        // Today's date (IST)
        const now = new Date();

        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        // Get all users
        const users = await User.find