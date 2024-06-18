import { Roles } from "../Helper/Helper";
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
    static async getNewEmpID(){
        const all_users = await super.read('', 'users');
        let length = 1;
        Object.values(all_users).forEach(x=>{
            if(x.role===Roles.USER)length+=1
        })
        if(length>=0 && length<=9)return `00${length}`
        if(length>=10 && length<=99)return `0${length}`
        return length;
    }

}