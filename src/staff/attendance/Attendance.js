import React, { Fragment, useEffect, useState } from "react";
/* Axios */
import instance from "../axios/axios_authenticated";
/* CSS */
import "./Attendance.scss";
/* Components  */
import AttendanceToolbar from "../toolbar/attendance/AttendanceToolbar";

/* COMPONENTS - ATTENDANCE */
function Attendance({ csrfToken }) {
  /* ----------- ATTENDANCE - STATE ----------- */
  const [disableToolbarButtons, setDisableToolbarButtons] = useState(true);

  /* ----------- ATTENDANCE - FUNCTIONS ----------- */

  /* ATTENDANCE - FUNCTIONS - INITIAL FETCH OF ATTENDANCE DATA FOR SPECIFIED DATE */
  useEffect(() => {
    /* Fetch attendance data for date */
    const fetchAttendanceDataForDate = async () => {
      /* parameters to include in the request */
      const params = {
        date: "2021-01-01",
      };

      try {
        await instance
          .get("api/attendance/attendance/single_date/", { params })
          .then((response) => {
            if (response) {
              console.log(response.data);
            }
          });
      } catch (e) {
        console.log(e);
      }
    };
    /* drives code */
    fetchAttendanceDataForDate();

    /* enable toolbar buttons */
    setDisableToolbarButtons(false);
  }, []);

  /* ----------- ATTENDANCE - JSX ----------- */
  return (
    <Fragment>
      <section id="attendance"></section>
      <AttendanceToolbar disableToolbarButtons={disableToolbarButtons} />
    </Fragment>
  );
}

export default Attendance;
