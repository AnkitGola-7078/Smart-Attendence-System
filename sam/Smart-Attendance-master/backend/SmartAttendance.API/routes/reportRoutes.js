const express = require("express");

const router = express.Router();

const reportController = require("../controllers/ReportsController");

const auth = require("../middleware/auth");

const admin = require("../middleware/admin");

router.get("/daily", auth, admin, reportController.dailyReport);

router.get("/monthly", auth, admin, reportController.monthlyReport);

router.get("/student/:id", auth, admin, reportController.studentReport);

module.exports = router;