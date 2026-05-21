import React from "react";
// CSS
import "./DashboardToolbar.scss";
// COMPONENTS
import ToolbarBackButton from "../../micro/ToolbarBackButton";

function DashboardToolbar({
  disableToolbarButtons,
  backButtonText,
  backButtonLink,
  displayBackButton,
  setDisplayBackButton,
}) {
  return (
    <div
      id="dashboard-toolbar"
      className={disableToolbarButtons ? "disable-toolbar-buttons" : ""}
    >
      <ToolbarBackButton
        backButtonText={backButtonText}
        backButtonLink={backButtonLink}
        displayBackButton={displayBackButton}
        setDisplayBackButton={setDisplayBackButton}
      />
    </div>
  );
}

export default DashboardToolbar;
