import React from "react";
// CSS
import "./AttendanceToolbar.scss";

function AttendanceToolbar({
  disableToolbarButtons,
  activePrimaryInstructorId,
  setActivePrimaryInstructorId,
  primaryInstructorChoices,
}) {
  /* ---------------------------------------------- */
  /* ------- ATTENDANCE TOOLBAR - FUNCTIONS ------- */
  /* ---------------------------------------------- */

  const handleClicksToInstructorButtons = (e) => {
    const instructorId = parseInt(e.target.dataset.instructor_id);
    setActivePrimaryInstructorId(instructorId);
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
    </div>
  );
}

export default AttendanceToolbar;
