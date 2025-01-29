import React from "react";
// CSS
import "./ToolbarBackButton.scss";
import { Link } from "react-router-dom";

function ToolbarBackButton({
  backButtonLink,
  setBackButtonLink,
  backButtonText,
  setBackButtonText,
}) {
  const setBackButtonTextAndLink = () => {
    /* set back button text and link */
    setBackButtonText("出欠・日程");
    setBackButtonLink("/staff/attendance/day-view/");
  };

  return (
    <Link
      to={backButtonLink}
      className="toolbar-back-button"
      onClick={setBackButtonTextAndLink}
    >
      {backButtonText}
    </Link>
  );
}

export default ToolbarBackButton;
