import React, { useState, useEffect } from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CHART JS */
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
/* COMPONENTS */
import LoadingSpinner from "../../micro/LoadingSpinner";
/* CSS */
import "./TotalActiveStudents.scss";

function TotalActiveStudents() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [totalActiveStudentsCount, setTotalActiveStudentsCount] = useState(0);
  const [highestActiveStudentCount, setHighestActiveStudentCount] = useState(0);
  const [highestActiveStudentDate, setHighestActiveStudentDate] = useState("");
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
          response.data.highest_active_student_count.count,
        );
        setHighestActiveStudentDate(
          response.data.highest_active_student_count.date,
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

  /* doughnut chart */
  ChartJS.register(ArcElement, Tooltip, Legend);

  const data = {
    labels: ["Current", "Shortfall"],
    datasets: [
      {
        label: "Students",
        data: [
          totalActiveStudentsCount,
          Math.min(
            (highestActiveStudentCount - totalActiveStudentsCount) * 10,
            highestActiveStudentCount * 5,
          ), // exaggerates the shortfall for visual effect but limits it to a maximum of 5x the highest count
        ],
        backgroundColor: ["#00b8a9", "#ffde7d"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      tooltip: { enabled: false },
      legend: {
        display: false,
      },
    },
    hover: { mode: null }, // disables hover effects
    cutout: "70%", // makes the doughnut chart look like a ring
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <div id="total-active-students" className="component-primary-container">
      <div className="component-title">在籍生徒数</div>
      {totalActiveStudentsCount !== 0 &&
      highestActiveStudentCount !== 0 &&
      highestActiveStudentDate !== "" ? (
        <div className="total-active-students-content-container">
          <div className="data-container">
            <div className="current-count-container">
              <div
                className={`count${
                  highestActiveStudentCount - totalActiveStudentsCount !== 0
                    ? " under"
                    : ""
                }`}
              >
                {totalActiveStudentsCount}
              </div>
              <div className="label">人</div>
            </div>
            <div className="highest-count-container">
              <div className="count">{highestActiveStudentCount}</div>
              <div className="label">人</div>
            </div>
            <div className="highest-date">
              {highestActiveStudentDate.slice(0, 10)}
            </div>
          </div>
          <div className="chart-container">
            <Doughnut data={data} options={options} />
          </div>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}

export default TotalActiveStudents;
