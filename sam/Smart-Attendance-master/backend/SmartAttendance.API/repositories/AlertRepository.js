const BaseRepository = require("./BaseRepository");
const Alert = require("../models/Alert");

class AlertRepository extends BaseRepository {

    constructor() {
        super(Alert);
    }

    async findByUserId(userId) {
        return await this.findMany({ userId });
    }

    async findUnread(userId) {
        return await this.findMany({
            userId,
            status: "Unacknowledged"
        });
    }
}

module.exports = new AlertRepository();