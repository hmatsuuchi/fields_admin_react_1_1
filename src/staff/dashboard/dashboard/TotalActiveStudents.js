import React, { useEffect } from "react";

/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./TotalActiveStudents.scss";

function TotalActiveStudents() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [totalActiveStudentsCount, setTotalActiveStudentsCount] =
    React.useState(0);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* Fetch data from the API */
  const fetchData = () => {
    instance
      .get("api/dashboard/dashboard/total_active_students/")
      .then((response) => {
        console.log(response.data);
        setTotalActiveStudentsCount(response.data.total_active_students_count);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  /* runs on component mount */
  useEffect(() => {
    /* Fetch data on component mount */
    fetchData();
  }, []);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <div id="total-active-students" className="component-primary-container">
      <div className="component-title">
        TOTAL ACTIVE STUDENTS (attendance_record count gte 2; attendance_record
        max gte 28 days ago)
      </div>
      <div className="total-active-students-data-container">
        TOTAL ACTIVE STUDENTS: {totalActiveStudentsCount}
      </div>
    </div>
  );
}

export default TotalActiveStudents;
