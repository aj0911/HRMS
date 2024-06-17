import React, { useEffect, useMemo, useState } from "react";
import "./Employees.css";
import SearchBar from "../../../Helper/SearchBar/SearchBar";
import { FaBriefcase, FaCamera, FaPlusCircle, FaUser } from "react-icons/fa";
import { VscSettings } from "react-icons/vsc";
import { MdMail } from "react-icons/md";
import { IoIosLock } from "react-icons/io";
import countryList from "react-select-country-list";
import DragFiles from "../../../Helper/DragFiles/DragFiles";
import { EMPLOYEE_TYPES, OFFICE_LOCATIONS } from "../../../Helper/Helper";
import DepartmentService from "../../../Services/DepartmentService";
import Loader from "../../Loader/Loader";

const Employees = () => {
  //States
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalPage, setModalPage] = useState(0);
  const pages = [
    {
      name: "Personal Information",
      icon: <FaUser />,
    },
    {
      name: "Professional Information",
      icon: <FaBriefcase />,
    },
    {
      name: "Documents",
      icon: <MdMail />,
    },
    {
      name: "Account Access",
      icon: <IoIosLock />,
    },
  ];
  const countryOptions = useMemo(() => countryList().getData(), []);
  const [loader, setLoader] = useState(false);
  const [department, setDepartment] = useState("");

  //Methods
  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (modalPage === pages.length) {
      console.log("mai chala");
    }
  };
  const getDepartments = async () => {
    setLoader(true);
    setDepartment(Object.values(await DepartmentService.read()));
    setLoader(false);
  };

  //Rendering
  useEffect(()=>{
    getDepartments()
  },[])

  if (showAddModal)
    return (
      <div className="modal emp">
        <div className="add">
          <h3>Add New Employee</h3>
          <div className="pages">
            {pages.map((page, key) => (
              <button className={key === modalPage ? "active" : ""} key={key}>
                <h3>{page.name}</h3>
                {page.icon}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => handleAddEmployee(e)}>
            {(() => {
              if (loader || department === "")
                return <Loader size={50} fullHeight={true} fullWidth={true} />;
              if (modalPage <= 0)
                return (
                  <>
                    <DragFiles
                      className={"drag"}
                      acceptedFiles={["jpg", "png", "jpeg"]}
                    >
                      <FaCamera />
                    </DragFiles>
                    <input type="text" placeholder="First Name" />
                    <input type="text" placeholder="Last Name" />
                    <input type="tel" placeholder="Mobile Number" />
                    <input type="email" placeholder="Email Address" />
                    <input
                      type="text"
                      placeholder="Date of Birth"
                      onFocus={(e) => {
                        e.target.type = "date";
                      }}
                      onBlur={(e) => {
                        if (e.target.value == "") e.target.type = "text";
                      }}
                    />
                    <select
                      className="placeholder"
                      onChange={(e) => {
                        if (e.target.value === "-1")
                          e.target.classList.add("placeholder");
                        else e.target.classList.remove("placeholder");
                      }}
                    >
                      <option value={-1}>Marital Status</option>
                      <option value="Married">Married</option>
                      <option value="Unmarried">Unmarried</option>☻
                    </select>
                    <select
                      className="placeholder"
                      onChange={(e) => {
                        if (e.target.value === "-1")
                          e.target.classList.add("placeholder");
                        else e.target.classList.remove("placeholder");
                      }}
                    >
                      <option value={-1}>Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <select
                      className="placeholder"
                      onChange={(e) => {
                        if (e.target.value === "-1")
                          e.target.classList.add("placeholder");
                        else e.target.classList.remove("placeholder");
                      }}
                    >
                      <option value={-1}>Country</option>
                      {countryOptions.map((country, key) => (
                        <option key={key} value={country.label}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="full-input"
                      placeholder="Address"
                    />
                    <input
                      type="text"
                      className="one-third-input"
                      placeholder="City"
                    />
                    <input
                      type="text"
                      className="one-third-input"
                      placeholder="State"
                    />
                    <input
                      type="text"
                      className="one-third-input"
                      placeholder="Zip Code"
                    />
                  </>
                );
              else if (modalPage === 1)
                return (
                  <>
                    <input type="text" placeholder="Employee ID" />
                    <input type="text" placeholder="User Name" />
                    <select
                      className="placeholder"
                      onChange={(e) => {
                        if (e.target.value === "-1")
                          e.target.classList.add("placeholder");
                        else e.target.classList.remove("placeholder");
                      }}
                    >
                      <option value={-1}>Select Employee Type</option>
                      {Object.keys(EMPLOYEE_TYPES).map((type, key) => (
                        <option key={key} value={EMPLOYEE_TYPES[type]}>
                          {EMPLOYEE_TYPES[type]}
                        </option>
                      ))}
                    </select>
                    <select
                      className="placeholder"
                      onChange={(e) => {
                        if (e.target.value === "-1")
                          e.target.classList.add("placeholder");
                        else e.target.classList.remove("placeholder");
                      }}
                    >
                      <option value={-1}>Select Department</option>
                      {department.map((dep, key) => (
                        <option key={key} value={dep.id}>
                          {dep.name}
                        </option>
                      ))}
                    </select>
                    <input type="text" placeholder="Enter Designation" />
                    <input
                      type="text"
                      placeholder="Select Joining Date"
                      onFocus={(e) => {
                        e.target.type = "date";
                      }}
                      onBlur={(e) => {
                        if (e.target.value == "") e.target.type = "text";
                      }}
                    />
                    <select
                      className="placeholder full-input"
                      onChange={(e) => {
                        if (e.target.value === "-1")
                          e.target.classList.add("placeholder");
                        else e.target.classList.remove("placeholder");
                      }}
                    >
                      <option value={-1}>Select Office Location</option>
                      {Object.keys(OFFICE_LOCATIONS).map((location, key) => (
                        <option key={key} value={OFFICE_LOCATIONS[location]}>
                          {OFFICE_LOCATIONS[location]}
                        </option>
                      ))}
                    </select>
                  </>
                );
              else if(modalPage>=3)
                return (
              <>
                <input type="text" placeholder="Enter Linkedin ID" />
                <input type="text" placeholder="Enter Slack ID" />
                <input type="text" placeholder="Enter Skype ID" />
                <input type="text" placeholder="Enter Github ID" />
              </>)
            })()}
            <div className="btns">
              {modalPage > 0 ? (
                <input
                  type="button"
                  onClick={() => setModalPage((prev) => prev - 1)}
                  value="Back"
                />
              ) : null}
              <div className="btns">
                <input
                  type="button"
                  value="Cancel"
                  onClick={() => setShowAddModal(false)}
                />
                <input
                  type="submit"
                  value={modalPage < pages.length - 1 ? "Next" : "Add"}
                  onClick={() => {
                    if (modalPage === pages.length) setModalPage(3);
                    else setModalPage((prev) => prev + 1);
                  }}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  else
    return (
      <div className="Employee">
        <div className="top">
          <SearchBar />
          <div className="btns">
            <button onClick={() => setShowAddModal(true)}>
              <FaPlusCircle />
              <h3>Add More</h3>
            </button>
            <button>
              <VscSettings />
              <h3>Filter</h3>
            </button>
          </div>
        </div>
      </div>
    );
};

export default Employees;
