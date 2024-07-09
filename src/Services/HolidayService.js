import Service from "./Service"

export default class HolidayService extends Service{
    static async create(entity) {
        return super.create(entity, "holidays");
      }
    
      static async read(id = "") {
        return super.read(id, "holidays");
      }
    
      static async update(id, entity) {
        return super.update(id, entity, "holidays");
      }
    
      static async delete(idArr) {
        return super.delete(idArr, "holidays");
      }
    
      //Add Extra methods...

      static async getAllIDs(){
        return Object.keys(await super.read('','holidays'));
      }
}