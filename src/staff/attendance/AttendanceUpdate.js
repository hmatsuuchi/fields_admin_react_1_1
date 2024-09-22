import React, { Fragment } from "react";
/* CSS */
import "./AttendanceUpdate.scss";

/* COMPONENTS - ATTENDANCE UPDATE */
function AttendanceUpdate({
  csrfToken,
  setShowAttendanceCreateUpdateContainer,
}) {
  /* ----------------------------------------------------- */
  /* ------------- ATTENDANCE UPDATE - STATE ------------- */
  /* ----------------------------------------------------- */

  const handleClicksToExitButton = () => {
    setShowAttendanceCreateUpdateContainer(false);
  };

  /* ----------------------------------------- */
  /* -------- ATTENDANCE UPDATE - JSX -------- */
  /* ----------------------------------------- */

  return (
    <Fragment>
      <div
        className="attendance-update-background"
        onClick={handleClicksToExitButton}></div>
      <div className="attendance-update-container">
        <div className="attendance-update-card">
          <div className="exit-button" onClick={handleClicksToExitButton}></div>
          <div className="input-container">
            <div className="class-select-container"></div>
            <div>Date</div>
            <div>Start Time</div>
            <div>Teacher</div>
            <div>Students</div>
          </div>
          <div className="buttons-container">
            <button>Save</button>
            <button>Cancel</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default AttendanceUpdate;
