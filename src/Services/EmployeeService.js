import {
  EMPLOYEE_TYPES,
  Roles,
  deleteFile,
  encryptData,
  uploadFile,
  userAlreadyExistInData,
} from "../Helper/Helper";
import DepartmentService from "./DepartmentService";
import Service from "./Service";

export default class EmployeeService extends Service {
  static async create(entity) {
    const pass = encryptData(`${entity.user_name}@1234`);
    entity.profile = await uploadFile(entity.profile);
    entity.appointment_letter = await uploadFile(entity.appointment_letter);
    entity.salary_slips = await uploadFile(entity.salary_slips);
    entity.reliving_letter = await uploadFile(entity.reliving_letter);
    entity.experience_letter = await uploadFile(entity.experience_letter);
    return await super.create(
      {
        ...entity,
        pass,
        role: Roles.USER,
        name: `${entity.first_name} ${entity.last_name}`,
      },
      "users",
      true
    );
  }

  static async read(id = "") {
    return super.read(id, "users");
  }

  static async update(id, entity) {
    //Deleting Older Files
    if (entity.original_profile != entity.profile)
      await deleteFile(entity.original_profile);
    if (entity.original_appointment_letter != entity.appointment_letter)
      await deleteFile(entity.original_appointment_letter);
    if (entity.original_salary_slips != entity.salary_slips)
      await deleteFile(entity.original_salary_slips);
    if (entity.original_reliving_letter != entity.reliving_letter)
      await deleteFile(entity.original_reliving_letter);
    if (entity.original_experience_letter != entity.experience_letter)
      await deleteFile(entity.original_experience_letter);

    //Uploading Updated files
    entity.profile = await uploadFile(entity.profile);
    entity.appointment_letter = await uploadFile(entity.appointment_letter);
    entity.salary_slips = await uploadFile(entity.salary_slips);
    entity.reliving_letter = await uploadFile(entity.reliving_letter);
    entity.experience_letter = await uploadFile(entity.experience_letter);
    return super.update(
      id,
      {
        ...entity,
        name: `${entity.first_name} ${entity.last_name}`,
        original_profile: null,
        original_appointment_letter: null,
        original_experience_letter: null,
        original_reliving_letter: null,
        original_salary_slips: null,
      },
      "users"
    );
  }

  static async delete(idArr) {
    for (const id of idArr) {
      //Deleting all the files first
      const emp = await super.read(id, "users");
      await deleteFile(emp.profile);
      await deleteFile(emp.appointment_letter);
      await deleteFile(emp.salary_slips);
      await deleteFile(emp.reliving_letter);
      await deleteFile(emp.experience_letter);

      //Now Delete Settings
      const settings = Object.values(await super.read("", "settings"));
      for (const setting of settings) {
        if (setting.user === id) {
          await super.delete([setting.id], "settings");
        }
      }
    }

    // Now Deleting the users
    return await super.delete(idArr, "users");
  }
  //Add Extra methods...
  static async getNewEmpID() {
    const all_users = (await this.getAllEmployees()).sort((a, b) =>
      a.empId.localeCompare(b.empId)
    );
    const length = Number(all_users[all_users.length-1].empId.split("-")[1])+1;
    if (length >= 0 && length <= 9) return `00${length}`;
    if (length >= 10 && length <= 99) return `0${length}`;
    return length;
  }

  static async checkUserNameExist(userName) {
    const all_users = await super.read("", "users");
    let userExists = false;

    Object.values(all_users).forEach((x) => {
      if (x.user_name === userName) {
        userExists = true;
        return; // This return will exit the forEach loop iteration but not the outer function
      }
    });

    return userExists;
  }
  static async checkEmailExist(email) {
    const all_users = await super.read("", "users");
    let userExists = false;

    Object.values(all_users).forEach((x) => {
      if (x.email === email) {
        userExists = true;
        return;
      }
    });

    return userExists;
  }
  static async getAllEmployees() {
    const all_users = await super.read("", "users");

    const users = Object.values(all_users).filter((x) => x.role === Roles.USER);
    const departmentPromises = users.map((x) =>
      DepartmentService.read(x.department).then((department) => ({
        ...x,
        department: department?.name,
      }))
    );

    const result = await Promise.all(departmentPromises);
    return result;
  }

  static async filterEmployees({ searchEmpText, empDepArr, empTypeArr }) {
    const all_users = await this.getAllEmployees();
    let returnData1 = [];
    let returnData2 = [];
    let returnData3 = [];
    let data = all_users;
    if (searchEmpText !== "") {
      for (let user of data) {
        if (user.name.toLowerCase().includes(searchEmpText.toLowerCase()))
          returnData1.push(user);
      }
      data = returnData1;
    }
    if (empDepArr && empDepArr.length > 0) {
      for (let user of data) {
        for (let depID of empDepArr) {
          if (
            depID === (await DepartmentService.getDepartmentID(user.department))
          )
            returnData2.push(user);
        }
      }
      data = returnData2;
    } else returnData2 = returnData1;
    if (empTypeArr && empTypeArr.length > 0) {
      for (let user of data) {
        for (let empType of empTypeArr) {
          if (empType === user.emp_type) returnData3.push(user);
        }
      }
    } else returnData3 = returnData2;
    return returnData3;
  }

  static async getAllIDs(){
    return (await this.getAllEmployees()).map(x=>x.id);
  }
}
