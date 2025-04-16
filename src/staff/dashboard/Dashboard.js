import React from "react";
// CSS
import "./Dashboard.scss";
// COMPONENTS
import IncompleteAttendanceForInstructor from "./dashboard/IncompleteAttendanceForInstructor";

function Dashboard() {
  return (
    <div id="dashboard-primary-container">
      <IncompleteAttendanceForInstructor />
    </div>
  );
}

export default Dashboard;
