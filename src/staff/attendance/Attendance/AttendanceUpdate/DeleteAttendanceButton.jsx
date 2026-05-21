import React from "react";
/* CSS */
import "./DeleteAttendanceButton.scss";

function DeleteAttendanceButton({ setShowConfirmationModal }) {
  /* ------------------------------------------------------ */
  /* ----------------------- STATE ------------------------ */
  /* ------------------------------------------------------ */

  /* ------------------------------------------------------- */
  /* ---------------------- FUNCTIONS ---------------------- */
  /* ------------------------------------------------------- */

  /* HANDLE CLICKS TO DELETE ATTENDANCE RECORD BUTTON */
  const handleClicksToDeleteAttendanceRecordButton = () => {
    setShowConfirmationModal(true);
  };

  /* ------------------------------------------------------ */
  /* ------------------------ JSX ------------------------- */
  /* ------------------------------------------------------ */

  return (
    <button
      className="delete-attendance-button"
      onClick={handleClicksToDeleteAttendanceRecordButton}
    />
  );
}

export default DeleteAttendanceButton;
