import React from "react";
/* Axios */
import instance from "../../../../axios/axios_authenticated";
/* CSS */
import "./AutoGenerateAttendanceRecords.scss";

function AutoGenerateAttendanceRecords({
  csrfToken,
  attendanceDate,
  activePrimaryInstructor,
  fetchAttendanceDataForDate,
  setDisableToolbarButtons,
  setDisableDateNavigationButtons,
  setShowLoadingSpinner,
  setAttendances,
}) {
  /* ----------------------------------------------- */
  /* -------------------- STATE -------------------- */
  /* ----------------------------------------------- */

  /* ---------------------------------------------- */
  /* -----------------  FUNCTIONS ----------------- */
  /* ---------------------------------------------- */

  const handleClicksToAutoGenerateAttendanceRecordsButton = () => {
    /* clears existing attendances */
    setAttendances([]);

    /* disable toolbar buttons */
    setDisableToolbarButtons(true);

    /* disable date navigation buttons */
    setDisableDateNavigationButtons(true);

    /* show loading spinner */
    setShowLoadingSpinner(true);

    /* Fetch attendance data for date */
    const fetchData = async () => {
      /* parameters to include in the request */
      const data = {
        date: attendanceDate,
        instructor_id: activePrimaryInstructor.id,
      };

      try {
        await instance
          .post(
            "api/attendance/attendance/auto_generate_attendance_records/",
            data,
            {
              headers: {
                "X-CSRFToken": csrfToken,
              },
            }
          )
          .then((response) => {
            if (response) {
              if (response.status === 200) {
                fetchAttendanceDataForDate();
              }
            }
          });
      } catch (e) {
        console.log(e);
      }
    };
    /* drives code */
    fetchData();
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <button
      id="auto-generate-attendance-records-button"
      onClick={handleClicksToAutoGenerateAttendanceRecordsButton}
    ></button>
  );
}

export default AutoGenerateAttendanceRecords;
