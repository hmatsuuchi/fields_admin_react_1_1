import React, { Fragment, useEffect, useState } from "react";
/* Axios */
import instance from "../axios/axios_authenticated";
/* CSS */
import "./AttendanceCreate.scss";
/* COMPONENTS */
import AttendanceCreateToolbar from "../toolbar/attendance/AttendanceCreateToolbar";
import ClassSelectContainer from "./Attendance/AttendanceCreate/ClassSelectContainer";
import LoadingSpinner from "../micro/LoadingSpinner";

function AttendanceCreate({ csrfToken }) {
  /* ----------------------------------------------------- */
  /* ----------------------- STATE ----------------------- */
  /* ----------------------------------------------------- */

  const [disableToolbarButtons] = useState(false);
  const [eventNameSelected, setEventNameSelected] = useState("");
  const [attendanceStartTimeSelected, setAttendanceStartTimeSelected] =
    useState("");
  const [attendanceStudentsSelected, setAttendanceStudentsSelected] = useState(
    []
  );
  const [primaryInstructorChoices, setPrimaryInstructorChoices] = useState([]);
  const [activePrimaryInstructor, setActivePrimaryInstructor] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(null);

  /* ----------------------------------------------------- */
  /* --------------------- FUNCTIONS --------------------- */
  /* ----------------------------------------------------- */

  /* DEBUGGING */
  useEffect(() => {
    console.log(`eventNameSelected: ${eventNameSelected}`);
    console.log(`attendanceDate: ${attendanceDate}`);
    console.log(`attendanceStartTimeSelected: ${attendanceStartTimeSelected}`);
    console.log(`activePrimaryInstructor: `);
    console.log(activePrimaryInstructor);
    console.log(`attendanceStudentsSelected: `);
    console.log(attendanceStudentsSelected);
    console.log("-------------------------------------------------");
  }, [
    eventNameSelected,
    attendanceStartTimeSelected,
    attendanceStudentsSelected,
    primaryInstructorChoices,
    activePrimaryInstructor,
    attendanceDate,
  ]);

  /* FETCH PRIMARY INSTRUCTOR CHOICES */
  useEffect(() => {
    const fetchPrimaryInstructorChoices = async () => {
      try {
        await instance
          .get("api/attendance/attendance/instructor_choices/")
          .then((response) => {
            if (response) {
              /* primary instructor choices */
              setPrimaryInstructorChoices(
                response.data.primary_instructor_choices
              );
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    /* drives code */
    fetchPrimaryInstructorChoices();
  }, []);

  /* FETCH USER PREFERENCES */
  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        await instance
          .get("api/attendance/attendance/user_preferences/")
          .then((response) => {
            if (response) {
              /* get instructor from user preferences */
              const instructorId =
                response.data.user_preferences
                  .pref_attendance_selected_instructor;
              /* find instructor */
              const instructor = primaryInstructorChoices.find(
                (item) => item.id === instructorId
              );
              /* set active primary instructor */
              setActivePrimaryInstructor(instructor);

              /* get selected date */
              const selectedDate =
                response.data.user_preferences.pref_attendance_selected_date;
              /* set selected date */
              if (selectedDate) {
                setAttendanceDate(selectedDate);
              }
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    /* drives code */
    if (primaryInstructorChoices.length > 0) {
      fetchUserPreferences();
    }
  }, [primaryInstructorChoices]);

  const handleChangesToAttendanceStartTime = (event) => {
    setAttendanceStartTimeSelected(event.target.value);
  };

  /* ----------------------------------------------------- */
  /* ------------------------ JSX ------------------------ */
  /* ----------------------------------------------------- */

  return (
    <Fragment>
      {primaryInstructorChoices && activePrimaryInstructor ? (
        <section id="attendance-create-section">
          {/* TEXT DESCRIPTORS */}
          <div id="display-descriptors-container">
            <ul>
              <li>新しい出欠表を作成しています</li>
            </ul>
          </div>
          {/* FORM */}
          <div className="attendance-create-card-container">
            <div className="attendance-create-card">
              <div className="attendance-header-container">
                <div className="attendance-name-text">{eventNameSelected}</div>
              </div>
              <div className="attendance-body-container">
                <div className="section-header">授業選択</div>
                <ClassSelectContainer
                  setEventNameSelected={setEventNameSelected}
                  setAttendanceStartTimeSelected={
                    setAttendanceStartTimeSelected
                  }
                  setAttendanceStudentsSelected={setAttendanceStudentsSelected}
                />
                <div className="section-header">出欠表情報</div>

                <label>日付</label>
                <input type="date" readOnly value={attendanceDate}></input>
                <label>時間</label>
                <input
                  type="time"
                  value={attendanceStartTimeSelected}
                  onChange={handleChangesToAttendanceStartTime}></input>
                <label>講師</label>
                <select readOnly value={activePrimaryInstructor.id}>
                  {primaryInstructorChoices.map((instructor) => (
                    <option
                      key={`instructor-id-${instructor.id}`}
                      value={instructor.id}>
                      {`${instructor.userprofilesinstructors.last_name_kanji}先生`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <LoadingSpinner />
      )}
      <AttendanceCreateToolbar disableToolbarButtons={disableToolbarButtons} />
    </Fragment>
  );
}

export default AttendanceCreate;
