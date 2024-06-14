import React, { useEffect, useRef, useState } from "react";
import "./ToggleBtn.css";

const ToggleBtn = ({ size, initialValue = false, onToggle = () => {} }) => {
  //States
  const [active, setActive] = useState(initialValue);
  const isInitialMount = useRef(true);

  //Rendering
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      onToggle(active);
    }
  }, [active]);

  return (
    <div
      style={{ width: 2 * size, height: size }}
      className={`toggleContainer ${active ? "active" : ""}`}
      onClick={() => setActive((prev) => !prev)}
    >
      <div className="toggleSlider"></div>
    </div>
  );
};

export default ToggleBtn;
