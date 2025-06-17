import React, { useState, useEffect, Fragment } from "react";
// CSS
import "./Dashboard.scss";
// COMPONENTS
import IncompleteAttendanceForInstructor from "./dashboard/IncompleteAttendanceForInstructor";
import StudentChurn from "./dashboard/StudentChurn";
import TotalActiveStudents from "./dashboard/TotalActiveStudents";
import DashboardToolbar from "../toolbar/dashboard/DashboardToolbar";

function Dashboard() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [disableToolbarButtons, setDisableToolbarButtons] = useState(true);

  /* ------------------------------------------- */
  /* ---------------- FUNCTIONS ---------------- */
  /* ------------------------------------------- */

  useEffect(() => {
    /* enables the toolbar buttons */
    setDisableToolbarButtons(false);
  }, []);

  /* ------------------------------------------- */
  /* ------------------- JSX ------------------- */
  /* ------------------------------------------- */

  return (
    <Fragment>
      <div id="dashboard-primary-container">
        <IncompleteAttendanceForInstructor />
        <StudentChurn />
        <TotalActiveStudents />
      </div>
      <DashboardToolbar disableToolbarButtons={disableToolbarButtons} />
    </Fragment>
  );
}

export default Dashboard;
