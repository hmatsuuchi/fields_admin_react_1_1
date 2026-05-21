import React from "react";
// CSS
import "./ToolbarBackButton.scss";
import { Link } from "react-router-dom";

function ToolbarBackButton({
  backButtonText,
  setBackButtonText,
  backButtonLink,
}) {
  return backButtonText !== "" ? (
    <Link
      to={backButtonLink}
      className="toolbar-back-button"
      onClick={() => {
        setBackButtonText("");
      }}
    >
      {backButtonText}
    </Link>
  ) : null;
}

export default ToolbarBackButton;
