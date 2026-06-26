const User = require("../models/User");
const Attendance = require("../models/Attendance");

const getDashboardMetrics = async (req, res) => {
try {
const today = new Date();

```
const startOfDay = new Date(today);
startOfDay.setUTCHours(0, 0, 0, 0);

const endOfDay = new Date(today);
endOfDay.setUTCHours(24, 0, 0, 0);

// Get all non-admin users
const allUsers = await User.find({
  role: { $ne: "Admin" }
});

const totalUsers = allUsers.length;

// Today's attendance
const todaysAttendance = await Attendance.find({
  date: {
    $gte: startOfDay,
    $lt: endOfDay
  }
});

const presentToday = todaysAttendance.filter(
  a => a.status === "Present" || a.status === "Late"
).length;

const lateToday = todaysAttendance.filter(
  a => a.status === "Late"
).length;

let absentToday = Math.max(
  0,
  totalUsers - presentToday
);

if (todaysAttendance.length === 0) {
  absentToday = 0;
}

const attendanceRate =
  totalUsers > 0
    ? (presentToday / totalUsers) * 100
    : 0;

// Last 7 days trend
const sevenDaysAgo = new Date(startOfDay);
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const trendAttendance = await Attendance.find({
  date: {
    $gte: sevenDaysAgo,
    $lte: endOfDay
  }
});

const trend = [];

for (let i = 6; i >= 0; i--) {
  const day = new Date(startOfDay);
  day.setDate(day.getDate() - i);

  const nextDay = new Date(day);
  nextDay.setDate(nextDay.getDate() + 1);

  const dayRecords = trendAttendance.filter(
    record =>
      record.date >= day &&
      record.date < nextDay
  );

  trend.push({
    day: day.toLocaleDateString("en-US", {
      weekday: "short"
    }),
    presentCount: dayRecords.filter(
      record =>
        record.status === "Present" ||
        record.status === "Late"
    ).length
  });
}

const statusDistribution = {
  Present: todaysAttendance.filter(
    a => a.status === "Present"
  ).length,

  Absent: absentToday,

  Late: lateToday
};

res.status(200).json({
  totalUsers,
  presentToday,
  absentToday,
  lateToday,
  attendanceRate: Math.min(
    attendanceRate,
    100
  ),
  trend,
  statusDistribution
});
```

} catch (error) {
console.error(error);

```
res.status(500).json({
  message: "Failed to fetch dashboard metrics",
  error: error.message
});
```

}
};

module.exports = {
getDashboardMetrics
};
