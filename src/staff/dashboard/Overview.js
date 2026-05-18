import React, { Fragment } from "react";
// CSS
import "./Overview.scss";
// COMPONENTS
import AttendanceAlerts from "./overview/AttendanceAlerts";
import MonthlyRevenue from "./overview/MonthlyRevenue";
import OverviewToolbar from "../toolbar/dashboard/OverviewToolbar";
import MonthlyRevenueBreakdown from "./overview/MonthlyRevenueBreakdown";
import LifetimeData from "./overview/LifetimeData";

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
          <MonthlyRevenue />
          <MonthlyRevenueBreakdown />
          <LifetimeData />
        </div>
      </div>
      <OverviewToolbar />
    </Fragment>
  );
}

export default Overview;
