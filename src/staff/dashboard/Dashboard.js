import React, { useState, useEffect, Fragment } from "react";
// CSS
import "./Dashboard.scss";
// COMPONENTS
import IncompleteAttendanceForInstructor from "./dashboard/IncompleteAttendanceForInstructor";
import StudentChurn from "./dashboard/StudentChurn";
import TotalActiveStudents from "./dashboard/TotalActiveStudents";
import DashboardToolbar from "../toolbar/dashboard/DashboardToolbar";
// import AtRiskStudents from "./dashboard/AtRiskStudents";
import UpcomingBirthdays from "./dashboard/UpcomingBirthdays";

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
        {/* <AtRiskStudents /> */}
        <UpcomingBirthdays />
      </div>
      <DashboardToolbar disableToolbarButtons={disableToolbarButtons} />
    </Fragment>
  );
}

export default Dashboard;
