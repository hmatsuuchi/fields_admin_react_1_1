import React, { useState, useEffect } from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* COMPONENTS */
import LoadingSpinner from "../../micro/LoadingSpinner";
/* CSS */
import "./TotalActiveStudents.scss";

function TotalActiveStudents() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [totalActiveStudentsCount, setTotalActiveStudentsCount] = useState(0);

  const [highestActiveStudentCount, setHighestActiveStudentCount] =
    useState(null);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* Fetch active student count data from the API */
  const fetchData = () => {
    instance
      .get("api/dashboard/dashboard/total_active_students/")
      .then((response) => {
        setTotalActiveStudentsCount(response.data.total_active_students_count);
        setHighestActiveStudentCount(
          response.data.highest_active_student_count
        );
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
      <div className="component-title">TOTAL ACTIVE STUDENTS</div>
      {highestActiveStudentCount ? (
        <div className="total-active-students-data-container">
          CURRENT ACTIVE STUDENTS: {totalActiveStudentsCount}
          <br />
          HIGHEST COUNT: {highestActiveStudentCount.count}
          <br />
          HIGHTEST DATE: {highestActiveStudentCount.date.slice(0, 10)}
          <br />
          *** active students are defined as students who have two or more
          present attendance records and their most recent present attendance
          record is within the last 28 days ***
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}

export default TotalActiveStudents;
