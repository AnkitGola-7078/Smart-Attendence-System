const Attendance = require("../models/Attendance");
const User = require("../models/User");

// GET /api/attendance
const getAttendanceRecords = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const loggedInRole = req.user.role;

    let filter = {};

    if (loggedInRole !== "Admin") {
      filter.userId = loggedInUserId;
    }

    const { status, dateRange } = req.query;

    if (status && status !== "All Status") {
      filter.status = status;
    }

    if (dateRange && dateRange !== "All Time") {
      const days = dateRange === "7 Days" ? 7 : 30;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      filter.date = {
        $gte: startDate
      };
    }

    const records = await Attendance.find(filter)
      .sort({
        date: -1,
        time: -1
      });

    const userIds = [
      ...new Set(records.map(r => r.userId))
    ];

    const users = await User.find({
      _id: { $in: userIds }
    });

    const userMap = {};

    users.forEach(user => {
      userMap[user._id] = user.name;
    });

    const enrichedRecords = records.map(record => ({
      _id: record._id,
      userId: record.userId,
      userName:
        userMap[record.userId] || "Unknown",
      date: record.date,
      time: record.time,
      status: record.status,
      method: record.method,
      confidence: record.confidence,
      latitude: record.latitude,
      longitude: record.longitude
    }));

    res.status(200).json(enrichedRecords);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/attendance/my-summary
const getMyAttendanceSummary = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const records = await Attendance.find({
      userId
    });

    const present = records.filter(
      r => r.status === "Present"
    ).length;

    const late = records.filter(
      r => r.status === "Late"
    ).length;

    const absent = records.filter(
      r => r.status === "Absent"
    ).length;

    res.status(200).json({
      present,
      late,
      absent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAttendanceRecords,
  getMyAttendanceSummary
};