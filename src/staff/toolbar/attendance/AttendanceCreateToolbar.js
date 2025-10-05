import React from "react";
// CSS
import "./AttendanceCreateToolbar.scss";
// COMPONENTS
import ToolbarBackButton from "../../micro/ToolbarBackButton";

function AttendanceCreateToolbar({
  disableToolbarButtons,
  backButtonText,
  backButtonLink,
  displayBackButton,
  setDisplayBackButton,
}) {
  /* ----------------------------------------------------- */
  /* ------- ATTENDANCE CREATE TOOLBAR - FUNCTIONS ------- */
  /* ----------------------------------------------------- */

  /* ----------------------------------------------------- */
  /* ---------- ATTENDANCE CREATE TOOLBAR - JSX ---------- */
  /* ----------------------------------------------------- */

  return (
    <div
      id="attendance-create-toolbar"
      className={disableToolbarButtons ? "disable-toolbar-buttons" : ""}
    >
      <ToolbarBackButton
        backButtonText={backButtonText}
        backButtonLink={backButtonLink}
        displayBackButton={displayBackButton}
        setDisplayBackButton={setDisplayBackButton}
      />
    </div>
  );
}

export default AttendanceCreateToolbar;
