import React from "react";
import { useNavigate } from "react-router-dom";
// CSS
import "./AddNewAttendanceButton.scss";

function AddNewAttendanceButton() {
  /* ----------------------------------------------- */
  /* ---- ADD NEW ATTENDANCE BUTTON - FUNCTIONS ---- */
  /* ----------------------------------------------- */

  const navigate = useNavigate();

  const handleClicksToAddNewAttendanceButton = () => {
    navigate(`/staff/attendance/create/`);
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
