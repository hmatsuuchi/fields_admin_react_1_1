import React, { useEffect } from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./IncompleteAttendanceForAllInstructors.scss";

function IncompleteAttendanceForAllInstructors() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [attendanceAll, setAttendanceAll] = React.useState([]);
  const [instructorData, setInstructorData] = React.useState([]);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* fetch attendance record counts for instructor */
  const fetchData = React.useCallback(() => {
    instance
      .get("api/dashboard/dashboard/incomplete_attendance_for_all_instructors/")
      .then((response) => {
        if (response) {
          setAttendanceAll(response.data.attendance_data);
          setInstructorData(response.data.instructor_data);
          console.log(response.data.attendance_data);
          console.log(response.data.instructor_data);
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
    <div id="incomplete-attendance-for-all-instructors-container">
      {instructorData.map((instructor) => (
        <div
          className="instructor-container"
          key={`instructor-id-${instructor.id}`}
        >
          <div className="header">
            {instructor.instructor_id} -{" "}
            {instructor.instructor__userprofilesinstructors__last_name_romaji},{" "}
            {instructor.instructor__userprofilesinstructors__first_name_romaji}
          </div>
          <div className="attendance-container">
            {attendanceAll.map((item) => {
              if (item.instructor.id === instructor.instructor_id) {
                return (
                  <div
                    className={`attendance-item${item.incomplete_count > 0 ? " incomplete" : ""}`}
                    key={`item-id-${item.id}`}
                  >
                    {`${item.date} [ ${item.incomplete_count} ]`}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default IncompleteAttendanceForAllInstructors;
