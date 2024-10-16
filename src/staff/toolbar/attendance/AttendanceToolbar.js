import React from "react";
/* Axios */
import instance from "../../axios/axios_authenticated";
// CSS
import "./AttendanceToolbar.scss";
// COMPONENTS
import AddNewAttendanceButton from "../../micro/attendance/AddNewAttendanceButton";
import VerticalDividerThin from "../../micro/attendance/VerticalDividerThin";

function AttendanceToolbar({
  csrfToken,
  disableToolbarButtons,
  activePrimaryInstructor,
  setActivePrimaryInstructor,
  primaryInstructorChoices,
  attendanceDateDisplay,
  attendanceDate,
  setAttendanceDate,
  setShowAttendanceCreateUpdateContainer,
}) {
  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* UPDATE USER PREFERENCES */
  const updateUserPreferences = async (userPreferencesArray) => {
    try {
      await instance
        .put(
          "api/attendance/attendance/user_preferences/",
          userPreferencesArray,
          {
            headers: {
              "X-CSRFToken": csrfToken,
            },
          }
        )
        .then((response) => {
          if (response) {
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  const handleClicksToInstructorButtons = (e) => {
    const instructorId = parseInt(e.target.dataset.instructor_id);
    const instructor = primaryInstructorChoices.find(
      (element) => element.id === instructorId
    );
    setActivePrimaryInstructor(instructor);

    setAttendanceDate(attendanceDateDisplay);

    /* UPDATE USER PREFERENCES */
    updateUserPreferences({
      pref_attendance_selected_instructor: instructorId,
      pref_attendance_selected_date: attendanceDateDisplay,
    });
  };

  /* ----------------------------------------- */
  /* ------------------ JSX ------------------ */
  /* ----------------------------------------- */

  return (
    <div
      id="attendance-toolbar"
      className={disableToolbarButtons ? "disable-toolbar-buttons" : ""}>
      {activePrimaryInstructor ? (
        <div className="instructor-select-container">
          {primaryInstructorChoices.map((instructor) => {
            return (
              <div
                key={instructor.id}
                className={`instructor-button${
                  activePrimaryInstructor.id === instructor.id ? " active" : ""
                }`}
                data-instructor_id={instructor.id}
                style={{
                  backgroundImage: `url(/img/instructors/${instructor.userprofilesinstructors.icon_stub})`,
                }}
                onClick={handleClicksToInstructorButtons}></div>
            );
          })}
        </div>
      ) : null}
      <VerticalDividerThin />
      <AddNewAttendanceButton
        setShowAttendanceCreateUpdateContainer={
          setShowAttendanceCreateUpdateContainer
        }
        activePrimaryInstructor={activePrimaryInstructor}
        attendanceDate={attendanceDate}
      />
    </div>
  );
}

export default AttendanceToolbar;
