import emailjs from '@emailjs/browser'
import bcrypt from 'bcryptjs';

export const Constants = {
    LOGIN:'LOGIN',
    FORGOT:'FORGOT',
    OTP:'OTP',
    UPDATE_PASSWORD:'UPDATE_PASSWORD'
}

export const validateEmail = (email)=>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    //example@example.com
    return regex.test(email)
}

export const Roles = {
    SUPER_ADMIN:'SUPER_ADMIN',
    ADMIN:'ADMIN',
    USER:'USER'
}

export const sendEmail = async(email,message)=>{
    let obj = {}
    try{
        const resp = await emailjs.send(process.env.REACT_APP_SERVICE_ID,process.env.REACT_APP_TEMPLATE_ID, {email,message},process.env.REACT_APP_PUBLIC_KEY);
        obj = {success:true,data:resp}
    }
    catch(error){
        obj = {success:false,data:error}
    }
    console.log(obj)
    return obj;
}

export const generateOTP = (length)=>{
    let otp = '';
    for(let i=0;i<length;i++){
        otp += Math.floor(Math.random()*10)
    }
    return otp
}

export const encryptData = (word)=>{
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(word,salt)
}

export const compareEncryptedData = (userData,HashData)=>{
    return bcrypt.compareSync(userData,HashData)
}
