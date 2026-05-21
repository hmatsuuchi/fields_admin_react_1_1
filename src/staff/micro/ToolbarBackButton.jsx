import React from "react";
// CSS
import "./ToolbarBackButton.scss";
import { Link } from "react-router-dom";

function ToolbarBackButton({
  backButtonText,
  backButtonLink,
  displayBackButton,
  setDisplayBackButton,
}) {
  /* HANDLE CLICKS TO BACK BUTTON */
  const handleClicksToBackButton = () => {
    setDisplayBackButton(false);
  };

  if (
    backButtonText === "" ||
    backButtonText === undefined ||
    backButtonLink === "" ||
    backButtonLink === undefined ||
    !displayBackButton
  )
    return <div />;

  return (
    <Link
      to={backButtonLink}
      id="toolbar-back-button"
      onClick={() => handleClicksToBackButton()}
    >
      {backButtonText}
    </Link>
  );
}

export default ToolbarBackButton;
