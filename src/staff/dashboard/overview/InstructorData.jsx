import React, { Fragment, useEffect, useState } from "react";
// CHART.JS
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./InstructorData.scss";
/* COMPONENTS */
import LoadingSpinner from "../../micro/LoadingSpinner";

function InstructorData() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [activeEvents, setActiveEvents] = useState([]);
  const [activeStudents, setActiveStudents] = useState([]);
  const [instructorRevenue, setInstructorRevenue] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */
  const fetchData = async () => {
    instance
      .get("/api/dashboard/dashboard/overview/instructor_data/")
      .then((response) => {
        if (response) {
          setActiveEvents(response.data.active_events);
          setActiveStudents(response.data.active_students);
          setInstructorRevenue(response.data.instructor_revenue);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // total classes by instructor data
  const classTotalData = {
    labels: activeEvents.map(
      (item) =>
        item.primary_instructor__userprofilesinstructors__last_name_kanji,
    ),
    datasets: [
      {
        data: activeEvents.map((item) => item.total_classes),
        backgroundColor: [
          "hsl(346, 66%, 61%)",
          "hsl(175, 90%, 38%)",
          "hsl(45, 100%, 70%)",
          "hsl(0, 0%, 42%)",
        ],
      },
    ],
  };

  // total classes by instructor chart options
  const classTotalOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxBorderWidth: 0,
          color: "#000000",
          font: {
            size: 14,
            family: "'Noto Sans JP', sans-serif",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const datasetLabel = context.dataset.label || "";
            const value = Number(context.raw || 0);
            const total = context.chart.data.datasets[0].data.reduce(
              (sum, v) => sum + Number(v || 0),
              0,
            );
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${datasetLabel} ${value}コマ (${percentage}%)`;
          },
        },
      },
    },
  };

  // total students by instructor data
  const studentTotalData = {
    labels: activeStudents.map(
      (item) =>
        item.primary_instructor__userprofilesinstructors__last_name_kanji,
    ),
    datasets: [
      {
        data: activeStudents.map((item) => item.total_students),
        backgroundColor: [
          "hsl(346, 66%, 61%)",
          "hsl(175, 90%, 38%)",
          "hsl(45, 100%, 70%)",
          "hsl(0, 0%, 42%)",
        ],
      },
    ],
  };

  // total students by instructor chart options
  const studentTotalOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxBorderWidth: 0,
          color: "#000000",
          font: {
            size: 14,
            family: "'Noto Sans JP', sans-serif",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const datasetLabel = context.dataset.label || "";
            const value = Number(context.raw || 0);
            const total = context.chart.data.datasets[0].data.reduce(
              (sum, v) => sum + Number(v || 0),
              0,
            );
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${datasetLabel} ${value}名 (${percentage}%)`;
          },
        },
      },
    },
  };

  // total revenue by instructor data
  const revenueTotalData = {
    labels: instructorRevenue.map(
      (item) =>
        item.primary_instructor__userprofilesinstructors__last_name_kanji,
    ),
    datasets: [
      {
        data: instructorRevenue.map((item) => item.total_revenue),
        backgroundColor: [
          "hsl(346, 66%, 61%)",
          "hsl(175, 90%, 38%)",
          "hsl(45, 100%, 70%)",
          "hsl(0, 0%, 42%)",
        ],
      },
    ],
  };

  // total revenue by instructor chart options
  const revenueTotalOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxBorderWidth: 0,
          color: "#000000",
          font: {
            size: 14,
            family: "'Noto Sans JP', sans-serif",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const datasetLabel = context.dataset.label || "";
            const value = Number(context.raw || 0);
            const total = context.chart.data.datasets[0].data.reduce(
              (sum, v) => sum + Number(v || 0),
              0,
            );
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${datasetLabel} ${value.toLocaleString()}円 (${percentage}%)`;
          },
        },
      },
    },
  };

  // calculate total classes for percentage calculations
  const totalClasses = activeEvents.reduce(
    (sum, item) => sum + Number(item.total_classes || 0),
    0,
  );

  // calculate total students for percentage calculations
  const totalStudents = activeStudents.reduce(
    (sum, item) => sum + Number(item.total_students || 0),
    0,
  );

  // calculate total revenue for percentage calculations
  const totalRevenue = instructorRevenue.reduce(
    (sum, item) => sum + Number(item.total_revenue || 0),
    0,
  );

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <div id="instructor-data-section">
      <div className="instructor-data-container card">
        {/* Total Classes by Instructor */}
        <div className="instructor-breakdown-container">
          <div className="instructor-breakdown-header">講師別クラス数</div>
          <div className="instructor-breakdown-chart-container">
            {!isLoading && activeEvents && (
              <Pie data={classTotalData} options={classTotalOptions} />
            )}
          </div>
          <div className="divider" />
          <div className="instructor-breakdown-data-container">
            {activeEvents.map((instructor, index) => {
              const percentage =
                totalClasses > 0
                  ? ((instructor.total_classes / totalClasses) * 100).toFixed(1)
                  : 0;
              return (
                <Fragment key={index}>
                  <div>
                    {
                      instructor.primary_instructor__userprofilesinstructors__last_name_kanji
                    }
                  </div>
                  <div className="data-number">
                    {instructor.total_classes}コマ
                  </div>
                  <div className="data-number">{percentage}%</div>
                </Fragment>
              );
            })}
          </div>
          {isLoading && <LoadingSpinner />}
        </div>
        {/* Total Students by Instructor */}
        <div className="instructor-breakdown-container">
          <div className="instructor-breakdown-header">講師別生徒数</div>
          <div className="instructor-breakdown-chart-container">
            {!isLoading && activeStudents && (
              <Pie data={studentTotalData} options={studentTotalOptions} />
            )}
          </div>
          <div className="divider" />
          <div className="instructor-breakdown-data-container">
            {activeStudents.map((instructor, index) => {
              const percentage =
                totalStudents > 0
                  ? ((instructor.total_students / totalStudents) * 100).toFixed(
                      1,
                    )
                  : 0;
              return (
                <Fragment key={index}>
                  <div>
                    {
                      instructor.primary_instructor__userprofilesinstructors__last_name_kanji
                    }
                  </div>
                  <div className="data-number">
                    {instructor.total_students}名
                  </div>
                  <div className="data-number">{percentage}%</div>
                </Fragment>
              );
            })}
          </div>
          {isLoading && <LoadingSpinner />}
        </div>
        {/* Total Revenue by Instructor */}
        <div className="instructor-breakdown-container">
          <div className="instructor-breakdown-header">講師別収益</div>
          <div className="instructor-breakdown-chart-container">
            {!isLoading && instructorRevenue && (
              <Pie data={revenueTotalData} options={revenueTotalOptions} />
            )}
          </div>
          <div className="divider" />
          <div className="instructor-breakdown-data-container">
            {instructorRevenue.map((instructor, index) => {
              const percentage =
                totalRevenue > 0
                  ? ((instructor.total_revenue / totalRevenue) * 100).toFixed(1)
                  : 0;
              return (
                <Fragment key={index}>
                  <div>
                    {
                      instructor.primary_instructor__userprofilesinstructors__last_name_kanji
                    }
                  </div>
                  <div className="data-number">
                    {instructor.total_revenue.toLocaleString()}円
                  </div>
                  <div className="data-number">{percentage}%</div>
                </Fragment>
              );
            })}
          </div>
          {isLoading && <LoadingSpinner />}
        </div>
      </div>
    </div>
  );
}

export default InstructorData;
