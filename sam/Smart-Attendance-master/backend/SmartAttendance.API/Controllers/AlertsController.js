const Alert = require("../models/Alert");

// GET /api/alerts
const getAlerts = async (req, res) => {
try {
const alerts = await Alert.find()
.sort({ createdAt: -1 });

```
res.status(200).json(alerts);
```

} catch (error) {
res.status(500).json({
message: "Failed to fetch alerts",
error: error.message
});
}
};

// PUT /api/alerts/:id/acknowledge
const acknowledgeAlert = async (req, res) => {
try {
const { id } = req.params;

```
const alert = await Alert.findByIdAndUpdate(
  id,
  {
    status: "Acknowledged"
  },
  {
    new: true
  }
);

if (!alert) {
  return res.status(404).json({
    message: "Alert not found or already acknowledged"
  });
}

res.status(200).json({
  message: "Alert acknowledged successfully"
});
```

} catch (error) {
res.status(500).json({
message: "Server Error",
error: error.message
});
}
};

module.exports = {
getAlerts,
acknowledgeAlert
};
