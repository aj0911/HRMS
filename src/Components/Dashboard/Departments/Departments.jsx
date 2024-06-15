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

  //Functions
  const handleAdd = async (e) => {
    e.preventDefault();
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
  };

  const getAllDepartments = async () => {
    const val = await DepartmentService.read();
    setDepartments(val === null ? [] : Object.values(val));
  };

  const handleChange = (text) => {
    if (text === "") getAllDepartments();
    else {
      const val = [...departments];
      console.log(val,text)
      const updatedVal = [];
      val.forEach(x=>{
        if(x.name.toLowerCase().includes(text))updatedVal.push(x)
      })
      console.log(updatedVal)
      setDepartments(updatedVal)
    }
  };

  useEffect(() => {
    getAllDepartments();
  }, [showAddModal]);

  return departments === null ? (
    <Loader size={50} />
  ) : (
    <>
      <div className="Departments">
        <div className="top">
          <SearchBar onChange={(e) => handleChange(e.target.value)} />
          <button onClick={() => setShowAddModal(true)}>
            <FaPlusCircle />
            <h3>Add More</h3>
          </button>
        </div>
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
