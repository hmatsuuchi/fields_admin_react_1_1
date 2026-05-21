import React, { useEffect } from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CHART JS */
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  BarElement,
  BarController,
} from "chart.js";
/* COMPONENTS */
import LoadingSpinner from "../../micro/LoadingSpinner";
/* CSS */
import "./StudentsByGrade.scss";

function StudentsByGrade() {
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
      .get("api/dashboard/dashboard/total_active_students_by_grade/")
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
    BarElement,
    BarController,
  );

  const activeStudentDataSliced = activeStudentsData.slice(-visibleCount);

  const chartData = {
    labels: activeStudentDataSliced.map(
      (dataPoint) =>
        `${String(dataPoint.year).slice(-2)}/${String(dataPoint.month).padStart(
          2,
          "0",
        )}`, // Format as YY/MM
    ),
    datasets: [
      {
        label: "不明",
        data: activeStudentDataSliced.map((dataPoint) => dataPoint["不明"]),
        borderColor: "rgba(95, 95, 95, 0.7)", // legend outline color
        backgroundColor: "rgba(95, 95, 95, 0.7)", // legend background color
        type: "bar",
        yAxisID: "y",
        fill: false,
      },
      {
        label: "ベビー",
        data: activeStudentDataSliced.map(
          (dataPoint) =>
            dataPoint["0才"] +
            dataPoint["1才"] +
            dataPoint["2才"] +
            dataPoint["3才"],
        ),
        borderColor: "rgba(0, 184, 169, 0.7)", // legend outline color
        backgroundColor: "rgba(0, 184, 169, 0.7)", // legend background color
        type: "bar",
        yAxisID: "y",
        fill: false,
      },
      {
        label: "未就学児",
        data: activeStudentDataSliced.map(
          (dataPoint) =>
            dataPoint["年少"] + dataPoint["年中"] + dataPoint["年長"],
        ),
        borderColor: "rgba(253, 188, 0, 0.7)", // legend outline color
        backgroundColor: "rgba(253, 188, 0, 0.7)", // legend background color
        type: "bar",
        yAxisID: "y",
        fill: false,
      },
      {
        label: "小学生",
        data: activeStudentDataSliced.map(
          (dataPoint) =>
            dataPoint["小1"] +
            dataPoint["小2"] +
            dataPoint["小3"] +
            dataPoint["小4"] +
            dataPoint["小5"] +
            dataPoint["小6"],
        ),
        borderColor: "rgba(246, 65, 108, 0.7)", // legend outline color
        backgroundColor: "rgba(246, 65, 108, 0.7)", // legend background color
        type: "bar",
        yAxisID: "y",
        fill: false,
      },
      {
        label: "中学生",
        data: activeStudentDataSliced.map(
          (dataPoint) => dataPoint["中1"] + dataPoint["中2"] + dataPoint["中3"],
        ),
        borderColor: "rgba(0, 184, 169, 0.7)", // legend outline color
        backgroundColor: "rgba(0, 184, 169, 0.7)", // legend background color
        type: "bar",
        yAxisID: "y",
        fill: false,
      },
      {
        label: "高校生",
        data: activeStudentDataSliced.map(
          (dataPoint) => dataPoint["高1"] + dataPoint["高2"] + dataPoint["高3"],
        ),
        borderColor: "rgba(253, 188, 0, 0.7)", // legend outline color
        backgroundColor: "rgba(253, 188, 0, 0.7)", // legend background color
        type: "bar",
        yAxisID: "y",
        fill: false,
      },
      {
        label: "大人",
        data: activeStudentDataSliced.map((dataPoint) => dataPoint["大人"]),
        borderColor: "rgba(246, 65, 108, 0.7)", // legend outline color
        backgroundColor: "rgba(246, 65, 108, 0.7)", // legend background color
        type: "bar",
        yAxisID: "y",
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
            size: 12,
            family: "'Noto Sans JP', sans-serif",
          },
          boxWidth: 26,
          boxHeight: 13,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const dataIndex = context.dataIndex;
            const total = context.chart.data.datasets.reduce(
              (sum, dataset) => sum + (dataset.data[dataIndex] || 0),
              0,
            );
            const value = context.parsed.y;
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : 0;

            let label =
              context.datasetIndex === 0
                ? `不明:  ${value}名 / ${percentage}%`
                : context.datasetIndex === 1
                  ? `ベビー:  ${value}名 / ${percentage}%`
                  : context.datasetIndex === 2
                    ? `未就学児:  ${value}名 / ${percentage}%`
                    : context.datasetIndex === 3
                      ? `小学生:  ${value}名 / ${percentage}%`
                      : context.datasetIndex === 4
                        ? `中学生:  ${value}名 / ${percentage}%`
                        : context.datasetIndex === 5
                          ? `高校生:  ${value}名 / ${percentage}%`
                          : context.datasetIndex === 6
                            ? `大人:  ${value}名 / ${percentage}%`
                            : null;
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: "#000000",
          font: {
            family: "'Noto Sans JP', sans-serif",
            size: 12,
          },
        },
      },
      y: {
        stacked: true,
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
      id="students-by-grade"
      className="component-primary-container"
      onClick={() => fetchData()}
    >
      <div className="component-title">学年別生徒数</div>
      {activeStudentsData.length > 0 ? (
        <div className="students-by-grade-data-container">
          <Bar data={chartData} options={chartOptions} />
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}

export default StudentsByGrade;
