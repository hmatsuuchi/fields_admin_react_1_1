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
  const [recentCheckins, setRecentCheckins] = useState(null);
  const timeoutIdRef = useRef(null);

  /* ------------------------------------------- */
  /* ---------------- FUNCTIONS ---------------- */
  /* ------------------------------------------- */

  /* resets the contents of the screen */
  const resetScreen = () => {
    setUUIDInput("");
    setStudentData(null);
  };

  /* fetches student data */
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
    }, 60 * 1000);

    /* card uuid */
    const params = {
      card_uuid: UUIDInput,
    };

    try {
      await instance
        .get("api/game/display/01/get_student_data/", { params })
        .then((response) => {
          if (response) {
            /* set student data */
            setStudentData(response.data);

            console.log(response.data);
            /* fetch recent checkins */
            fetchRecentCheckins();
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  /* fetch recent checkins */
  const fetchRecentCheckins = async () => {
    try {
      await instance
        .get("api/game/display/01/get_recent_checkins/")
        .then((response) => {
          if (response) {
            /* sets new checkins */
            const newCheckins = response.data;

            setRecentCheckins((prevCheckins) => {
              /* if no previous checkins, set new checkins */
              if (!prevCheckins) return newCheckins;

              /* create a map of he new checkins by ID for quick lookup */
              const newCheckinsMap = new Map(
                newCheckins.map((checkin) => [checkin.id, checkin])
              );

              /* Filter out items not in the new response and add new ones */
              const updatedCheckins = prevCheckins
                .filter((checkin) => newCheckinsMap.has(checkin.id)) // Keep only items present in the new response
                .concat(
                  newCheckins.filter(
                    (checkin) =>
                      !prevCheckins.some((prev) => prev.id === checkin.id) // Add new items not already in prevCheckins
                  )
                );

              /* Sort the updated checkins by date_time_created */
              updatedCheckins.sort((a, b) => {
                const dateA = new Date(a.date_time_created);
                const dateB = new Date(b.date_time_created);
                return dateB - dateA; // Sort in descending order
              });

              return updatedCheckins;
            });
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  /* runs startup scrips on component mount */
  useEffect(() => {
    /* focus on UUID input field */
    const focusOnInput = () => {
      console.log("Checking...");
      const inputElement = document.getElementById("uuid-input");
      if (document.activeElement !== inputElement) {
        console.log("Focusing on input");
        inputElement.focus();
      }
      console.log("-----------------------------------");
    };

    /* run focusOnInput and reset UUID input every 5 minutes */
    const intervalId = setInterval(() => {
      focusOnInput();
      setUUIDInput("");
    }, 5 * 60 * 1000);

    /* fetches recent checkins */
    fetchRecentCheckins();

    /* cleanup interval on component unmount */
    return () => clearInterval(intervalId);
  }, []);

  /* ------------------------------------------- */
  /* ------------------- JSX ------------------- */
  /* ------------------------------------------- */

  /* calculates modulo of student present attendance record count */
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
                {moduloCount === 9
                  ? `next lesson`
                  : moduloCount !== 0
                  ? `${10 - moduloCount} lessons`
                  : "level up!"}
              </div>
            </div>
          </div>
          {/* displays record of student's previous attendance records */}
          {/* <div id="student-attendance-record-container" className="glass">
            {studentData.attendance_records.map((record) => {
              return (
                <div key={`attendance-record-${record.id}`}>
                  {record.id} - {record.status} - {record.attendance[0].date}
                </div>
              );
            })}
          </div> */}
        </Fragment>
      ) : null}

      {/* RECENT CHECKINS */}
      <div id="recent-checkins-container">
        {recentCheckins ? (
          <Fragment>
            {recentCheckins.map((checkin) => {
              return (
                <div
                  className={`checkin-container glass${
                    checkin.attendance_present_count % 10 === 0
                      ? " level-up"
                      : ""
                  }`}
                  key={`recent-checkin-${checkin.id}`}
                >
                  <div className="checkin-student-name-level">
                    {checkin.student.first_name_romaji}
                  </div>
                  <div className="checkin-xp">
                    {`${(
                      checkin.attendance_present_count * 10
                    ).toLocaleString()} xp`}
                  </div>
                  <div className="checkin-level glass">
                    {Math.floor(checkin.attendance_present_count / 10)}
                  </div>
                </div>
              );
            })}
          </Fragment>
        ) : null}
      </div>

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
