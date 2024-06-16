import Service from "./Service";

export default class EmployeeService extends Service {
    static async create(entity) {
        return super.create(entity, 'users')
    }

    static async read(id = '') {
        return super.read(id, 'users')
    }

    static async update(id, entity) {
        return super.update(id, entity, 'users')
    }

    static async delete(idArr) {
        return super.delete(idArr, 'users')
    }

    //Add Extra methods...

}