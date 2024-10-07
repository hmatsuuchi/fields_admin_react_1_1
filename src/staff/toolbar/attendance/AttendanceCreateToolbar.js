import React from "react";
// CSS
import "./AttendanceCreateToolbar.scss";
// COMPONENTS
import ToolbarBackButton from "../../micro/attendance/ToolbarBackButton";

function AttendanceCreateToolbar({ disableToolbarButtons }) {
  /* ----------------------------------------------------- */
  /* ------- ATTENDANCE CREATE TOOLBAR - FUNCTIONS ------- */
  /* ----------------------------------------------------- */

  /* ----------------------------------------------------- */
  /* ---------- ATTENDANCE CREATE TOOLBAR - JSX ---------- */
  /* ----------------------------------------------------- */

  return (
    <div
      id="attendance-create-toolbar"
      className={disableToolbarButtons ? "disable-toolbar-buttons" : ""}>
      <ToolbarBackButton
        backButtonLink="/staff/attendance/day-view/"
        backButtonText="欠席表"
      />
    </div>
  );
}

export default AttendanceCreateToolbar;
