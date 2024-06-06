import React, { useState } from "react";
import "./ToggleBtn.css";

const ToggleBtn = ({ size, value = false }) => {

    const [active,setActive] = useState(value)
  return (
    <div
      style={{ width: 2 * size, height: size }}
      className={`toggleContainer ${active ? "active" : ""}`}
      onClick={()=>setActive(prev=>!prev)}
    >
      <div className="toggleSlider"></div>
    </div>
  );
};

export default ToggleBtn;
