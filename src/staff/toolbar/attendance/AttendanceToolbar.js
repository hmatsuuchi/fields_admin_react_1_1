import React from "react";
/* Axios */
import instance from "../../../axios/axios_authenticated";
// CSS
import "./AttendanceToolbar.scss";
// COMPONENTS
import AddNewAttendanceButton from "../../micro/attendance/AddNewAttendanceButton";
import VerticalDividerThin from "../../micro/attendance/VerticalDividerThin";
import JumpToTodayButton from "./AttendanceToolbar/JumpToTodayButton";
import AutoGenerateAttendanceRecords from "./AttendanceToolbar/AutoGenerateAttendanceRecords";
import ToolbarBackButton from "../../micro/attendance/ToolbarBackButton";

function AttendanceToolbar({
  csrfToken,
  disableToolbarButtons,
  setDisableToolbarButtons,
  setDisableDateNavigationButtons,
  activePrimaryInstructor,
  setActivePrimaryInstructor,
  primaryInstructorChoices,
  attendanceDate,
  setAttendanceDate,
  attendanceDateDisplay,
  setAttendanceDateDisplay,
  setShowAttendanceCreateUpdateContainer,
  setDayOfWeekText,
  getDayOfWeekText,
  fetchAttendanceDataForDate,
  setShowLoadingSpinner,
  setAttendances,
  adjustDateForTimezone,
  backButtonText,
  setBackButtonText,
  backButtonLink,
  setBackButtonLink,
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
      className={disableToolbarButtons ? "disable-toolbar-buttons" : ""}
    >
      <ToolbarBackButton
        backButtonLink={backButtonLink}
        setBackButtonLink={setBackButtonLink}
        backButtonText={backButtonText}
        setBackButtonText={setBackButtonText}
      />
      <div className="button-set-container">
        <AutoGenerateAttendanceRecords
          csrfToken={csrfToken}
          attendanceDate={attendanceDate}
          activePrimaryInstructor={activePrimaryInstructor}
          fetchAttendanceDataForDate={fetchAttendanceDataForDate}
          setDisableToolbarButtons={setDisableToolbarButtons}
          setDisableDateNavigationButtons={setDisableDateNavigationButtons}
          setShowLoadingSpinner={setShowLoadingSpinner}
          setAttendances={setAttendances}
        />
        <JumpToTodayButton
          attendanceDate={attendanceDate}
          setAttendanceDate={setAttendanceDate}
          setAttendanceDateDisplay={setAttendanceDateDisplay}
          setDayOfWeekText={setDayOfWeekText}
          getDayOfWeekText={getDayOfWeekText}
          updateUserPreferences={updateUserPreferences}
          adjustDateForTimezone={adjustDateForTimezone}
        />
        <VerticalDividerThin />
        <div className="instructor-select-container-arrow"></div>
        {activePrimaryInstructor ? (
          <div className="instructor-select-container">
            {primaryInstructorChoices.map((instructor) => {
              return (
                <div
                  key={instructor.id}
                  className={`instructor-button${
                    activePrimaryInstructor.id === instructor.id
                      ? " active"
                      : ""
                  }`}
                  data-instructor_id={instructor.id}
                  style={{
                    backgroundImage: `url(/img/instructors/${instructor.userprofilesinstructors.icon_stub})`,
                  }}
                  onClick={handleClicksToInstructorButtons}
                ></div>
              );
            })}
          </div>
        ) : null}
        <div className="instructor-select-container-arrow right-arrow"></div>
        <VerticalDividerThin />
        <AddNewAttendanceButton
          setShowAttendanceCreateUpdateContainer={
            setShowAttendanceCreateUpdateContainer
          }
          activePrimaryInstructor={activePrimaryInstructor}
          attendanceDate={attendanceDate}
        />
      </div>
    </div>
  );
}

export default AttendanceToolbar;
