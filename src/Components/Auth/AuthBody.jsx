import React, { useEffect, useState } from "react";
import Login from "./Login";
import "./AuthBody.css";
import { Constants, MODES } from "../../Helper/Helper";
import Forgot from "./Forgot";
import OTP from "./OTP";
import UpdatePassword from "./UpdatePassword";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AuthBody = () => {
  // States
  const [component, setComponent] = useState(Constants.LOGIN);
  const [otp, setOTP] = useState("");
  const [updateData, setUpdateData] = useState({});
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme);

  useEffect(() => {
    if (auth.isAuth) navigate("/");
  }, []);

  return (
    <div className="authBody">
      <div className="left">
        <img
          src={require(`../../Assets/Images/${
            theme.mode === MODES.LIGHT ? "DashboardLight" : "DashboardDark"
          }.png`)}
          alt="DashboardImg"
        />
      </div>
      <div className="right">
        {(() => {
          if (component === Constants.LOGIN)
            return <Login setComponent={setComponent} />;
          else if (component === Constants.FORGOT)
            return (
              <Forgot
                setComponent={setComponent}
                setOTP={setOTP}
                setUpdateData={setUpdateData}
              />
            );
          else if (component === Constants.OTP)
            return <OTP setComponent={setComponent} trueOTP={otp} />;
          else if (component === Constants.UPDATE_PASSWORD)
            return (
              <UpdatePassword
                updateData={updateData}
                setUpdateData={setUpdateData}
                setOTP={setOTP}
                setComponent={setComponent}
              />
            );
        })()}
      </div>
    </div>
  );
};

export default AuthBody;
