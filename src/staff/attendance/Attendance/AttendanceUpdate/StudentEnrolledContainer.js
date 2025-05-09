import React from "react";
/* AXIOS */
import instance from "../../../../axios/axios_authenticated";
/* CSS */
import "./StudentEnrolledContainer.scss";

function StudentEnrolledContainer({
  csrfToken,
  attendanceStudentsSelected,
  setAttendanceStudentsSelected,
  eventCapacitySelected,
  attendances,
  setAttendances,
  attendanceSelectedId,
}) {
  /* ------------------------------------------------------ */
  /* ----------------------- STATE ------------------------ */
  /* ------------------------------------------------------ */

  /* ------------------------------------------------------- */
  /* ---------------------- FUNCTIONS ---------------------- */
  /* ------------------------------------------------------- */

  /* HANDLE CLICKS TO REMOVE STUDENT FROM ATTENDANCE */
  const handleClicksToRemoveStudentFromEvent = (event) => {
    const studentToRemoveId = parseInt(event.target.dataset.id);

    setAttendanceStudentsSelected((prevStudents) => {
      return prevStudents.filter((student) => {
        return studentToRemoveId !== student.id;
      });
    });

    /* removes student from attendance array */
    const updatedAttendances = [...attendances];

    updatedAttendances.map((attendance) => {
      if (attendance.id === attendanceSelectedId) {
        attendance.attendance_records = attendance.attendance_records.filter(
          (attendance_record) => {
            return studentToRemoveId !== attendance_record.student.id;
          }
        );
      }

      return attendance;
    });

    setAttendances(updatedAttendances);

    /* updates the backend by deleting attendance record */
    const updateBackend = async () => {
      const data = {
        attendance_id: attendanceSelectedId,
        student_id: studentToRemoveId,
      };

      try {
        await instance
          .delete("api/attendance/attendance/attendance_record_details/", {
            headers: {
              "X-CSRFToken": csrfToken,
            },
            data: data,
          })
          .then((response) => {
            if (response) {
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    /* drives code */
    updateBackend();
  };

  /* ------------------------------------------------------ */
  /* ------------------------ JSX ------------------------- */
  /* ------------------------------------------------------ */

  return (
    <div className="student-enrolled-container">
      <div className="label">在籍生徒</div>
      <div
        className={`student-number-indicator${
          attendanceStudentsSelected.length >= eventCapacitySelected
            ? " class-over-capacity"
            : ""
        }`}
      >
        {`${attendanceStudentsSelected.length}/${eventCapacitySelected}`}
      </div>
      <div className="enrolled-container">
        {attendanceStudentsSelected.map((student) => {
          return (
            <div
              className="student-name-container"
              key={student.id}
              onClick={handleClicksToRemoveStudentFromEvent}
              data-id={student.id}
              data-last_name_kanji={student.last_name_kanji}
              data-first_name_kanji={student.first_name_kanji}
            >
              <div
                className={`student-status-indicator${
                  student.status === 1
                    ? " pre-enrolled"
                    : student.status === 2
                    ? " enrolled"
                    : student.status === 3
                    ? " short-absence"
                    : student.status === 4
                    ? " long-absence"
                    : " unknown"
                }`}
              ></div>
              <div className="student-name-kanji">
                {student.last_name_kanji && student.last_name_kanji}
                {student.first_name_kanji && ` ${student.first_name_kanji}`}
                {student.grade_verbose && ` (${student.grade_verbose})`}
              </div>
              <div className="student-name-katakana">
                {student.last_name_katakana && student.last_name_katakana}
                {student.first_name_katakana &&
                  ` ${student.first_name_katakana}`}
              </div>
              <div className="remove-student-icon"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StudentEnrolledContainer;
