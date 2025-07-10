import React, { useEffect } from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./AtRiskStudents.scss";

function AtRiskStudents() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [atRiskStudents, setAtRiskStudents] = React.useState([]);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* fetch attendance record counts for instructor */
  const fetchData = React.useCallback(() => {
    instance
      .get("api/dashboard/dashboard/at_risk_students/")
      .then((response) => {
        if (response) {
          setAtRiskStudents(response.data.at_risk_students);
          console.log(response.data.at_risk_students);
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
    <div id="at-risk-students" className="component-primary-container">
      <div className="component-title">AT RISK STUDENTS (WIP)</div>
      <div className="at-risk-students-content-container">
        {atRiskStudents.map((data) => (
          <div key={`${data.id}-at-risk-data-id`}>
            {data.student.last_name_romaji}, {data.student.first_name_romaji}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AtRiskStudents;
