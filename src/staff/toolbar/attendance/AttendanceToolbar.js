import React from "react";
// CSS
import "./AttendanceToolbar.scss";

function AttendanceToolbar({ disableToolbarButtons }) {
  return (
    <div
      id="attendance-toolbar"
      className={disableToolbarButtons ? "disable-toolbar-buttons" : ""}>
      {/* toolbar buttons go here */}
    </div>
  );
}

export default AttendanceToolbar;
