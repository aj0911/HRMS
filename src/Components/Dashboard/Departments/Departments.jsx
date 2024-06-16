import React, { useEffect, useState } from "react";
import "./Departments.css";
import SearchBar from "../../../Helper/SearchBar/SearchBar";
import { FaPlusCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import DepartmentService from "../../../Services/DepartmentService";
import Loader from "../../Loader/Loader";

const Departments = () => {
  //States
  const [showAddModal, setShowAddModal] = useState(false);
  const [data, setData] = useState("");
  const [departments, setDepartments] = useState(null);
  const [loader, setLoader] = useState(false);
  const [text, setText] = useState("");

  //Functions
  const handleAdd = async (e) => {
    e.preventDefault();
    setLoader(true);
    if (data.name) {
      let isContain = false;
      departments.forEach((x) => {
        if (x.name.toLowerCase() === data.name.toLowerCase()) isContain = true;
      });
      if (isContain) toast.error("Department already exist.");
      else {
        await DepartmentService.create(data);
        toast.success("Department Added Successfully.");
        setShowAddModal(false);
      }
    } else toast.error("All Fields are mandatory.");
    setLoader(false);
  };

  const getAllDepartments = async () => {
    setLoader(true);
    const val = await DepartmentService.read();
    setDepartments(val === null ? [] : Object.values(val));
    setLoader(false);
  };

  const handleChange = async () => {
    setLoader(true);
    const val = Object.values(await DepartmentService.read());
    const updatedVal = [];
    val.forEach((x) => {
      if (x.name.toLowerCase().includes(text.toLowerCase())) updatedVal.push(x);
    });
    setDepartments(updatedVal);
    setLoader(false);
  };

  useEffect(() => {
    if (!showAddModal) {
      if (text.length > 0) {
        const timer = setTimeout(() => {
          handleChange();
        }, 500);
        return () => clearTimeout(timer);
      } else getAllDepartments();
    }
  }, [showAddModal, text]);

  return (
    <>
      <div className="Departments">
        <div className="top">
          <SearchBar onChange={(e) => setText(e.target.value)} />
          <button onClick={() => setShowAddModal(true)}>
            <FaPlusCircle />
            <h3>Add More</h3>
          </button>
        </div>
        {loader || departments === null ? (
          <Loader size={50} fullHeight={true} fullWidth={true} />
        ) : (
          <div className="bottom">
            {departments
              .sort((a, b) => b.timeStamp - a.timeStamp)
              .map((department, key) => (
                <div className="department" key={key}>
                  <div className="header">
                    <div className="content">
                      <h3>{department?.name}</h3>
                      <h5>{department?.employees?.length || 0} Members</h5>
                    </div>
                    <h3>View All</h3>
                  </div>
                  {department?.employees?.length === 0 ? (
                    <div className="employees"></div>
                  ) : null}
                </div>
              ))}
          </div>
        )}
      </div>
      {showAddModal ? (
        <div className="modal">
          <div className="add">
            <h3>Add New Department</h3>
            <form onSubmit={(e) => handleAdd(e)}>
              <input
                onChange={(e) => setData({ name: e.target.value })}
                type="text"
                placeholder="Enter Department Name"
              />
              <div className="btns">
                <input
                  type="button"
                  value="Cancel"
                  onClick={() => setShowAddModal(false)}
                />
                <input type="submit" value="Add" />
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Departments;
