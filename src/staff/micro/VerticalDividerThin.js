import React from "react";
// CSS
import "./VerticalDividerThin.scss";

function VerticalDividerThin({ DOMOrder }) {
  return (
    <div className="vertical-divider-thin" style={{ order: DOMOrder }}></div>
  );
}

export default VerticalDividerThin;
