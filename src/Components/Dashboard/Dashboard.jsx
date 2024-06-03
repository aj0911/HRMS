import React, { useEffect, useState } from 'react'
import {  useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'
import { MdOutlineWbSunny } from 'react-icons/md'
import { GoMoon } from 'react-icons/go'
import { BiSolidDashboard } from 'react-icons/bi'
import { PiUserSwitchDuotone, PiUsersThree } from 'react-icons/pi'
import { LuCalendarCheck, LuClipboardList, LuSettings } from 'react-icons/lu'
import { AiOutlineBell, AiOutlineDollar } from 'react-icons/ai'
import { FaBriefcase, FaChevronDown, FaRegCalendarAlt, FaRegUser, FaSearch } from 'react-icons/fa'
import { TbUsers } from 'react-icons/tb'
import { IoLogOutOutline } from 'react-icons/io5'

const Dashboard = () => {
    // States
    const auth = useSelector(state=>state.auth)
    const navigate = useNavigate();
    const [viewOptions,setViewOptions] = useState(false);

    //navigationsMenus
    const menus = [
      {
        name:'Dashboard',
        icon:<BiSolidDashboard/>
      },
      {
        name:'All Employees',
        icon:<PiUsersThree />
      },
      {
        name:'All Departments',
        icon:<PiUserSwitchDuotone />
      },
      {
        name:'Attendance',
        icon:<LuCalendarCheck />
      },
      {
        name:'Payroll',
        icon:<AiOutlineDollar />
      },
      {
        name:'Jobs',
        icon:<FaBriefcase />
      },
      {
        name:'Candidates',
        icon:<TbUsers />
      },
      {
        name:'Leaves',
        icon:<LuClipboardList />
      },
      {
        name:'Holidays',
        icon:<FaRegCalendarAlt />
      },
      {
        name:'Settings',
        icon:<LuSettings />
      },
    ]

    // Rendering
    useEffect(()=>{
        if(!auth.isAuth)navigate('/auth')
    },[])

  return (
    <>
      <div className={`Dashboard`}>
        <div className="left">
          <div className="logo">
            <img src={require('../../Assets/Images/logo.png')} alt="" />
            <h1>HRMS</h1>
          </div>
          <nav>
            {
              menus.map((menu,key)=>(
                <button key={key}>
                  {menu.icon}
                  <h3>{menu.name}</h3>
                </button>
              ))
            }
          </nav>
          <div className="btns">
            <button>
              <MdOutlineWbSunny />
              <h3>Light</h3>
            </button>
            <button>
              <GoMoon />
              <h3>Dark</h3>
            </button>
          </div>
        </div>
        <div className="right">
          <div className="header">
            <div className="left">
              <h3>Settings</h3>
              <h5>All System Settings</h5>
            </div>
            <div className="right">
              <div className="search">
                <FaSearch/>
                <input type="text" placeholder='Search' />
              </div>
              <div className="notification">
                <AiOutlineBell/>
              </div>
              <div onClick={()=>setViewOptions(true)} className="profile">
                <img src={require('../../Assets/Images/user.png')} alt="" />
                <div className="content">
                  <h3>Abhinav Jha</h3>
                  <h5>Software Engineer</h5>
                </div>
                <FaChevronDown />
              </div>
            </div>
          </div>
          <div className="box"></div>
        </div>
      </div>
      {
        viewOptions?
        <>
        <div onClick={()=>setViewOptions(false)} className="container">
        </div>
          <div className="options">
            <div className="option">
              <FaRegUser/>
              <h3>My Profile</h3>
            </div>
            <div className="option">
              <IoLogOutOutline/>
              <h3>Logout</h3>
            </div>
          </div>
          </>
        :null
      }
    </>
  )
}

export default Dashboard