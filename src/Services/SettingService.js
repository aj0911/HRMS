import Service from "./Service";

export default class SettingService extends Service {
    static async create(entity) {
        return super.create(entity, 'settings')
    }

    static async read(id = '') {
        return super.read(id, 'settings')
    }

    static async update(id, entity) {
        return super.update(id, entity, 'settings')
    }

    static async delete(idArr) {
        return super.delete(idArr, 'settings')
    }

    //Add Extra methods...

    static async getSettingID(userId) {
        const data = await super.read('', 'settings');
        let id = null;
        Object.values(data).forEach(x => {
            if (x.user === userId) {
                id = x.id
            }
        })
        return id;
    }
}