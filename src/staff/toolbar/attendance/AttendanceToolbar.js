import React from "react";
// CSS
import "./AttendanceToolbar.scss";
// COMPONENTS
import AddNewAttendanceButton from "../../micro/attendance/AddNewAttendanceButton";
import VerticalDividerThin from "../../micro/attendance/VerticalDividerThin";

function AttendanceToolbar({
  disableToolbarButtons,
  activePrimaryInstructorId,
  setActivePrimaryInstructorId,
  primaryInstructorChoices,
  attendanceDateDisplay,
  setAttendanceDate,
  setShowAttendanceCreateUpdateContainer,
}) {
  /* ---------------------------------------------- */
  /* ------- ATTENDANCE TOOLBAR - FUNCTIONS ------- */
  /* ---------------------------------------------- */

  const handleClicksToInstructorButtons = (e) => {
    const instructorId = parseInt(e.target.dataset.instructor_id);
    setActivePrimaryInstructorId(instructorId);

    setAttendanceDate(attendanceDateDisplay);
  };

  /* ---------------------------------------- */
  /* ------- ATTENDANCE TOOLBAR - JSX ------- */
  /* ---------------------------------------- */

  return (
    <div
      id="attendance-toolbar"
      className={disableToolbarButtons ? "disable-toolbar-buttons" : ""}>
      <div className="instructor-select-container">
        {primaryInstructorChoices.map((instructor) => {
          return (
            <div
              key={instructor.id}
              className={`instructor-button${
                activePrimaryInstructorId === instructor.id ? " active" : ""
              }`}
              data-instructor_id={instructor.id}
              style={{
                backgroundImage: `url(/img/instructors/${instructor.userprofilesinstructors.icon_stub})`,
              }}
              onClick={handleClicksToInstructorButtons}></div>
          );
        })}
      </div>
      <VerticalDividerThin />
      <AddNewAttendanceButton
        setShowAttendanceCreateUpdateContainer={
          setShowAttendanceCreateUpdateContainer
        }
      />
    </div>
  );
}

export default AttendanceToolbar;
