import React, { useEffect, useState } from "react";
import "./Attendance.css";
import "../Employees/Employees.css";
import "../Holidays/Holidays.css";
import SearchBar from "../../../Helper/SearchBar/SearchBar";
import EmployeeService from "../../../Services/EmployeeService";
import { ATTENDANCE_OPTIONS, formatDate } from "../../../Helper/Helper";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Loader from "../../Loader/Loader";
import AttendanceService from "../../../Services/AttendanceService";
import toast from "react-hot-toast";

const Attendance = () => {
  //States
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [loader, setLoader] = useState(false);
  const [employees, setEmployees] = useState([]);
  const itemsPerPage = 10;
  const [maxPage, setMaxPage] = useState(1);
  const [page, setPage] = useState(1);

  //Methods
  const getAllEmployees = async () => {
    setLoader(true);
    const val = [];
    const allEmps = await EmployeeService.getAllEmployees();
    for (let emp of allEmps) {
      val.push({
        ...emp,
        attendance: await AttendanceService.attendanceExist(emp.id, date),
      });
    }
    setEmployees(val);
    const perPage = val.length / itemsPerPage;
    setMaxPage(
      Math.floor(perPage) === perPage ? perPage : Math.floor(perPage) + 1
    );
    setLoader(false);
  };

  const handleChange = async () => {
    setLoader(true);
    const val = [];
    const allEmps = await EmployeeService.getAllEmployees();
    for (let emp of allEmps) {
      val.push({
        ...emp,
        attendance: await AttendanceService.attendanceExist(emp.id, date),
      });
    }
    const updatedVal = [];
    val.forEach((x) => {
      if (x.name.toLowerCase().includes(text.toLowerCase())) updatedVal.push(x);
    });
    setEmployees(updatedVal);
    const perPage = updatedVal.length / itemsPerPage;
    setMaxPage(
      Math.floor(perPage) === perPage ? perPage : Math.floor(perPage) + 1
    );
    setPage(1);
    setLoader(false);
  };

  const markAttendance = async (data) => {
    setLoader(true);
    const attendance = await AttendanceService.attendanceExist(
      data.user,
      data.date
    );
    if (attendance) {
      //Update
      await AttendanceService.update(attendance.id, data);
      toast.success("Attendance Status Updated to " + data.status);
    } else {
      //Create New
      await AttendanceService.create(data);
      toast.success("Attendance Status Marked to " + data.status);
    }
    if (text) await handleChange();
    else await getAllEmployees();
    setLoader(false);
  };

  useEffect(() => {
    if (date) {
      if (text.length > 0) {
        const timer = setTimeout(() => {
          handleChange();
        }, 500);
        return () => clearTimeout(timer);
      } else getAllEmployees();
    }
  }, [text, date]);

  //Returning JSX
  return (
    <div className="Employee">
      <div className="top">
        <SearchBar onChange={(e) => setText(e.target.value)} />
        <div className="btns">
          <input
            type="text"
            placeholder="Date"
            value={date}
            onFocus={(e) => {
              e.target.type = "date";
            }}
            onBlur={(e) => {
              if (e.target.value == "") e.target.type = "text";
            }}
            onChange={(e) =>
              setDate((prev) => {
                if (new Date(e.target.value) <= new Date(Date.now()))
                  return e.target.value;
                toast.error(`You can't mark an attendance for future.`);
                return prev;
              })
            }
          />
        </div>
      </div>
      {loader ? (
        <Loader fullWidth={true} size={50} />
      ) : date === "" ? (
        <h3 className="empty-text-signal">Select a Date First</h3>
      ) : employees.length === 0 ? (
        <h3 className="empty-text-signal">No Employee is here!!</h3>
      ) : (
        <div className="bottom">
          <table>
            <thead>
              <tr>
                <td>Employee Name</td>
                <td>Employee ID</td>
                <td>Date</td>
                <td>Status</td>
                <td>Mark Attendance</td>
              </tr>
            </thead>
            <tbody>
              {employees
                .sort((a, b) => a.empId.localeCompare(b.empId)) //sorting
                .slice((page - 1) * itemsPerPage, page * itemsPerPage) //pagination
                .map((emp, key) => {
                  console.log(emp, date);
                  return (
                    <tr key={key}>
                      <td
                        data-name={"Employee Name"}
                        style={{
                          borderLeft: `5px solid var(--${
                            emp.attendance
                              ? emp.attendance.status ===
                                ATTENDANCE_OPTIONS.PRESENT
                                ? "secColor-1"
                                : "textColor-3"
                              : "textColor-2"
                          })`,
                        }}
                      >
                        <div className="table-box">
                          <img src={emp.profile} alt="" />
                          <h3>{emp.name}</h3>
                        </div>
                      </td>
                      <td data-name={"Employee ID"}>
                        <h3>{emp.empId}</h3>
                      </td>
                      <td data-name={"Date"}>
                        <h3>{formatDate(date)}</h3>
                      </td>
                      <td data-name={"Status"} className="color-td">
                        <h3>
                          {emp.attendance?.isHoliday
                            ? "Holiday"
                            :emp.attendance?.isLeave
                            ? "Leave": emp.attendance?.status || "Not Marked"}
                        </h3>
                      </td>
                      <td data-name={"Mark Attendance"}>
                        {emp.attendance?.isHoliday ||
                        emp.attendance?.isLeave ? (
                          <h3>#</h3>
                        ) : (
                          <div className="table-box">
                            {emp.attendance ? (
                              emp.attendance.status ===
                              ATTENDANCE_OPTIONS.PRESENT ? (
                                <button
                                  style={{
                                    backgroundColor: "var(--textColor-3)",
                                  }}
                                  onClick={() =>
                                    markAttendance({
                                      status: ATTENDANCE_OPTIONS.ABSENT,
                                      user: emp.id,
                                      date,
                                    })
                                  }
                                >
                                  A
                                </button>
                              ) : (
                                <button
                                  style={{
                                    backgroundColor: "var(--secColor-1)",
                                  }}
                                  onClick={() =>
                                    markAttendance({
                                      status: ATTENDANCE_OPTIONS.PRESENT,
                                      user: emp.id,
                                      date,
                                    })
                                  }
                                >
                                  P
                                </button>
                              )
                            ) : (
                              <>
                                <button
                                  style={{
                                    backgroundColor: "var(--secColor-1)",
                                  }}
                                  onClick={() =>
                                    markAttendance({
                                      status: ATTENDANCE_OPTIONS.PRESENT,
                                      user: emp.id,
                                      date,
                                    })
                                  }
                                >
                                  P
                                </button>
                                <button
                                  style={{
                                    backgroundColor: "var(--textColor-3)",
                                  }}
                                  onClick={() =>
                                    markAttendance({
                                      status: ATTENDANCE_OPTIONS.ABSENT,
                                      user: emp.id,
                                      date,
                                    })
                                  }
                                >
                                  A
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <div className="keys">
            {[
              { name: "Not Marked", color: `var(--textColor-2)` },
              { name: "Present", color: `var(--secColor-1)` },
              { name: "Absent", color: `var(--textColor-3)` },
            ].map((x, idx) => (
              <div key={idx} className="key">
                <div
                  style={{ backgroundColor: x.color }}
                  className="circle"
                ></div>
                <h3>{x.name}</h3>
              </div>
            ))}
          </div>
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

export default Attendance;
