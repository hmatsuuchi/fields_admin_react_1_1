import React, { useEffect } from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CHART JS */
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  LineController,
} from "chart.js";
/* COMPONENTS */
import LoadingSpinner from "../../micro/LoadingSpinner";
/* CSS */
import "./TotalActiveStudentsHistory.scss";

function TotalActiveStudentsHistory() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [activeStudentsData, setActiveStudentsData] = React.useState([]);
  const [visibleCount, setVisibleCount] = React.useState(25); // Default to 12 items

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* Fetch data from the API */
  const fetchData = () => {
    instance
      .get("api/dashboard/dashboard/total_active_students_historical/")
      .then((response) => {
        setActiveStudentsData(response.data);
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

  /* adjusts visible count based on window size */
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 400) {
        setVisibleCount(9);
      } else if (window.innerWidth < 500) {
        setVisibleCount(12);
      } else if (window.innerWidth < 600) {
        setVisibleCount(15);
      } else {
        setVisibleCount(25);
      }
    }

    handleResize(); // set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* chart.js setup */
  ChartJS.register(
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    LineController
  );

  const activeStudentDataSliced = activeStudentsData.slice(-visibleCount);

  const chartData = {
    labels: activeStudentDataSliced.map(
      (dataPoint) =>
        `${String(dataPoint.year).slice(-2)}/${String(dataPoint.month).padStart(
          2,
          "0"
        )}` // Format as YY/MM
    ),
    datasets: [
      {
        label: "在校生数",
        data: activeStudentDataSliced.map(
          (dataPoint) => dataPoint.active_students_count
        ),
        borderColor: "rgba(0, 184, 169, 0.7)", // legend outline color
        backgroundColor: "rgba(0, 184, 169, 0.7)", // legend background color
        type: "line",
        yAxisID: "y",
        pointRadius: 3,
        borderWidth: 2,
        pointBackgroundColor: "rgba(0, 184, 169, 0.7)", // dot outline color
        pointBorderColor: "rgba(0, 184, 169, 0.7)", // dot background color
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
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
            // Get the value and append "名"
            let label =
              context.datasetIndex === 0
                ? `在校:  ${context.parsed.y}名`
                : null;
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#000000",
          font: {
            family: "'Noto Sans JP', sans-serif",
            size: 12,
          },
        },
      },
      y: {
        ticks: {
          color: "#000000",
          font: {
            family: "'Noto Sans JP', sans-serif",
            size: 12,
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.4, // smoothness of the line
      },
    },
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <div
      id="total-active-students-history"
      className="component-primary-container"
      onClick={() => fetchData()}
    >
      <div className="component-title">在校生合計</div>
      {activeStudentsData.length > 0 ? (
        <div className="student-churn-data-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}

export default TotalActiveStudentsHistory;
