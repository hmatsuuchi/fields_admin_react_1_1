import React, { useEffect } from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./IncompleteAttendanceForAllInstructors.scss";

function IncompleteAttendanceForAllInstructors() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* fetch attendance record counts for instructor */
  const fetchData = React.useCallback(() => {
    instance
      .get("api/dashboard/dashboard/incomplete_attendance_for_all_instructors/")
      .then((response) => {
        if (response) {
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  /* runs on component mount */
  useEffect(() => {
    /* drives code */
    fetchData();
  }, [fetchData]);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <div
      id="incomplete-attendance-for-all-instructors-container"
      onClick={() => fetchData()}
    ></div>
  );
}

export default IncompleteAttendanceForAllInstructors;
