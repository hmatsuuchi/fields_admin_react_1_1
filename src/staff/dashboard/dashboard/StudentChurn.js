import React, { useEffect } from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CHART JS */
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
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
import "./StudentChurn.scss";

function StudentChurn() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [churnData, setChurnData] = React.useState([]);
  const [visibleCount, setVisibleCount] = React.useState(12); // Default to 12 items

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* Fetch data from the API */
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

  /* runs on component mount */
  useEffect(() => {
    /* Fetch data on component mount */
    fetchData();
  }, []);

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
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    LineController,
  );

  const churnDataSliced = churnData.slice(-visibleCount);

  const chartData = {
    labels: churnDataSliced.map(
      (dataPoint) =>
        `${String(dataPoint.year).slice(-2)}/${String(dataPoint.month).padStart(
          2,
          "0",
        )}`, // Format as YY/MM
    ),
    datasets: [
      {
        label: "純増減",
        data: churnDataSliced.map(
          (dataPoint) =>
            dataPoint.starting_students_count - dataPoint.ending_students_count,
        ),
        borderColor: "#ffde7d", // legend outline color
        backgroundColor: "#ffde7d", // legend background color
        type: "line",
        yAxisID: "y",
        pointRadius: 3,
        borderWidth: 2,
        pointBackgroundColor: "#ffcb31", // dot outline color
        pointBorderColor: "#ffcb31", // dot background color
        fill: false,
      },
      {
        label: "入学人数",
        data: churnDataSliced.map(
          (dataPoint) => dataPoint.starting_students_count,
        ),
        backgroundColor: "rgba(0, 184, 169, 0.7)",
      },
      {
        label: "退学人数",
        data: churnDataSliced.map(
          (dataPoint) => -dataPoint.ending_students_count,
        ),
        backgroundColor: "rgba(246, 65, 108, 0.7)",
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
            const sign = context.parsed.y > 0 ? "+" : "";
            let label =
              context.datasetIndex === 0
                ? `純増減:  ${sign}${context.parsed.y}名`
                : context.datasetIndex === 1
                  ? `入学人数: ${Math.abs(context.parsed.y)}名`
                  : `退学人数: ${Math.abs(context.parsed.y)}名`;
            return label;
          },
          afterBody: function (context) {
            // context[0].dataIndex gives the index of the hovered data point
            const idx = context[0].dataIndex;
            const dataPoint = churnDataSliced[idx];

            // Determine which dataset is hovered: 0 = starting, 1 = ending
            const datasetIndex = context[0].datasetIndex;

            let names = [];

            if (datasetIndex === 1 && dataPoint.starting_students_list) {
              names = dataPoint.starting_students_list.map(
                (student) =>
                  `+ ${student.last_name_romaji}, ${student.first_name_romaji}`,
              );
            } else if (datasetIndex === 2 && dataPoint.ending_students_list) {
              names = dataPoint.ending_students_list.map(
                (student) =>
                  `- ${student.last_name_romaji}, ${student.first_name_romaji}`,
              );
            }

            if (names.length > 0) {
              return [...names];
            }
            return [];
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
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <div id="student-churn" className="component-primary-container">
      <div className="component-title">学生流失率</div>
      {churnData.length > 0 ? (
        <div className="student-churn-data-container">
          <Bar data={chartData} options={chartOptions} />
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}

export default StudentChurn;
