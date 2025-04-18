import React from "react";
// CSS
import "./DashboardToolbar.scss";

function DashboardToolbar({ disableToolbarButtons }) {
  return (
    <div
      id="dashboard-toolbar"
      className={disableToolbarButtons ? "disable-toolbar-buttons" : ""}
    ></div>
  );
}

export default DashboardToolbar;
