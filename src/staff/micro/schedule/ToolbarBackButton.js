import React from "react";
// CSS
import "./ToolbarBackButton.scss";
import { Link } from "react-router-dom";

function ToolbarBackButton({ backButtonLink, backButtonText }) {
  return (
    <Link to={backButtonLink} className="toolbar-back-button">
      {backButtonText}
    </Link>
  );
}

export default ToolbarBackButton;
