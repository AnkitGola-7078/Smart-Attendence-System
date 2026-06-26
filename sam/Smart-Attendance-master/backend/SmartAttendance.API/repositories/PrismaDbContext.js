const UserRepository = require("./UserRepository");
const AttendanceRepository = require("./AttendanceRepository");
const AlertRepository = require("./AlertRepository");
const AccessRequestRepository = require("./AccessRequestRepository");

module.exports = {
    Users: UserRepository,
    Attendances: AttendanceRepository,
    Alerts: AlertRepository,
    AccessRequests: AccessRequestRepository
};