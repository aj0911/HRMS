import Service from "./Service";

export default class DepartmentService extends Service {
  static async create(entity) {
    return super.create(entity, "departments");
  }

  static async read(id = "") {
    return super.read(id, "departments");
  }

  static async update(id, entity) {
    return super.update(id, entity, "departments");
  }

  static async delete(idArr) {
    return super.delete(idArr, "departments");
  }

  //Add Extra methods...
  static async getDepartmentID(departmentName) {
    const all_departments = Object.values(await super.read("", "departments"));
    for(let department of all_departments){
      if (department.name === departmentName) return department.id;
    }
    return null;
  }
  static async getDepartmentName(departmentId) {
    const all_departments = Object.values(await super.read("", "departments"));
    for(let department of all_departments){
      if (department.id === departmentId) return department.name;
    }
    return null;
  }

}
