import React, { useState } from "react";
import "./Employees.css";
import SearchBar from "../../../Helper/SearchBar/SearchBar";
import { FaBriefcase, FaPlusCircle, FaUser } from "react-icons/fa";
import { VscSettings } from "react-icons/vsc";
import { MdMail } from "react-icons/md";
import { IoIosLock } from "react-icons/io";

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

  //Methods
  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (modalPage === pages.length) {
      console.log("mai chala");
    }
  };

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
                  value={modalPage < pages.length - 1 ? "Next" : "Submit"}
                  onClick={() => {
                      if(modalPage===pages.length)setModalPage(3);
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
