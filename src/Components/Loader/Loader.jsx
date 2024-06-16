import React from "react";
import "./Loader.css";

const Loader = ({ size, fullHeight = false, fullWidth = false }) => {
  return (
    <div
      className="loader"
      style={{
        flex: fullHeight ? 1 : `auto`,
        width: fullWidth ? `100%` : `auto`,
      }}
    >
      <div className="box" style={{ height: size, width: size }}></div>
    </div>
  );
};

export default Loader;
