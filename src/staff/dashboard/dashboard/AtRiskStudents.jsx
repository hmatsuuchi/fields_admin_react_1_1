import React, { useState, useEffect } from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* COMPONENTS */
import LoadingSpinner from "../../micro/LoadingSpinner";
/* CSS */
import "./AtRiskStudents.scss";

function AtRiskStudents() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [atRiskStudents, setAtRiskStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* fetches revenue by month data from the API */
  const fetchData = () => {
    instance
      .get("api/dashboard/dashboard/at_risk_students/")
      .then((response) => {
        if (response) {
          console.log(response.data.at_risk_students);
          setAtRiskStudents(response.data.at_risk_students);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setIsLoading(false));
  };

  /* runs on component mount */
  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <div id="at-risk-students" className="component-primary-container">
      <div className="component-title">退会確率</div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="data-container">
          {atRiskStudents && atRiskStudents.length > 0 ? (
            atRiskStudents.map((student) => (
              <div
                className={`student-container${student.churn_probability > 0.7 ? " high-risk" : ""}`}
                key={student.id}
              >
                <div className="student-name-kanji">
                  {`${student.student.last_name_kanji} ${student.student.first_name_kanji}`}
                </div>
                <div className="student-name-katakana">
                  {`${student.student.last_name_katakana} ${student.student.first_name_katakana}`}
                </div>
                <div className="student-name-romaji">
                  {`${student.student.last_name_romaji}, ${student.student.first_name_romaji}`}
                </div>
                <div className="churn-probability">
                  {(student.churn_probability * 100).toFixed(1)}%
                </div>
              </div>
            ))
          ) : (
            <div>No at-risk students found.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default AtRiskStudents;
