import React from "react";
/* CSS */
import "./FloatingInstructorIcons.scss";

function FloatingInstructorIcons({ dayOfWeekArray, instructors }) {
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
    <div id="floating-instructor-container">
      {dayOfWeekArray.map((day) => {
        return (
          <div className="day-container" key={`day-container-${day[0]}`}>
            {instructors.map((instructor) => {
              return (
                <div
                  className="instructor-container"
                  key={`instructor-container-${instructor.id}`}>
                  <div
                    className="instructor-icon"
                    style={{
                      backgroundImage: `url(${
                        process.env.PUBLIC_URL +
                        "/img/instructors/" +
                        instructor.userprofilesinstructors.icon_stub
                      })`,
                    }}></div>
                  <div className="instructor-text">
                    {instructor.userprofilesinstructors.last_name_katakana}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default FloatingInstructorIcons;
