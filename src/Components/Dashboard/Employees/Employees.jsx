import React, { useEffect, useMemo, useState } from "react";
import "./Employees.css";
import SearchBar from "../../../Helper/SearchBar/SearchBar";
import { FaBriefcase, FaCamera, FaPlusCircle, FaUser } from "react-icons/fa";
import { VscSettings } from "react-icons/vsc";
import { MdMail } from "react-icons/md";
import { IoIosLock } from "react-icons/io";
import countryList from "react-select-country-list";
import DragFiles from "../../../Helper/DragFiles/DragFiles";
import {
  EMPLOYEE_TYPES,
  OFFICE_LOCATIONS,
  validateEmail,
  validateForm,
} from "../../../Helper/Helper";
import DepartmentService from "../../../Services/DepartmentService";
import Loader from "../../Loader/Loader";
import { FaCloudArrowUp } from "react-icons/fa6";
import toast from "react-hot-toast";
import EmployeeService from "../../../Services/EmployeeService";

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
  const [data, setData] = useState("");

  //Methods
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    console.log(data);
    //Add Button Logic
    if (modalPage === pages.length - 1) {
      (await EmployeeService.create(data))
      toast.success('Employee Added Successfully.')
      setShowAddModal(false)
      setModalPage(0)
    }
    //Next Button Logic
    else {
      const flag1 =
        modalPage === 0 &&
        validateForm(
          data.profile,
          data.first_name,
          data.last_name,
          data.mobile_number,
          data.email,
          data.dob,
          data.marital_status,
          data.gender,
          data.country,
          data.address,
          data.city,
          data.state,
          data.zip_code
        );
      const flag2 =
        modalPage === 1 &&
        validateForm(
          data.empId,
          data.user_name,
          data.emp_type,
          data.department,
          data.designation,
          data.joining_date,
          data.office_location
        );
      if (flag1 || flag2 || modalPage === 2 || modalPage === 3) {
        if (validateEmail(data.email)) {
          if (modalPage === 1) {
            if (!(await EmployeeService.checkUserNameExist(data.user_name)))
              setModalPage((prev) => prev + 1);
            else toast.error("Username already exist!!");
          } else setModalPage((prev) => prev + 1);
        } else {
          toast.error("email must be like example@example.xyz");
        }
      } else toast.error("All Fields are Mandatory.");
    }
  };
  const getDepartments = async () => {
    setLoader(true);
    setDepartment(Object.values(await DepartmentService.read()));
    setLoader(false);
  };

  const getEmpID = async () => {
    setLoader(true);
    setData({ ...data, empId: `#EMP-${await EmployeeService.getNewEmpID()}` });
    setLoader(false);
  };

  //Rendering
  useEffect(() => {
    getDepartments();
    getEmpID();
  }, []);

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
                      onChange={(file) => setData({ ...data, profile: file })}
                      value={data.profile}
                    >
                      <FaCamera />
                    </DragFiles>
                    <input
                      onChange={(e) =>
                        setData({ ...data, first_name: e.target.value })
                      }
                      value={data.first_name}
                      type="text"
                      placeholder="First Name"
                    />
                    <input
                      onChange={(e) =>
                        setData({ ...data, last_name: e.target.value })
                      }
                      type="text"
                      placeholder="Last Name"
                      value={data.last_name}
                    />
                    <input
                      onChange={(e) =>
                        setData({ ...data, mobile_number: e.target.value })
                      }
                      value={data.mobile_number}
                      type="tel"
                      placeholder="Mobile Number"
                    />
                    <input
                      onChange={(e) =>
                        setData({ ...data, email: e.target.value })
                      }
                      value={data.email}
                      type="email"
                      placeholder="Email Address"
                    />
                    <input
                      type="text"
                      placeholder="Date of Birth"
                      value={data.dob}
                      onFocus={(e) => {
                        e.target.type = "date";
                      }}
                      onBlur={(e) => {
                        if (e.target.value == "") e.target.type = "text";
                      }}
                      onChange={(e) =>
                        setData({ ...data, dob: e.target.value })
                      }
                    />
                    <select
                      className={data.marital_status ? "" : "placeholder"}
                      onChange={(e) => {
                        if (e.target.value === "-1")
                          e.target.classList.add("placeholder");
                        else e.target.classList.remove("placeholder");
                        setData({ ...data, marital_status: e.target.value });
                      }}
                    >
                      <option
                        selected={data.marital_status == "-1" ? true : false}
                        value={-1}
                      >
                        Marital Status
                      </option>
                      <option
                        selected={
                          data.marital_status == "Married" ? true : false
                        }
                        value="Married"
                      >
                        Married
                      </option>
                      <option
                        selected={
                          data.marital_status == "Unmarried" ? true : false
                        }
                        value="Unmarried"
                      >
                        Unmarried
                      </option>
                    </select>
                    <select
                      className={data.gender ? "" : "placeholder"}
                      onChange={(e) => {
                        if (e.target.value === "-1")
                          e.target.classList.add("placeholder");
                        else e.target.classList.remove("placeholder");
                        setData({ ...data, gender: e.target.value });
                      }}
                    >
                      <option
                        selected={data.gender == "-1" ? true : false}
                        value={-1}
                      >
                        Gender
                      </option>
                      <option
                        selected={data.gender == "Male" ? true : false}
                        value="Male"
                      >
                        Male
                      </option>
                      <option
                        selected={data.gender == "Female" ? true : false}
                        value="Female"
                      >
                        Female
                      </option>
                      <option
                        selected={data.gender == "Other" ? true : false}
                        value="Other"
                      >
                        Other
                      </option>
                    </select>
                    <select
                      className={data.country ? "" : "placeholder"}
                      onChange={(e) => {
                        if (e.target.value === "-1")
                          e.target.classList.add("placeholder");
                        else e.target.classList.remove("placeholder");
                        setData({ ...data, country: e.target.value });
                      }}
                    >
                      <option
                        selected={data.country == "-1" ? true : false}
                        value={-1}
                      >
                        Country
                      </option>
                      {countryOptions.map((country, key) => (
                        <option
                          selected={
                            data.country == country.label ? true : false
                          }
                          key={key}
                          value={country.label}
                        >
                          {country.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="full-input"
                      placeholder="Address"
                      value={data.address}
                      onChange={(e) =>
                        setData({ ...data, address: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      className="one-third-input"
                      placeholder="City"
                      value={data.city}
                      onChange={(e) =>
                        setData({ ...data, city: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      className="one-third-input"
                      placeholder="State"
                      value={data.state}
                      onChange={(e) =>
                        setData({ ...data, state: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      className="one-third-input"
                      placeholder="Zip Code"
                      value={data.zip_code}
                      onChange={(e) =>
                        setData({ ...data, zip_code: e.target.value })
                      }
                    />
                  </>
                );
              else if (modalPage === 1)
                return (
                  <>
                    <input
                      value={data.empId}
                      readOnly
                      type="text"
                      placeholder="Employee ID"
                      style={{ backgroundColor: "var(--pannelHoverColor)" }}
                    />
                    <input
                      type="text"
                      placeholder="User Name"
                      value={data.user_name}
                      onChange={(e) =>
                        setData({
                          ...data,
                          user_name: e.target.value,
                        })
                      }
                    />
                    <select
                      className={data.emp_type ? "" : "placeholder"}
                      onChange={(e) => {
                        if (e.target.value === "-1")
                          e.target.classList.add("placeholder");
                        else e.target.classList.remove("placeholder");
                        setData({ ...data, emp_type: e.target.value });
                      }}
                    >
                      <option
                        selected={data.emp_type == "-1" ? true : false}
                        value={-1}
                      >
                        Select Employee Type
                      </option>
                      {Object.keys(EMPLOYEE_TYPES).map((type, key) => (
                        <option
                          selected={
                            data.emp_type == EMPLOYEE_TYPES[type] ? true : false
                          }
                          key={key}
                          value={EMPLOYEE_TYPES[type]}
                        >
                          {EMPLOYEE_TYPES[type]}
                        </option>
                      ))}
                    </select>
                    <select
                      className={data.department ? "" : "placeholder"}
                      onChange={(e) => {
                        if (e.target.value === "-1")
                          e.target.classList.add("placeholder");
                        else e.target.classList.remove("placeholder");
                        setData({ ...data, department: e.target.value });
                      }}
                    >
                      <option
                        selected={data.department == "-1" ? true : false}
                        value={-1}
                      >
                        Select Department
                      </option>
                      {department.map((dep, key) => (
                        <option
                          selected={data.department == dep.id ? true : false}
                          key={key}
                          value={dep.id}
                        >
                          {dep.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={data.designation}
                      onChange={(e) =>
                        setData({
                          ...data,
                          designation: e.target.value,
                        })
                      }
                      placeholder="Enter Designation"
                    />
                    <input
                      type="text"
                      placeholder="Select Joining Date"
                      value={data.joining_date}
                      onChange={(e) =>
                        setData({
                          ...data,
                          joining_date: e.target.value,
                        })
                      }
                      onFocus={(e) => {
                        e.target.type = "date";
                      }}
                      onBlur={(e) => {
                        if (e.target.value == "") e.target.type = "text";
                      }}
                    />
                    <select
                      className={`${
                        data.office_location ? "" : "placeholder"
                      } full-input`}
                      onChange={(e) => {
                        if (e.target.value === "-1")
                          e.target.classList.add("placeholder");
                        else e.target.classList.remove("placeholder");
                        setData({ ...data, office_location: e.target.value });
                      }}
                    >
                      <option
                        selected={data.office_location == "-1" ? true : false}
                        value={-1}
                      >
                        Select Office Location
                      </option>
                      {Object.keys(OFFICE_LOCATIONS).map((location, key) => (
                        <option
                          selected={
                            data.office_location == OFFICE_LOCATIONS[location]
                              ? true
                              : false
                          }
                          key={key}
                          value={OFFICE_LOCATIONS[location]}
                        >
                          {OFFICE_LOCATIONS[location]}
                        </option>
                      ))}
                    </select>
                  </>
                );
              else if (modalPage === 2)
                return (
                  <>
                    <div className="upload">
                      <h3>Upload Appointment Letter</h3>
                      <DragFiles
                        className={"fileDrag"}
                        acceptedFiles={["jpg", "png", "jpeg", "pdf"]}
                        onChange={(file) =>
                          setData({ ...data, appointment_letter: file })
                        }
                        value={data.appointment_letter}
                      >
                        <div className="icon">
                          <FaCloudArrowUp />
                        </div>
                        <h3>
                          Drag & Drop or <span>choose file</span> to upload
                        </h3>
                        <h5>Supported formats : Jpg, Png, Jpeg, pdf</h5>
                      </DragFiles>
                    </div>
                    <div className="upload">
                      <h3>Upload Salary Slips</h3>
                      <DragFiles
                        className={"fileDrag"}
                        acceptedFiles={["jpg", "png", "jpeg", "pdf"]}
                        onChange={(file) =>
                          setData({ ...data, salary_slips: file })
                        }
                        value={data.salary_slips}
                      >
                        <div className="icon">
                          <FaCloudArrowUp />
                        </div>
                        <h3>
                          Drag & Drop or <span>choose file</span> to upload
                        </h3>
                        <h5>Supported formats : Jpg, Png, Jpeg, pdf</h5>
                      </DragFiles>
                    </div>
                    <div className="upload">
                      <h3>Upload Reliving Letter</h3>
                      <DragFiles
                        className={"fileDrag"}
                        acceptedFiles={["jpg", "png", "jpeg", "pdf"]}
                        onChange={(file) =>
                          setData({ ...data, reliving_letter: file })
                        }
                        value={data.reliving_letter}
                      >
                        <div className="icon">
                          <FaCloudArrowUp />
                        </div>
                        <h3>
                          Drag & Drop or <span>choose file</span> to upload
                        </h3>
                        <h5>Supported formats : Jpg, Png, Jpeg, pdf</h5>
                      </DragFiles>
                    </div>
                    <div className="upload">
                      <h3>Upload Experience Letter</h3>
                      <DragFiles
                        className={"fileDrag"}
                        acceptedFiles={["jpg", "png", "jpeg", "pdf"]}
                        onChange={(file) =>
                          setData({ ...data, experience_letter: file })
                        }
                        value={data.experience_letter}
                      >
                        <div className="icon">
                          <FaCloudArrowUp />
                        </div>
                        <h3>
                          Drag & Drop or <span>choose file</span> to upload
                        </h3>
                        <h5>Supported formats : Jpg, Png, Jpeg, pdf</h5>
                      </DragFiles>
                    </div>
                  </>
                );
              else if (modalPage >= 3)
                return (
                  <>
                    <input
                      type="text"
                      value={data.linkedin_url}
                      onChange={(e) =>
                        setData({
                          ...data,
                          linkedin_url: e.target.value,
                        })
                      }
                      placeholder="Enter Linkedin ID"
                    />
                    <input
                      type="text"
                      value={data.slack_url}
                      onChange={(e) =>
                        setData({
                          ...data,
                          slack_url: e.target.value,
                        })
                      }
                      placeholder="Enter Slack ID"
                    />
                    <input
                      type="text"
                      value={data.skype_url}
                      onChange={(e) =>
                        setData({
                          ...data,
                          skype_url: e.target.value,
                        })
                      }
                      placeholder="Enter Skype ID"
                    />
                    <input
                      type="text"
                      value={data.github_url}
                      onChange={(e) =>
                        setData({
                          ...data,
                          github_url: e.target.value,
                        })
                      }
                      placeholder="Enter Github ID"
                    />
                  </>
                );
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
                  onClick={() => {
                    setShowAddModal(false);
                    setData("");
                    setModalPage(0);
                  }}
                />
                <input
                  type="submit"
                  value={modalPage < pages.length - 1 ? "Next" : "Add"}
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
