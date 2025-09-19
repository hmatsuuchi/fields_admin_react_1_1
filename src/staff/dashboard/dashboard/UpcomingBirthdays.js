import React, { useEffect } from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./UpcomingBirthdays.scss";

function UpcomingBirthdays() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* fetch list of students with upcoming birthdays */
  const fetchData = React.useCallback(() => {
    instance
      .get("api/dashboard/dashboard/upcoming_birthdays/")
      .then((response) => {
        if (response) {
          console.log(response.data);
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
    <div id="upcoming-birthdays" className="component-primary-container">
      <div className="component-title">UPCOMING BIRTHDAYS (WIP)</div>
      <div className="upcoming-birthdays-container" onClick={fetchData}></div>
    </div>
  );
}

export default UpcomingBirthdays;
