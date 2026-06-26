const BaseRepository = require("./BaseRepository");
const AccessRequest = require("../models/AccessRequest");

class AccessRequestRepository extends BaseRepository {

    constructor() {
        super(AccessRequest);
    }

    async findPending() {
        return await this.findMany({
            status: "Pending"
        });
    }
}

module.exports = new AccessRequestRepository();