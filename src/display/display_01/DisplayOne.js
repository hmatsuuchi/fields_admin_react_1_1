import React, { useState, useEffect, Fragment, useRef } from "react";
/* AXIOS */
import instance from "../../axios/axios_authenticated";
// CSS
import "./DisplayOne.scss";

function DisplayOne() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [UUIDInput, setUUIDInput] = useState("");
  const [studentData, setStudentData] = useState(null);
  const timeoutIdRef = useRef(null);

  /* ------------------------------------------- */
  /* ---------------- FUNCTIONS ---------------- */
  /* ------------------------------------------- */

  const resetScreen = () => {
    setUUIDInput("");
    setStudentData(null);
  };

  const fetchStudentData = async (event) => {
    /* prevents the page from refreshing */
    event.preventDefault();

    /* resets the screen */
    resetScreen();

    // Clear any existing resetScreen timeout before setting a new one
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    // Set a new resetScreen timeout
    timeoutIdRef.current = setTimeout(() => {
      resetScreen();
    }, 30 * 1000);

    /* card uuid */
    const params = {
      card_uuid: UUIDInput,
    };

    try {
      await instance
        .get("api/game/display/01/", { params })
        .then((response) => {
          if (response) {
            console.log(response.data);

            setStudentData(response.data);
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  /* starts script to focus on input */
  useEffect(() => {
    const focusOnInput = () => {
      console.log("Checking...");
      const inputElement = document.getElementById("uuid-input");
      if (document.activeElement !== inputElement) {
        console.log("Focusing on input");
        inputElement.focus();
      }
      console.log("-----------------------------------");
    };

    // Run focusOnInput every 3 minutes
    const intervalId = setInterval(() => {
      focusOnInput();
    }, 3 * 60 * 1000); // 3 minutes in milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  /* ------------------------------------------- */
  /* ------------------- JSX ------------------- */
  /* ------------------------------------------- */

  let moduloCount;
  if (studentData) {
    moduloCount = studentData.attendance_present_count % 10;
  }

  return (
    <div id="display-one-primary-container">
      {studentData ? (
        <Fragment>
          <div id="student-info-container" className="glass">
            <div id="student-name-grade">
              {studentData.student_last_name_romaji}
              {", "}
              {studentData.student_first_name_romaji} (
              {studentData.student_grade_verbose})
            </div>
            {/* EXPERIENCE POINTS */}
            <div className="data-title-value-container">
              <div className="data-title">Experience Points</div>
              <div className="data-value">
                {(studentData.attendance_present_count * 10).toLocaleString()}xp
              </div>
            </div>
            {/* CURRENT LEVEL */}
            <div className="data-title-value-container">
              <div className="data-title">Current Level</div>
              <div className="data-value">
                level {Math.floor(studentData.attendance_present_count / 10)}
              </div>
            </div>
            {/* UNTIL NEXT LEVEL */}
            <div className="data-title-value-container">
              <div className="data-title">Until Next Level</div>
              <div className="data-value">
                {moduloCount !== 0 ? `${10 - moduloCount} times` : "LEVEL UP!"}
              </div>
            </div>
          </div>
          <div id="student-attendance-record-container" className="glass">
            {studentData.attendance_records.map((record) => {
              return (
                <div key={`attendance-record-${record.id}`}>
                  {record.id} - {record.status} - {record.attendance[0].date}
                </div>
              );
            })}
          </div>
        </Fragment>
      ) : null}

      {/* UUID INPUT FORM */}
      <form id="uuid-form" onSubmit={fetchStudentData}>
        <input
          id="uuid-input"
          className="glass"
          value={UUIDInput}
          onChange={(e) => setUUIDInput(e.target.value)}
          autoComplete="off"
        ></input>
      </form>

      {/* BACKGROUND */}
      <div id="background-gradient-container">
        <div id="background-gradient"></div>
        <div id="background-gradient-mask"></div>
      </div>
    </div>
  );
}

export default DisplayOne;
