import emailjs from "@emailjs/browser";
import bcrypt from "bcryptjs";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase";

export const Constants = {
  LOGIN: "LOGIN",
  FORGOT: "FORGOT",
  OTP: "OTP",
  UPDATE_PASSWORD: "UPDATE_PASSWORD",
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //example@example.com
  return regex.test(email);
};

export const Roles = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  USER: "USER",
};

export const sendEmail = async (email, message) => {
  let obj = {};
  try {
    const resp = await emailjs.send(
      process.env.REACT_APP_SERVICE_ID,
      process.env.REACT_APP_TEMPLATE_ID,
      { email, message },
      process.env.REACT_APP_PUBLIC_KEY
    );
    obj = { success: true, data: resp };
  } catch (error) {
    obj = { success: false, data: error };
  }
  console.log(obj);
  return obj;
};

export const generateOTP = (length) => {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

export const encryptData = (word) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(word, salt);
};

export const compareEncryptedData = (userData, HashData) => {
  return bcrypt.compareSync(userData, HashData);
};

export const MODES = {
  LIGHT: "LIGHT",
  DARK: "DARK",
};

export const COLORS = {
  LIGHT: {
    "--bgColor-1": "#fff",
    "--textColor-1": "#16151C",
    "--textColor-2": "#A2A1A8",
    "--pannelColor": "#FAFAFB",
    "--pannelHoverColor": "#F3F2FB",
    "--borderColor-1": "#ECECEE",
  },
  DARK: {
    "--bgColor-1": "#16151C",
    "--textColor-1": "#FFFFFF",
    "--textColor-2": "#9F9EA5",
    "--pannelColor": "#1D1C23",
    "--pannelHoverColor": "#211F2D",
    "--borderColor-1": "#323138",
  },
};

export const greeting = () => {
  const greets = ["Good Morning", "Good Afternoon", "Good Evening"];
  var day = new Date();
  var hr = day.getHours();
  if (hr >= 0 && hr <= 12) return greets[0];
  if (hr > 12 && hr <= 16) return greets[1];
  return greets[2];
};

export const sendDesktopNotification = () => {};

export const EMPLOYEE_TYPES = {
  FULL_TIME_EMPLOYEES: "Full-Time",
  PART_TIME_EMPLOYEES: "Part-Time",
  CONTRACT_EMPLOYEES: "Contract",
  TEMPORARY_EMPLOYEES: "Temporary",
  INTERNS: "Interns",
  FREELANCERS_CONSULTANTS: "Freelance",
  REMOTE_EMPLOYEES: "Remote",
  SEASONAL_EMPLOYEES: "Seasonal",
  GIG_WORKERS: "Gig",
  VOLUNTEERS: "Volunteers",
};

export const OFFICE_LOCATIONS = {
  BANGALORE: "Bangalore",
  HYDERABAD: "Hyderabad",
  NEW_DELHI: "New Delhi",
  GURUGRAM: "Gurugram",
  PUNE: "Pune",
};

export const validateForm = (...formInputs) => {
  let isValid = true;
  formInputs.forEach((x) => {
    let flag = true;
    if (x == -1 || x === "" || x === null || x === undefined) flag = false;
    isValid &&= flag;
  });
  return isValid;
};

export const uploadFile = async (file) => {
  if (typeof file == "string") return file;
  if (file) {
    try {
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      const uploadTaskSnapshot = await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            resolve(uploadTask.snapshot);
          }
        );
      });

      const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
      console.log("file uploaded");
      return downloadURL;
    } catch (error) {
      console.log(error.message);
    }
  }
  return null;
};

export const deleteFile = async (file_url) => {
  console.log(file_url);
  if (file_url) {
    try {
      const baseUrl =
        "https://firebasestorage.googleapis.com/v0/b/hrms-f43a4.appspot.com/o/";
      const startIndex = baseUrl.length;
      const endIndex = file_url.indexOf("?"); // URL query parameters start with '?'
      const path = file_url
        .substring(startIndex, endIndex)
        .replace(/%2F/g, "/"); // Decode URL-encoded slashes
      const deleteRef = ref(storage, path);
      await deleteObject(deleteRef);
      console.log("file deleted");
    } catch (error) {
      console.log(error.message);
    }
  }
};

export const userAlreadyExistInData = (data, userID) => {
  for (let user of data) {
    if (user.id === userID) return true;
  }
  return false;
};

export const checkIsSingleDataExist = (arr, parameter) => {
  for (let x of arr) {
    if (x[parameter]) return true;
  }
  return false;
};
