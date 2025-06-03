import React, { useEffect } from "react";

/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./StudentChurn.scss";

function StudentChurn() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [churnData, setChurnData] = React.useState([]);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  const fetchData = () => {
    instance
      .get("api/dashboard/dashboard/student_churn/")
      .then((response) => {
        /* set churn data */
        setChurnData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    /* Fetch data on component mount */
    fetchData();
  }, []);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <div id="student-churn" className="component-primary-container">
      <div className="component-title">
        CHURN (raw data, descending, scrollable, wip)
      </div>
      <div className="student-churn-data-container">
        {churnData.length > 0
          ? churnData.map((dataPoint) => {
              return (
                <div key={`data-point-${dataPoint.year}-${dataPoint.month}`}>
                  {dataPoint.year}/{dataPoint.month} [ 入:{" "}
                  {dataPoint.starting_students_count}, 退:{" "}
                  {dataPoint.ending_students_count}, 差:{" "}
                  {dataPoint.starting_students_count -
                    dataPoint.ending_students_count}{" "}
                  ]
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}

export default StudentChurn;
