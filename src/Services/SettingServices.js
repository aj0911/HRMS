import { ref, remove, set, update } from "firebase/database";
import { uid } from "uid";
import { db } from "../firebase";

export default class SettingServices{
    static initializeSettings(setting){
        try{
            const id = uid();
            set(ref(db,'setting/'+id),{...setting,id})
            return {
                success:true,
                message:'Settings Initialized Successfully!!',
                data:setting
            }
        }
        catch(ex){
            return {
                success:false,
                message:ex.message,
                data:null
            }
        }
    }

    static updateSettings(settingId,setting){
        try{
            update(ref(db,'setting/'+settingId),{...setting,id:settingId})
            return {
                success:true,
                message:'Settings Updated Successfully!!',
                data:setting
            }
        }
        catch(ex){
            return {
                success:false,
                message:ex.message,
                data:null
            }
        }
    }

    static removeSettings(settingId){
        try{
            remove(ref(db,'setting/'+settingId))
            return {
                success:true,
                message:'Settings Deleted Successfully!!',
            }
        }
        catch(ex){
            return {
                success:false,
                message:ex.message,
            }
        }
    }
}