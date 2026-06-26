const Attendance = require("../models/Attendance");

// GET /api/reports/summary
const getSummaryReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};

    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }

      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    const records = await Attendance.find(filter);

    const totalRecords = records.length;

    const totalPresent = records.filter(
      record => record.status === "Present"
    ).length;

    const totalLate = records.filter(
      record => record.status === "Late"
    ).length;

    const totalAbsent = records.filter(
      record => record.status === "Absent"
    ).length;

    const averageAttendanceRate =
      totalRecords > 0
        ? ((totalPresent + totalLate) /
            totalRecords) *
          100
        : 0;

    res.status(200).json({
      totalRecords,
      present: totalPresent,
      late: totalLate,
      absent: totalAbsent,
      averageAttendanceRate
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate report",
      error: error.message
    });
  }
};

module.exports = {
  getSummaryReport
};