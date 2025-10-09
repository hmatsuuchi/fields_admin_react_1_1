import React from "react";
// CSS
import "./Overview.scss";
// COMPONENTS
import IncompleteAttendanceForAllInstructors from "./overview/IncompleteAttendanceForAllInstructors";

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
    <div id="overview-primary-container">
      <IncompleteAttendanceForAllInstructors />
    </div>
  );
}

export default Overview;
