import { child, get, ref, remove, set, update } from "firebase/database";
import { db } from "../firebase";
import { uid } from "uid";

export default class Service {
  //Create one only
  static async create(entity, modelName) {
    try {
      const id = uid();
      console.log(entity)
      const data = await set(ref(db, `${modelName}/${id}`), {
        ...entity,
        id,
        timeStamp: Date.now(),
      });
      return data;
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  //Update one and all
  static async read(id = "", modelName) {
    try {
      const snapshot = await get(child(ref(db), `${modelName}/${id}`));
      if (snapshot.exists()) return snapshot.val();
      return null;
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  //Update one only
  static async update(id, entity, modelName) {
    try {
      const data = await update(ref(db, `${modelName}/${id}`), entity);
      return data;
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  //Delete one or more than one
  static async delete(idArr, modelName) {
    try {
      const returnArr = [];
      idArr.forEach(async (id) => {
        const data = await remove(ref(db, `${modelName}/${id}`));
        returnArr.push(data);
      });
      return returnArr;
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
}
