import { ATTENDANCE_OPTIONS } from "../Helper/Helper";
import EmployeeService from "./EmployeeService";
import Service from "./Service";

export default class AttendanceService extends Service {
  static async create(entity) {
    return super.create(entity, "attendance");
  }

  static async read(id = "") {
    return super.read(id, "attendance");
  }

  static async update(id, entity) {
    return super.update(id, entity, "attendance");
  }

  static async delete(idArr) {
    return super.delete(idArr, "attendance");
  }

  //Add Extra methods...

  static async attendanceExist(userId, date) {
    const all_attendances = Object.values(
      (await super.read("", "attendance")) || []
    );
    for (let x of all_attendances) {
      if (x.user === userId && x.date === date) return x;
    }
    return null;
  }

  static async giveHoliday(date){
    const all_users = await EmployeeService.getAllIDs();
    for(let user of all_users){
        const attendance = await this.attendanceExist(user,date);
        if(attendance){//Update
            await this.update(attendance.id,{
                user,
                status:ATTENDANCE_OPTIONS.PRESENT,
                date,
                isHoliday:true
            })
        }
        else{//Create New
            await this.create({
                user,
                status:ATTENDANCE_OPTIONS.PRESENT,
                date,
                isHoliday:true
            })
        }
    }
  }
  static async cancelHoliday(date){
    const all_users = await EmployeeService.getAllIDs();
    for(let user of all_users){
        const attendance = await this.attendanceExist(user,date);
        if(attendance){
            await this.delete([attendance.id]);
        }
    }
  }
}
