import React, { useEffect } from "react";

/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./MonthlyRevenue.scss";

function MonthlyRevenue() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  const analyzeAttendance = () => {
    instance
      .get("api/dashboard/dashboard/overview/revenue_by_month/")
      .then((response) => {
        if (response) {
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    analyzeAttendance();
  }, []);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return <div id="monthly-revenue-section"></div>;
}

export default MonthlyRevenue;
