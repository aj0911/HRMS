import React, { useState } from "react";
import Loader from "../../Loader/Loader";
import { IoMdCloudDownload } from "react-icons/io";
import { checkIsSingleDataExist } from "../../../Helper/Helper";
import { FaEye } from "react-icons/fa";

const Profile = ({ emp, pages }) => {
  //States
  const [page, setPage] = useState(0);

  if (emp)
    return (
      <div className="profile">
        <div className="top-pages">
          {pages.map((nav, idx) =>
            checkIsSingleDataExist(nav.datas(emp), "val") ? (
              <button key={idx} onClick={() => setPage(idx)}>
                {nav.icon}
                <h3>{nav.name}</h3>
              </button>
            ) : null
          )}
        </div>
        <div className="bottom-pages">
          <div className="viewData">
            {pages[page].datas(emp).map((x, idx) => {
              if (!x.val) return null;
              if(page===3)return(
                <div key={idx} className="downloadDataContent">
                    <h3>{x.name}</h3>
                    <a href={x.val} target="_blank">
                      <FaEye />
                    </a>
                  </div>
              )
              else if (page === 2)
                return (
                  <div key={idx} className="downloadDataContent">
                    <h3>{x.name}</h3>
                    <a href={x.val} target="_blank">
                      <IoMdCloudDownload />
                    </a>
                  </div>
                );
              else
                return (
                  <div key={idx} className="viewDataContent">
                    <h3>{x.name}</h3>
                    <h4>{x.val}</h4>
                  </div>
                );
            })}
          </div>
        </div>
      </div>
    );
  else return <Loader size={50} />;
};

export default Profile;
