import React from "react";
/* REACT ROUTER DOM */
import { useNavigate } from "react-router-dom";
/* CSS */
import "./AddNewAttendanceButton.scss";

function AddNewAttendanceButton({
  setBackButtonText,
  setBackButtonLink,
  setDisplayBackButton,
}) {
  /* ----------------------------------------------- */
  /* ---- ADD NEW ATTENDANCE BUTTON - FUNCTIONS ---- */
  /* ----------------------------------------------- */

  const navigate = useNavigate();

  const handleClicksToAddNewAttendanceButton = () => {
    /* set back button state */
    setBackButtonText("出欠・日程");
    setBackButtonLink("/staff/attendance/day-view/");
    setDisplayBackButton(true);

    navigate(`/staff/attendance/create/`);
  };

  /* ----------------------------------------------- */
  /* ------- ADD NEW ATTENDANCE BUTTON - JSX ------- */
  /* ----------------------------------------------- */

  return (
    <button
      className="add-new-attendance-button"
      onClick={handleClicksToAddNewAttendanceButton}
    ></button>
  );
}

export default AddNewAttendanceButton;
