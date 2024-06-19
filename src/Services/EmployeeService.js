import { Roles, encryptData, uploadFile } from "../Helper/Helper";
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
    return super.update(id, entity, "users");
  }

  static async delete(idArr) {
    return super.delete(idArr, "users");
  }
  //Add Extra methods...
  static async getNewEmpID() {
    const all_users = await super.read("", "users");
    let length = 1;
    Object.values(all_users).forEach((x) => {
      if (x.role === Roles.USER) length += 1;
    });
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
    const arr = [];

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
}
