const express = require("express");

const router = express.Router();

const attendanceController = require("../controllers/AttendanceController");

const auth = require("../middleware/auth");

router.post("/mark", auth, attendanceController.markAttendance);

router.get("/history", auth, attendanceController.history);

router.get("/today", auth, attendanceController.todayAttendance);

module.exports = router;