import React, { useEffect, useState } from "react";
import "./Holidays.css";
import SearchBar from "../../../Helper/SearchBar/SearchBar";
import {
  FaAngleLeft,
  FaAngleRight,
  FaPlusCircle,
  FaTrashAlt,
} from "react-icons/fa";
import "../Employees/Employees.css";
import CheckBox from "../../../Helper/CheckBox/CheckBox";
import { formatDate, getDay, Roles, validateForm } from "../../../Helper/Helper";
import toast from "react-hot-toast";
import HolidayService from "../../../Services/HolidayService";
import Loader from "../../Loader/Loader";
import { FaPencil } from "react-icons/fa6";
import useLongPress from "../../../Hooks/useLongPress";
import { MdOutlineClear } from "react-icons/md";
import { useSelector } from "react-redux";

const Holidays = () => {
  //States
  const [showCheckBoxes, setShowCheckBoxes] = useState(false);
  const [loader, setLoader] = useState(false);
  const [addModal, setAddModal] = useState({ isShow: false, data: {} });
  const [editModal, setEditModal] = useState({ isShow: false, data: {} });
  const [deleteModal, setDeleteModal] = useState({ isShow: false, data: {} });
  const [delArr, setDelArr] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [text, setText] = useState("");
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const auth = useSelector((state) => state.auth);
  const tableItemLongPressEvent = useLongPress(() => {
    if (window.innerWidth > 999) setShowCheckBoxes(true);
  }, 500);

  //methods
  const handleAdd = async (e) => {
    e.preventDefault();
    const data = addModal.data;
    if (validateForm(data.name, data.date)) {
      if (
        new Date(data.date).getFullYear() === new Date(Date.now()).getFullYear()
      ) {
        setLoader(true);
        await HolidayService.create(data);
        toast.success("Holiday Added Successfully");
        setAddModal({ isShow: false, data: {} });
        setLoader(false);
      } else
        toast.error(
          `You can only add holidays for ${new Date(Date.now()).getFullYear()}`
        );
    } else toast.error("All Fields are Mandatory");
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    const data = editModal.data;
    if (validateForm(data.name, data.date)) {
      if (
        new Date(data.date).getFullYear() === new Date(Date.now()).getFullYear()
      ) {
        setLoader(true);
        await HolidayService.update(data.id, data);
        toast.success("Holiday Updated Successfully");
        setEditModal({ isShow: false, data: {} });
        setLoader(false);
      } else
        toast.error(
          `You can only add holidays for ${new Date(Date.now()).getFullYear()}`
        );
    } else toast.error("All Fields are Mandatory");
  };
  const getAllHolidays = async () => {
    setLoader(true);
    const val = Object.values((await HolidayService.read()) || []);
    setHolidays(val);
    const perPage = val.length / itemsPerPage;
    setMaxPage(
      Math.floor(perPage) === perPage ? perPage : Math.floor(perPage) + 1
    );
    setLoader(false);
  };
  const handleChange = async () => {
    setLoader(true);
    const val = Object.values(await HolidayService.read());
    const updatedVal = [];
    val.forEach((x) => {
      if (x.name.toLowerCase().includes(text.toLowerCase())) updatedVal.push(x);
    });
    setHolidays(updatedVal);
    const perPage = updatedVal.length / itemsPerPage;
    setMaxPage(
      Math.floor(perPage) === perPage ? perPage : Math.floor(perPage) + 1
    );
    setPage(1);
    setLoader(false);
  };
  const handleMultiDelete = async () => {
    setLoader(true);
    await HolidayService.delete(delArr);
    toast.success("Holidays Deleted Successfully");
    await getAllHolidays();
    setPage(1);
    setText("");
    setShowCheckBoxes(false);
    setLoader(false);
  };
  const handleDelete = async () => {
    setLoader(true);
    await HolidayService.delete([deleteModal.data?.id]);
    toast.success("Holiday Deleted Successfully");
    setDeleteModal({ isShow: false, data: {} });
    setPage(1);
    setLoader(false);
  };

  //Rendering
  useEffect(() => {
    if (!addModal.isShow && !editModal.isShow && !deleteModal.isShow) {
      if (text.length > 0) {
        const timer = setTimeout(() => {
          handleChange();
        }, 500);
        return () => clearTimeout(timer);
      } else getAllHolidays();
    }
  }, [text, addModal.isShow, editModal.isShow, deleteModal.isShow]);

  if (addModal.isShow)
    return (
      <div className="modal">
        <div className="add">
          <h3>Add New Holiday</h3>
          {loader ? (
            <Loader size={50} />
          ) : (
            <form onSubmit={(e) => handleAdd(e)}>
              <input
                value={addModal.data?.name}
                onChange={(e) =>
                  setAddModal((prev) => {
                    return {
                      ...prev,
                      data: { ...prev.data, name: e.target.value },
                    };
                  })
                }
                type="text"
                placeholder="Enter Holiday Name"
              />
              <input
                type="text"
                placeholder="Date"
                value={addModal.data?.date}
                onFocus={(e) => {
                  e.target.type = "date";
                }}
                onBlur={(e) => {
                  if (e.target.value == "") e.target.type = "text";
                }}
                onChange={(e) =>
                  setAddModal((prev) => {
                    return {
                      ...prev,
                      data: { ...prev.data, date: e.target.value },
                    };
                  })
                }
              />
              <div className="btns">
                <input
                  type="button"
                  value="Cancel"
                  onClick={() => setAddModal({ isShow: false, data: {} })}
                />
                <input type="submit" value="Add" />
              </div>
            </form>
          )}
        </div>
      </div>
    );
  else if (deleteModal.isShow)
    return (
      <div className="modal">
        <div className="add">
          <h3>Delete Holiday Records</h3>
          {loader ? (
            <Loader size={50} />
          ) : (
            <form onSubmit={(e) => handleDelete(e)}>
              <p>
                Do you want to delete the record of {deleteModal.data?.name}
              </p>
              <div className="btns">
                <input
                  type="button"
                  value="Cancel"
                  onClick={() => setDeleteModal({ isShow: false, data: {} })}
                />
                <input type="submit" value="Delete" />
              </div>
            </form>
          )}
        </div>
      </div>
    );
  else if (editModal.isShow)
    return (
      <div className="modal">
        <div className="add">
          <h3>Edit Holiday</h3>
          {loader ? (
            <Loader size={50} />
          ) : (
            <form onSubmit={(e) => handleEdit(e)}>
              <input
                value={editModal.data?.name}
                onChange={(e) =>
                  setEditModal((prev) => {
                    return {
                      ...prev,
                      data: { ...prev.data, name: e.target.value },
                    };
                  })
                }
                type="text"
                placeholder="Enter Holiday Name"
              />
              <input
                type="text"
                placeholder="Date"
                value={editModal.data?.date}
                onFocus={(e) => {
                  e.target.type = "date";
                }}
                onBlur={(e) => {
                  if (e.target.value == "") e.target.type = "text";
                }}
                onChange={(e) =>
                  setEditModal((prev) => {
                    return {
                      ...prev,
                      data: { ...prev.data, date: e.target.value },
                    };
                  })
                }
              />
              <div className="btns">
                <input
                  type="button"
                  value="Cancel"
                  onClick={() => setEditModal({ isShow: false, data: {} })}
                />
                <input type="submit" value="Edit" />
              </div>
            </form>
          )}
        </div>
      </div>
    );
  else
    return (
      <div className="Employee">
        {showCheckBoxes  && auth.user?.role!==Roles.USER ? (
          <div className="top">
            <div className="btns">
              {delArr.length > 0 ? (
                <button onClick={handleMultiDelete}>
                  <FaTrashAlt />
                  <h3>Delete</h3>
                </button>
              ) : null}
              <button
                onClick={() => {
                  setShowCheckBoxes(false);
                  setDelArr([]);
                }}
              >
                <MdOutlineClear />
                <h3>Clear Selection</h3>
              </button>
            </div>
          </div>
        ) : (
          <div className="top">
            <SearchBar onChange={(e) => setText(e.target.value)} />
              {
                 auth.user?.role!==Roles.USER && 
                <div className="btns">
                  <button
                    id="addBtn"
                    onClick={() => setAddModal({ isShow: true, data: {} })}
                  >
                    <FaPlusCircle />
                    <h3>Add Holidays</h3>
                  </button>
                </div>
              }
          </div>
        )}
        {loader ? (
          <Loader size={50} fullWidth={true} />
        ) : holidays.length === 0 ? (
          <h3 className="empty-text-signal">No Holiday is added!!</h3>
        ) : (
          <div className="bottom">
            <table>
              <thead>
                <tr>
                  {showCheckBoxes  && auth.user?.role!==Roles.USER ? (
                    <td>
                      <CheckBox
                        onChange={async (val) => {
                          if (val) setDelArr(await HolidayService.getAllIDs());
                          else setDelArr([]);
                        }}
                      />
                    </td>
                  ) : null}
                  <td>Date</td>
                  <td>Day</td>
                  <td>Holiday Name</td>
                  {!showCheckBoxes && auth.user?.role!==Roles.USER ? <td>Action</td> : null}
                </tr>
              </thead>
              <tbody>
                {holidays
                  .sort((a, b) => new Date(a.date) - new Date(b.date)) //sorting
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage) //pagination
                  .map((holiday, key) => {
                    const h_date = new Date(holiday.date);
                    const current_date = new Date(Date.now());
                    return (
                      <tr
                        key={key}
                        {...tableItemLongPressEvent}
                        className={delArr.includes(holiday.id) ? "active" : ""}
                      >
                        {showCheckBoxes && auth.user?.role!==Roles.USER ? (
                          <td>
                            <CheckBox
                              value={delArr.includes(holiday.id)}
                              onChange={(val) => {
                                if (val)
                                  setDelArr((prev) => [...prev, holiday.id]);
                                else
                                  setDelArr((prev) => {
                                    const arr = [...prev];
                                    arr.splice(arr.indexOf(holiday.id), 1);
                                    return arr;
                                  });
                              }}
                            />
                          </td>
                        ) : null}
                        <td
                          style={{
                            borderLeft: `5px solid var(--${
                              h_date >= current_date
                                ? "secColor-1"
                                : "pannelHoverColor"
                            })`,
                          }}
                          data-name={"Date"}
                        >
                          <h3>{formatDate(holiday.date)}</h3>
                        </td>
                        <td data-name={"Day"}>
                          <h3>{getDay(holiday.date)}</h3>
                        </td>
                        <td data-name={"Holiday Name"}>
                          <h3>{holiday.name}</h3>
                        </td>
                        {showCheckBoxes || auth.user?.role===Roles.USER ? null : (
                          <td data-name={"Actions"}>
                            <div className="table-box">
                              <FaPencil
                                onClick={() => {
                                  setEditModal({
                                    isShow: true,
                                    data: {
                                      ...holiday,
                                      prevHolidayDate: holiday.date,
                                    },
                                  });
                                }}
                                className="icon"
                              />
                              <FaTrashAlt
                                onClick={() => {
                                  setDeleteModal({
                                    isShow: true,
                                    data: holiday,
                                  });
                                }}
                                className="icon"
                              />
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <div className="keys">
              {[
                { name: "Upcoming", color: `var(--secColor-1)` },
                { name: "Past Holidays", color: `var(--pannelHoverColor)` },
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

export default Holidays;
