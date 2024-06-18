import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { MdOutlineWbSunny } from "react-icons/md";
import { GoMoon } from "react-icons/go";
import { BiSolidDashboard } from "react-icons/bi";
import { PiUserSwitchDuotone, PiUsersThree } from "react-icons/pi";
import { LuCalendarCheck, LuClipboardList, LuSettings } from "react-icons/lu";
import { AiOutlineBell, AiOutlineDollar } from "react-icons/ai";
import {
  FaBriefcase,
  FaChevronDown,
  FaRegCalendarAlt,
  FaRegUser,
  FaSearch,
} from "react-icons/fa";
import { TbUsers } from "react-icons/tb";
import { IoLogOutOutline } from "react-icons/io5";
import { logout } from "../../Reducers/Auth";
import { toggleDarkMode, togglelightMode } from "../../Reducers/Theme";
import { COLORS, MODES, greeting } from "../../Helper/Helper";
import DashboardBox from "./DashboardBox";
import Employees from "./Employees/Employees";
import Attendance from "./Attendance/Attendance";
import Candidates from "./Candidates/Candidates";
import Holidays from "./Holidays/Holidays";
import Jobs from "./Jobs/Jobs";
import Leaves from "./Leaves/Leaves";
import Payroll from "./Payroll/Payroll";
import Settings from "./Settings";
import Departments from "./Departments/Departments";

const Dashboard = () => {
  // States
  const auth = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme);
  const navigate = useNavigate();
  const [viewOptions, setViewOptions] = useState(false);
  const dispatch = useDispatch();
  const [component, setComponent] = useState(0);
  const [active,setActive] = useState(false);

  //handling Functions
  const handleLogout = () => {
    dispatch(logout());
    navigate("/Auth");
  };
  const handleTheme = (mode) => {
    //Dark Mode
    if (mode === MODES.DARK) {
      dispatch(toggleDarkMode());
      Object.keys(COLORS.DARK).forEach((x) =>
        document.documentElement.style.setProperty(x, COLORS.DARK[x])
      );
    }
    //Light Mode
    else {
      dispatch(togglelightMode());
      Object.keys(COLORS.LIGHT).forEach((x) =>
        document.documentElement.style.setProperty(x, COLORS.LIGHT[x])
      );
    }
  };

  //navigationsMenus
  const menus = [
    {
      name: "Dashboard",
      icon: <BiSolidDashboard />,
      component: <DashboardBox />,
      heading: [`Hello ${auth.user?.name} 👋🏻`, greeting()],
    },
    {
      name: "All Employees",
      icon: <PiUsersThree />,
      component: <Employees />,
      heading: [`All Employees`, `All Employee Information`],
    },
    {
      name: "All Departments",
      icon: <PiUserSwitchDuotone />,
      component: <Departments />,
      heading: [`All Departments`, `All Departments Information`],
    },
    {
      name: "Attendance",
      icon: <LuCalendarCheck />,
      component: <Attendance />,
      heading: [`Attendance`, `All Employee Attendance`],
    },
    {
      name: "Payroll",
      icon: <AiOutlineDollar />,
      component: <Payroll />,
      heading: [`Payroll`, `All Employee Payroll`],
    },
    {
      name: "Jobs",
      icon: <FaBriefcase />,
      component: <Jobs />,
      heading: [`Jobs`, `Show All Jobs`],
    },
    {
      name: "Candidates",
      icon: <TbUsers />,
      component: <Candidates />,
      heading: [`Candidates`, `Show All Candidates`],
    },
    {
      name: "Leaves",
      icon: <LuClipboardList />,
      component: <Leaves />,
      heading: [`Leaves`, `View All Leaves`],
    },
    {
      name: "Holidays",
      icon: <FaRegCalendarAlt />,
      component: <Holidays />,
      heading: [`Holidays`, `All Holidays List`],
    },
    {
      name: "Settings",
      icon: <LuSettings />,
      component: <Settings handleTheme={handleTheme} />,
      heading: [`Settings`, `All System Settings`],
    },
  ];

  // Rendering
  useEffect(() => {
    if (!auth.isAuth) navigate("/auth");
  }, []);

  return (
    <>
      <div className={`Dashboard`}>
        <div className={`left ${active?'active':''}`}>
          <div className="logo">
            <img src={require("../../Assets/Images/logo.png")} alt="" />
            <h1>HRMS</h1>
          </div>
          <nav>
            {menus.map((menu, key) => (
              <button
                className={key === component ? "active" : ""}
                onClick={() => {setComponent(key);setActive(false)}}
                key={key}
              >
                {menu.icon}
                <h3>{menu.name}</h3>
              </button>
            ))}
          </nav>
          <div className="btns">
            <button
              onClick={() => handleTheme(MODES.LIGHT)}
              className={theme.mode === MODES.LIGHT ? "active" : ""}
            >
              <MdOutlineWbSunny />
              <h3>Light</h3>
            </button>
            <button
              onClick={() => handleTheme(MODES.DARK)}
              className={theme.mode === MODES.DARK ? "active" : ""}
            >
              <GoMoon />
              <h3>Dark</h3>
            </button>
          </div>
        </div>
        <div className="right">
          <div className="header">
            <div className="left">
              <div className="menu" onClick={()=>setActive(prev=>!prev)}>
                <div className="bar"></div>
              </div>
              <div className="heading">
                <h3>{menus[component]?.heading[0]}</h3>
                <h5>{menus[component]?.heading[1]}</h5>
              </div>
            </div>
            <div className="right">
              <div className="search">
                <FaSearch />
                <input type="text" placeholder="Search" />
              </div>
              <div className="notification">
                <AiOutlineBell />
              </div>
              <div onClick={() => setViewOptions(true)} className="profile">
                <img src={require("../../Assets/Images/user.png")} alt="" />
                <div className="content">
                  <h3>{auth.user?.name}</h3>
                  <h5>{auth.user?.designation || "Admin"}</h5>
                </div>
                <FaChevronDown className="icon" />
              </div>
            </div>
          </div>

          {menus.map((x, i) => {
            if (i === component)
              return (
                <div key={i} className="box">
                  {x.component}
                </div>
              );
          })}
        </div>
      </div>
      {viewOptions ? (
        <>
          <div
            onClick={() => setViewOptions(false)}
            className="container"
          ></div>
          <div className="options">
            <div className="option">
              <FaRegUser />
              <h3>My Profile</h3>
            </div>
            <div onClick={handleLogout} className="option">
              <IoLogOutOutline />
              <h3>Logout</h3>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Dashboard;
