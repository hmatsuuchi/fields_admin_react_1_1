import React from "react";
// CSS
import "./ToolbarBackButton.scss";
import { Link } from "react-router-dom";

function ToolbarBackButton() {
  return (
    <Link to="/staff/students/profiles/cards" className="toolbar-back-button">
      生徒情報
    </Link>
  );
}

export default ToolbarBackButton;
