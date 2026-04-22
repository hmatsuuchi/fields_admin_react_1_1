import React, { useEffect } from "react";

/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./MonthlyRevenue.scss";
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

function MonthlyRevenue() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [monthlyRevenueData, setMonthlyRevenueData] = React.useState([]);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* fetches revenue by month data from the API */
  const fetchRevenueByMonth = () => {
    instance
      .get("api/dashboard/dashboard/overview/revenue_by_month/")
      .then((response) => {
        if (response) {
          setMonthlyRevenueData(response.data.monthly_revenue_data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  /* runs on component mount */
  useEffect(() => {
    fetchRevenueByMonth();
  }, []);

  /* chart.js setup */
  ChartJS.register(
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    LineController,
  );

  const chartData = {
    labels: monthlyRevenueData.map(
      (dataPoint) =>
        `${String(dataPoint.year).slice(-2)}/${String(dataPoint.month).padStart(
          2,
          "0",
        )}`, // Format as YY/MM
    ),
    datasets: [
      {
        label: "入金済",
        data: monthlyRevenueData.map((dataPoint) => dataPoint.paid_revenue),
        borderColor: "rgba(253, 188, 0, 0.7)", // legend outline color
        backgroundColor: "rgba(253, 188, 0, 0.7)", // legend background color
        type: "line",
        yAxisID: "y",
        pointRadius: 3,
        borderWidth: 2,
        pointBackgroundColor: "rgba(253, 188, 0, 0.7)", // dot outline color
        pointBorderColor: "rgba(253, 188, 0, 0.7)", // dot background color
        fill: false,
      },
      {
        label: "未入金",
        data: monthlyRevenueData.map((dataPoint) => dataPoint.unpaid_revenue),
        borderColor: "rgba(246, 65, 108, 0.7)", // legend outline color
        backgroundColor: "rgba(246, 65, 108, 0.7)", // legend background color
        type: "line",
        yAxisID: "y",
        pointRadius: 3,
        borderWidth: 2,
        pointBackgroundColor: "rgba(246, 65, 108, 0.7)", // dot outline color
        pointBorderColor: "rgba(246, 65, 108, 0.7)", // dot background color
        fill: false,
      },
      {
        label: "合計",
        data: monthlyRevenueData.map(
          (dataPoint) => dataPoint.unpaid_revenue + dataPoint.paid_revenue,
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
    maintainAspectRatio: true,
    aspectRatio: 1.5,
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
            const datasetLabel = context.dataset.label || "";
            const value = Number(context.parsed.y || 0).toLocaleString();
            return `${datasetLabel}: ${value}円`;
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
        type: "linear",
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
    <div id="monthly-revenue-section" onClick={fetchRevenueByMonth}>
      <div className="revenue-chart-container">
        {monthlyRevenueData.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : null}
      </div>
    </div>
  );
}

export default MonthlyRevenue;
