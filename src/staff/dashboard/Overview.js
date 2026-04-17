import React, { Fragment } from "react";
// CSS
import "./Overview.scss";
// COMPONENTS
import AttendanceAlerts from "./overview/AttendanceAlerts";
import OverviewToolbar from "../toolbar/dashboard/OverviewToolbar";

function Overview() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  /* ------------------------------------------- */
  /* ---------------- FUNCTIONS ---------------- */
  /* ------------------------------------------- */

  /* ------------------------------------------- */
  /* ------------------- JSX ------------------- */
  /* ------------------------------------------- */

  return (
    <Fragment>
      <div id="overview-section">
        <div id="overview-primary-container">
          <AttendanceAlerts />
        </div>
      </div>
      <OverviewToolbar />
    </Fragment>
  );
}

export default Overview;
