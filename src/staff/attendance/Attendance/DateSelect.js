import React, { useState } from "react";
/* Axios */
import instance from "../../axios/axios_authenticated";
/* CSS */
import "./DateSelect.scss";

function DateSelect({
  csrfToken,
  disableDateNavigationButtons,
  attendanceDateDisplay,
  showDateSearchButton,
  setAttendanceDate,
  setAttendanceDateDisplay,
  setShowDateSearchButton,
  showDataLoadError,
  setShowDataLoadError,
  setShowAttendanceContainer,
  setAttendances,
  getDateToday,
  attendanceDate,
  fetchAttendanceDataForDate,
}) {
  /* ----------------------------------------------- */
  /* -------------------- STATE -------------------- */
  /* ----------------------------------------------- */

  /* GET DAY OF WEEK TEXT */
  const getDayOfWeekText = (date) => {
    const dayOfWeek = new Date(date).getDay();
    const daysOfWeek = {
      0: "日曜日",
      1: "月曜日",
      2: "火曜日",
      3: "水曜日",
      4: "木曜日",
      5: "金曜日",
      6: "土曜日",
    };
    return daysOfWeek[dayOfWeek] || "";
  };

  const [dayOfWeekText, setDayOfWeekText] = useState(
    getDayOfWeekText(getDateToday())
  );

  /* ---------------------------------------------- */
  /* -----------------  FUNCTIONS ----------------- */
  /* ---------------------------------------------- */

  /* UPDATE USER PREFERENCES */
  const updateUserPreferences = async (userPreferencesArray) => {
    try {
      await instance
        .put(
          "api/attendance/attendance/user_preferences/",
          userPreferencesArray,
          {
            headers: {
              "X-CSRFToken": csrfToken,
            },
          }
        )
        .then((response) => {
          if (response) {
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  /* HANDLE CLICKS TO DATE ARROW PREVIOUS */
  const handleClicksToDateArrowPrevious = () => {
    const updateDateValues = (date) => {
      setAttendanceDate(date.toISOString().split("T")[0]);
      setAttendanceDateDisplay(date.toISOString().split("T")[0]);
      setDayOfWeekText(getDayOfWeekText(date));
      setShowDateSearchButton(false);
    };

    try {
      const date = new Date(attendanceDateDisplay);
      date.setDate(date.getDate() - 1);

      /* update user preferences */
      updateUserPreferences({
        pref_attendance_selected_date: date.toISOString().split("T")[0],
      });

      updateDateValues(date);
    } catch (e) {
      console.error(e);
      const date = new Date();

      updateDateValues(date);
    }
  };

  /* HANDLE DATE INPUT CHANGE */
  const handleDateInputChange = (event) => {
    /* hides attendance container */
    setShowAttendanceContainer(false);

    /* hides data load error */
    showDataLoadError && setShowDataLoadError(false);

    /* sets date display */
    setAttendanceDateDisplay(event.target.value);

    /* clears existing attendance records */
    setAttendances([]);

    /* changes day of week text */
    setDayOfWeekText(getDayOfWeekText(event.target.value));

    /* shows date search button */
    setShowDateSearchButton(true);
  };

  /* HANDLE CLICKS TO DATE ARROW NEXT */
  const handleClicksToDateArrowNext = () => {
    const updateDateValues = (date) => {
      setAttendanceDate(date.toISOString().split("T")[0]);
      setAttendanceDateDisplay(date.toISOString().split("T")[0]);
      setDayOfWeekText(getDayOfWeekText(date));
      setShowDateSearchButton(false);
    };

    try {
      const date = new Date(attendanceDateDisplay);
      date.setDate(date.getDate() + 1);

      /* update user preferences */
      updateUserPreferences({
        pref_attendance_selected_date: date.toISOString().split("T")[0],
      });

      updateDateValues(date);
    } catch (e) {
      console.error(e);
      const date = new Date();

      updateDateValues(date);
    }
  };

  /* HANDLE DATE SEARCH BUTTON CLICK */
  const handleDateSearchButtonClick = () => {
    /* sets attendance date to display date if not already equal */
    if (attendanceDate !== attendanceDateDisplay) {
      setAttendanceDate(attendanceDateDisplay);

      /* update user preferences */
      updateUserPreferences({
        pref_attendance_selected_date: attendanceDateDisplay,
      });
    } else {
      fetchAttendanceDataForDate();
    }

    /* hides date search button */
    setShowDateSearchButton(false);
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return attendanceDate && attendanceDateDisplay ? (
    <div
      id="date-select-container"
      className={disableDateNavigationButtons ? "disable-clicks" : ""}>
      <div
        className="date-arrow previous"
        onClick={handleClicksToDateArrowPrevious}></div>
      <input
        type="date"
        value={attendanceDateDisplay}
        onChange={handleDateInputChange}></input>
      <div
        className="date-arrow next"
        onClick={handleClicksToDateArrowNext}></div>
      <div className="day-of-week-text">{dayOfWeekText}</div>
      {showDateSearchButton ? (
        <button onClick={handleDateSearchButtonClick}>データを読み込み</button>
      ) : null}
    </div>
  ) : null;
}

export default DateSelect;
