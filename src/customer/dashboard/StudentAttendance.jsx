import React, { useState, useEffect, Fragment } from "react";
/* AXIOS */
import instance from "../../axios/axios_authenticated";
// CSS
import "./StudentAttendance.scss";

function StudentAttendance() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <section id="student-attendance-section">
      <div className="student-attendance-container customer-card">
        <div className="customer-card-title">出欠履歴</div>
      </div>
    </section>
  );
}

export default StudentAttendance;
