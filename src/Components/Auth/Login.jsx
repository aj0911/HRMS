import React, { useRef, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import {
  Constants,
  compareEncryptedData,
  validateEmail,
} from "../../Helper/Helper";
import { db } from "../../firebase";
import Alert from "../Alert/Alert";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../Loader/Loader";
import { onValue, ref } from "firebase/database";
import { useDispatch } from "react-redux";
import { login } from "../../Reducers/Auth";

const Login = ({ setComponent }) => {
  // State and Refs
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({ email: "", pass: "" });
  const [alertData, setAlertData] = useState({ show: false });
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const checkbox = useRef();
  const dispatch = useDispatch();

  // functions
  const handleFocus = (e) => {
    e.target.parentNode.children[1].focus();
  };
  const handleLogin = (e) => {
    e.preventDefault();
    setLoader((prev) => !prev);
    if (userData.email === "" || userData.pass === "") {
      toast.error("Both the Fields are Mandatory.");
      setLoader((prev) => !prev);
    } else if (!validateEmail(userData.email)) {
      toast.error("Email must be in correct format like example@example.com");
      setLoader((prev) => !prev);
    } else if (userData.pass.length < 8) {
      toast.error("Password must be greater than or equals to 8 digits");
      setLoader((prev) => !prev);
    } else {
      try {
        onValue(ref(db, `users/`), (snapshot) => {
          const data = snapshot.val();
          let flag = false;
          Object.values(data).forEach((user) => {
            if (
              user.email.toLocaleLowerCase() ===
              userData.email.toLocaleLowerCase()
            ) {
              flag = true;
              if (compareEncryptedData(userData.pass, user.pass)) {
                dispatch(login({ user, remember: checkbox.current.checked }));
                setAlertData({
                  show: true,
                  type: 0,
                  heading: "Login Successfully",
                  subHeading: "You have logged in to your account successfully",
                  onSubmit: () => {
                    setAlertData({ show: false });
                    navigate("/");
                  },
                  btnText: "Go to Dashboard",
                });
              } else {
                setAlertData({
                  show: true,
                  type: 1,
                  heading: "Login Failed",
                  subHeading: "Incorrect Password",
                  onSubmit: () => {
                    setAlertData({ show: false });
                  },
                  btnText: "Try Again",
                });
              }
            }
          });
          if (!flag) {
            setAlertData({
              show: true,
              type: 1,
              heading: "Login Failed",
              subHeading: "Email is not Registerd yet!",
              onSubmit: () => {
                setAlertData({ show: false });
              },
              btnText: "Try Again",
            });
          }
          setLoader((prev) => !prev);
        });
      } catch (error) {
        setAlertData({
          show: true,
          type: 1,
          heading: "Login Failed",
          subHeading: error.message,
          onSubmit: () => {
            setAlertData({ show: false });
          },
          btnText: "Try Again",
        });
        setLoader((prev) => !prev);
      }
    }
  };

  return (
    <>
      <div className="login">
        <div className="logo">
          <img src={require("../../Assets/Images/logo.png")} alt="" />
          <h1>HRMS</h1>
        </div>
        <div className="head">
          <h3>Welcome 👋 </h3>
          <h5>Please login here</h5>
        </div>
        <form onSubmit={(e) => handleLogin(e)}>
          <div className="inputControl">
            <label onClick={(e) => handleFocus(e)} htmlFor="email">
              Email Address
            </label>
            <input
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              type="email"
              name="email"
            />
          </div>
          <div className="passControl">
            <div className="box">
              <label onClick={(e) => handleFocus(e)} htmlFor="pass">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="pass"
                onChange={(e) =>
                  setUserData({ ...userData, pass: e.target.value })
                }
              />
            </div>
            {showPassword ? (
              <AiFillEye
                className="icon"
                onClick={() => setShowPassword((prev) => !prev)}
              />
            ) : (
              <AiFillEyeInvisible
                className="icon"
                onClick={() => setShowPassword((prev) => !prev)}
              />
            )}
          </div>
          <div className="control">
            <div className="remember">
              <input ref={checkbox} type="checkbox" name="remember" />
              <label
                onClick={() => {
                  checkbox.current.checked = !checkbox.current.checked;
                }}
                htmlFor="remember"
              >
                Remember Me
              </label>
            </div>
            <span onClick={() => setComponent(Constants.FORGOT)}>
              Forgot Password?
            </span>
          </div>
          {loader ? (
            <Loader fullWidth={true} size={50} />
          ) : (
            <input type="submit" value="Login" />
          )}
        </form>
      </div>
      {alertData.show && <Alert data={alertData} />}
    </>
  );
};

export default Login;
