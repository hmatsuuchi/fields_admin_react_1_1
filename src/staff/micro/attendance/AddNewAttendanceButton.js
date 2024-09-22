import React from "react";
// CSS
import "./AddNewAttendanceButton.scss";

function AddNewAttendanceButton({ setShowAttendanceCreateUpdateContainer }) {
  /* ----------------------------------------------- */
  /* ---- ADD NEW ATTENDANCE BUTTON - FUNCTIONS ---- */
  /* ----------------------------------------------- */

  const handleClicksToAddNewAttendanceButton = () => {
    setShowAttendanceCreateUpdateContainer(true);
  };

  /* ----------------------------------------------- */
  /* ------- ADD NEW ATTENDANCE BUTTON - JSX ------- */
  /* ----------------------------------------------- */

  return (
    <button
      className="add-new-attendance-button"
      onClick={handleClicksToAddNewAttendanceButton}></button>
  );
}

export default AddNewAttendanceButton;
