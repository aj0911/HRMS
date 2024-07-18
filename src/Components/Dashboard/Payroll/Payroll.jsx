import React, { useEffect, useState } from "react";
import "./Payroll.css";
import "../Employees/Employees.css";
import "../Holidays/Holidays.css";
import "../Attendance/Attendance.css";
import SearchBar from "../../../Helper/SearchBar/SearchBar";
import Loader from "../../Loader/Loader";
import {
  FaAngleLeft,
  FaAngleRight,
  FaMoneyBill,
  FaPrint,
} from "react-icons/fa";
import { monthNames, normalizeNum } from "../../../Helper/Helper";
import toast from "react-hot-toast";
import EmployeeService from "../../../Services/EmployeeService";
import AttendanceService from "../../../Services/AttendanceService";

const Payroll = () => {
  //States
  const [text, setText] = useState("");
  const [loader, setLoader] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [date, setDate] = useState("");
  const [employees, setEmployees] = useState("");
  const itemsPerPage = 10;
  const [maxPage, setMaxPage] = useState(1);
  const [page, setPage] = useState(1);

  //Methods
  const handleShowBtnClick = async () => {
    if (date.month && date.year) {
      const curr = new Date(Date.now());
      const flag1 = (date.month < curr.getMonth() && curr.getFullYear() >= date.year )
      const flag2 = (curr.getMonth()===0 && curr.getFullYear() > date.year)
      if(flag1 || flag2){
        setLoader(true);
        setShowTable(true);
        const val = [];
        const emps = await EmployeeService.getAllEmployees();
        for (let emp of emps) {
          const parameters = await AttendanceService.giveParameters(
            date.month,
            date.year,
            emp.id,
            emp.ctc
          );
          val.push({
            ...emp,
            ...parameters,
          });
        }
        setEmployees(val);
        const perPage = val.length / itemsPerPage;
        setMaxPage(
          Math.floor(perPage) === perPage ? perPage : Math.floor(perPage) + 1
        );
        setLoader(false);
      } else toast.error("We cant show you the future salaries.");
    } else toast.error("Select Month and Year first!!");
  };

  useEffect(() => {
    console.log(employees);
  }, [employees]);

  return (
    <div className="Employee">
      <div className="top">
        <SearchBar onChange={(e) => setText(e.target.value)} />
        <div className="btns">
          <select
            className={date.month ? "" : "placeholder"}
            onChange={(e) => {
              if (e.target.value === "-1")
                e.target.classList.add("placeholder");
              else e.target.classList.remove("placeholder");
              setDate({ ...date, month: e.target.value });
            }}
          >
            <option selected={date.month == "-1" ? true : false} value={-1}>
              Month
            </option>
            {monthNames.map((m, i) => (
              <option
                key={i}
                selected={date.month === i ? true : false}
                value={i}
              >
                {m}
              </option>
            ))}
          </select>
          <select
            className={date.year ? "" : "placeholder"}
            onChange={(e) => {
              if (e.target.value === "-1")
                e.target.classList.add("placeholder");
              else e.target.classList.remove("placeholder");
              setDate({ ...date, year: e.target.value });
            }}
          >
            <option selected={date.year == "-1" ? true : false} value={-1}>
              Year
            </option>
            {(() => {
              const dt = new Date(Date.now());
              const currYear = dt.getFullYear();
              const arr = [];
              for (let yr = 1980; yr <= currYear; yr++) arr.push(yr);
              return arr.map((yr, i) => (
                <option
                  key={i}
                  selected={date.year === yr ? true : false}
                  value={yr}
                >
                  {yr}
                </option>
              ));
            })()}
          </select>
          <button id="addBtn" onClick={handleShowBtnClick}>
            <FaMoneyBill />
            <h3>Show</h3>
          </button>
        </div>
      </div>
      {loader ? (
        <Loader fullWidth={true} size={50} />
      ) : date === "" || showTable === false ? (
        <h3 className="empty-text-signal">Select a Month of Year First</h3>
      ) : employees.length === 0 ? (
        <h3 className="empty-text-signal">No Employee is here!!</h3>
      ) : (
        <div className="bottom">
          <table>
            <thead>
              <tr>
                <td>Employee Name</td>
                <td>CTC</td>
                <td>Salary Per Month</td>
                <td>Deduction</td>
                <td>Salary Slip</td>
              </tr>
            </thead>
            <tbody>
              {employees
                .sort((a, b) => a.empId.localeCompare(b.empId)) //sorting
                .slice((page - 1) * itemsPerPage, page * itemsPerPage) //pagination
                .map((emp, key) => {
                  return (
                    <tr key={key}>
                      <td data-name={"Employee Name"}>
                        <div className="table-box">
                          <img src={emp.profile} alt="" />
                          <h3>{emp.name}</h3>
                        </div>
                      </td>
                      <td data-name={"CTC"}>
                        <h3>
                          {normalizeNum(emp.ctc*100000)}
                        </h3>
                      </td>
                      <td data-name={"Salary Per Month"}>
                        <h3>
                          {emp.net_salary}
                        </h3>
                      </td>
                      <td data-name={"Deduction"}>
                        <h3>
                          {emp.deductions}
                        </h3>
                      </td>
                      <td data-name={"Salary Slip"}>
                        <div className="table-box">
                          <FaPrint />
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <div style={{ justifyContent: "center" }} className="pagination">
            <div className="paging">
              {page <= 1 ? null : (
                <FaAngleLeft onClick={() => setPage(page - 1)} />
              )}
              <h3>{page}</h3>
              {page >= maxPage ? null : (
                <FaAngleRight onClick={() => setPage(page + 1)} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;
