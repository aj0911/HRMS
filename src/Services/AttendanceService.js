import {
  ATTENDANCE_OPTIONS,
  convertToDoubleDigit,
  getDaysInMonth,
  isPaidLeave,
  normalizeNum,
} from "../Helper/Helper";
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

  static async giveHoliday(date) {
    const all_users = await EmployeeService.getAllIDs();
    for (let user of all_users) {
      const attendance = await this.attendanceExist(user, date);
      if (attendance) {
        //Update
        await this.update(attendance.id, {
          user,
          status: ATTENDANCE_OPTIONS.PRESENT,
          date,
          isHoliday: true,
        });
      } else {
        //Create New
        await this.create({
          user,
          status: ATTENDANCE_OPTIONS.PRESENT,
          date,
          isHoliday: true,
        });
      }
    }
  }
  static async cancelHoliday(date) {
    const all_users = await EmployeeService.getAllIDs();
    for (let user of all_users) {
      const attendance = await this.attendanceExist(user, date);
      if (attendance) {
        await this.delete([attendance.id]);
      }
    }
  }
  static async giveLeave(userId, fromDate, toDate, leaveName) {
    const dateRange = this.getDateRange(fromDate, toDate);
    for (let date of dateRange) {
      const attendance = await this.attendanceExist(userId, date);
      if (attendance) {
        // Update
        await this.update(attendance.id, {
          user: userId,
          status: isPaidLeave(leaveName)
            ? ATTENDANCE_OPTIONS.PRESENT
            : ATTENDANCE_OPTIONS.ABSENT,
          date,
          isLeave: true,
        });
      } else {
        // Create New
        await this.create({
          user: userId,
          status: ATTENDANCE_OPTIONS.PRESENT,
          date,
          isLeave: true,
        });
      }
    }
  }
  static async cancelLeave(userId, fromDate, toDate) {
    const dateRange = this.getDateRange(fromDate, toDate);
    for (let date of dateRange) {
      const attendance = await this.attendanceExist(userId, date);
      if (attendance) {
        await this.delete([attendance.id]);
      }
    }
  }
  static getDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateArray = [];
    let currentDate = start;

    while (currentDate <= end) {
      const dt = new Date(currentDate);
      dateArray.push(
        `${dt.getFullYear()}-${convertToDoubleDigit(
          dt.getMonth() + 1
        )}-${convertToDoubleDigit(dt.getUTCDate())}`
      );
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  }

  static async giveParameters(monthIndex, year, userID,ctc) {
    const all_attendances = Object.values((await this.read()) || []);
    let total_present_days = 0;
    let total_absent_days = 0;
    for (let x of all_attendances) {
      const dt = new Date(x.date);
      if (dt.getMonth() == monthIndex && dt.getFullYear() == year && x.user === userID) {
        //month attendance only;
        if (x.status === ATTENDANCE_OPTIONS.PRESENT)
          total_present_days++;
        else total_absent_days++;
      }
    }
    //Calculations
    const gross_salary = (ctc*100000)/12;
    const gross_salary_per_day = gross_salary/getDaysInMonth(monthIndex,year);
    const hra = 0.2*gross_salary;
    const da = 0.1*gross_salary;
    const basic_salary = gross_salary - hra - da;
    const pf = 0.12*basic_salary;
    const esi = 0.0175*gross_salary;
    const deductions = hra + da + pf + esi + (total_absent_days)*gross_salary_per_day;
    const net_salary = gross_salary - deductions;

    return {
      total_present_days,
      total_absent_days,
      total_attendance_marked: total_present_days + total_absent_days,
      gross_salary:normalizeNum(gross_salary),
      gross_salary_per_day:normalizeNum(gross_salary_per_day),
      hra:normalizeNum(hra),
      da:normalizeNum(da),
      basic_salary:normalizeNum(basic_salary),
      pf:normalizeNum(pf),
      esi:normalizeNum(esi),
      deductions:normalizeNum(deductions),
      net_salary:normalizeNum(net_salary)
    }
  }
}
