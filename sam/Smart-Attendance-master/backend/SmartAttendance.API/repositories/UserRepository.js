const BaseRepository = require("./BaseRepository");
const User = require("../models/User");

class UserRepository extends BaseRepository {

    constructor() {
        super(User);
    }

    async findByEmail(email) {
        return await this.findFirst({ email });
    }

    async findByEmailWithoutFaceData(email) {
        return await this.findProjected(
            { email },
            "-faceData"
        );
    }

    async findByRole(role) {
        return await this.findFirst({ role });
    }

    async findByDepartment(department) {
        return await this.findMany({ department });
    }
}

module.exports = new UserRepository();