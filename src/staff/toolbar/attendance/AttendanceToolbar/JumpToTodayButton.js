import React from "react";
/* CSS */
import "./JumpToTodayButton.scss";

function JumpToTodayButton({
  attendanceDate,
  setAttendanceDate,
  setAttendanceDateDisplay,
  setDayOfWeekText,
  getDayOfWeekText,
  updateUserPreferences,
  adjustDateForTimezone,
}) {
  /* ----------------------------------------------- */
  /* -------------------- STATE -------------------- */
  /* ----------------------------------------------- */

  /* ---------------------------------------------- */
  /* -----------------  FUNCTIONS ----------------- */
  /* ---------------------------------------------- */

  const handleClicksToJumpToTodayButton = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    const todayAdjusted = new Date(today.getTime() - offset);
    const todayString = todayAdjusted.toISOString().split("T")[0];

    setAttendanceDate(todayString);
    setAttendanceDateDisplay(todayString);

    setDayOfWeekText(`${getDayOfWeekText(today)}曜日`);

    /* updates user preferences */
    updateUserPreferences({
      pref_attendance_selected_date: todayString,
    });
  };

  const todayAdjustedForTimezone = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    const todayAdjusted = new Date(today.getTime() - offset);

    return todayAdjusted;
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <button id="jump-to-today-button" onClick={handleClicksToJumpToTodayButton}>
      <div>
        {getDayOfWeekText(
          todayAdjustedForTimezone().toISOString().split("T")[0]
        )}
      </div>
    </button>
  );
}

export default JumpToTodayButton;
