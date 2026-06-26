const BaseRepository = require("./BaseRepository");
const Attendance = require("../models/Attendance");

class AttendanceRepository extends BaseRepository {

    constructor() {
        super(Attendance);
    }

    async findByDate(date) {

        const start = new Date(date);
        start.setHours(0,0,0,0);

        const end = new Date(start);
        end.setDate(end.getDate()+1);

        return await this.findMany({
            date:{
                $gte:start,
                $lt:end
            }
        });
    }

    async findByUserId(userId){
        return await this.findMany({userId});
    }

    async findByUserAndDate(userId,date){

        const start=new Date(date);
        start.setHours(0,0,0,0);

        const end=new Date(start);
        end.setDate(end.getDate()+1);

        return await this.findFirst({
            userId,
            date:{
                $gte:start,
                $lt:end
            }
        });
    }
}

module.exports = new AttendanceRepository();