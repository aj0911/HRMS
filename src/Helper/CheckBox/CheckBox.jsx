import React, { useEffect, useRef, useState } from "react";
import "./CheckBox.css";

const CheckBox = ({
  text = "",
  style,
  textStyle = {},
  size = 15,
  value = false,
  onChange=()=>{},
  className=''
}) => {
  //states
  const [checked, setChecked] = useState(value);
  const isInitialMount = useRef(true);

  //methods
  const handleChecking = () => setChecked((prev) => !prev);

  //Rendering
  useEffect(()=>{
    if(isInitialMount.current)isInitialMount.current = false;
    else onChange(checked)
  },[checked])
  return (
    <div style={style} onClick={handleChecking} className={`checkbox-container ${className}`}>
      <div
        style={{ width: size, height: size }}
        className={`checkbox ${checked ? "active" : ""}`}
      >
        {checked ? <p style={{fontSize:size}}>&#10003;</p> : null}
      </div>
      <h3 style={textStyle}>{text}</h3>
    </div>
  );
};

export default CheckBox;
