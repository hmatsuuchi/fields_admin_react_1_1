import React, { Fragment, useEffect, useState } from "react";
/* AXIOS */
import instance from "../axios/axios_authenticated";
/* CSS */
import "./AttendanceUpdate.scss";
/* COMPONENTS */
import LoadingSpinner from "../micro/LoadingSpinner";

/* timeout id used to delay backend communcation */
let timeoutId;

function AttendanceUpdate({
  csrfToken,
  setShowAttendanceUpdateContainer,
  activePrimaryInstructorLastNameKanji,
  studentChoices,
  eventNameSelected,
  eventCapacitySelected,
  eventDateSelected,
  attendanceStartTimeSelected,
  setAttendanceStartTimeSelected,
  attendanceStudentsSelected,
  setAttendanceStudentsSelected,
  attendances,
  setAttendances,
  attendanceSelectedId,
}) {
  /* ------------------------------------------------------ */
  /* ----------------------- STATE ------------------------ */
  /* ------------------------------------------------------ */

  const [studentsFiltered, setStudentsFiltered] = useState(studentChoices);
  const [studentSearch, setStudentSearch] = useState("");

  /* ------------------------------------------------------- */
  /* ---------------------- FUNCTIONS ---------------------- */
  /* ------------------------------------------------------- */

  /* HANDLE CLICKS TO EXIT BUTTON */
  const handleClicksToExitButton = () => {
    setShowAttendanceUpdateContainer(false);
  };

  /* HANDLE CHANGES TO EVENT START TIME INPUT */
  const handleChangesToEventStartTimeInput = (event) => {
    setAttendanceStartTimeSelected(event.target.value);

    /* makes a copy of the attendance records array */
    const updatedAttendances = [...attendances];

    /* finds the attendance record to update */
    updatedAttendances.map((record) => {
      if (record.id === attendanceSelectedId) {
        return (record.start_time = event.target.value);
      }

      return record;
    });

    /* sets the updated attendances array */
    setAttendances(updatedAttendances);

    /* updates the backend with the new start time */
    const updateBackend = async () => {
      const data = {
        attendance_id: attendanceSelectedId,
        start_time: event.target.value,
      };

      try {
        await instance
          .put("api/attendance/attendance/attendance_details/", data, {
            headers: {
              "X-CSRFToken": csrfToken,
            },
          })
          .then((response) => {
            if (response) {
              console.log(response);
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    /* clears the timeout id */
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    /* sets the timeout id and makes endpoint call after timer elapsed */
    timeoutId = setTimeout(() => {
      updateBackend();
    }, 1000);
  };

  /* FILTERS STUDENT LIST */
  useEffect(() => {
    setStudentsFiltered(
      studentChoices.filter((student) => {
        return (
          student.last_name_romaji
            .toLowerCase()
            .includes(studentSearch.toLowerCase()) ||
          student.first_name_romaji
            .toLowerCase()
            .includes(studentSearch.toLowerCase()) ||
          student.last_name_kanji
            .toLowerCase()
            .includes(studentSearch.toLowerCase()) ||
          student.first_name_kanji
            .toLowerCase()
            .includes(studentSearch.toLowerCase()) ||
          student.last_name_katakana
            .toLowerCase()
            .includes(studentSearch.toLowerCase()) ||
          student.first_name_katakana
            .toLowerCase()
            .includes(studentSearch.toLowerCase())
        );
      })
    );
  }, [studentSearch, studentChoices, setStudentsFiltered]);

  /* HANDLE SEARCH INPUT CHANGES */
  const handleStudentSearchChange = (e) => {
    setStudentSearch(e.target.value);
  };

  /* HANDLE CLICKS TO ADD STUDENT TO ATTENDANCE */
  const handleClicksToAddStudentToAttendance = (event) => {
    /* adds the student id to the attendanceStudentsSelected array */
    const studentToAddId = parseInt(event.target.dataset.id);
    const studentToAdd = studentChoices.find((student) => {
      return studentToAddId === student.id;
    });

    setAttendanceStudentsSelected((prevStudents) => {
      if (!prevStudents.includes(studentToAdd)) {
        return [...prevStudents, studentToAdd];
      }
      return prevStudents;
    });

    /* make a copy of attendance array */
    const updatedAttendances = [...attendances];

    /* create a temporary id for the new attendance record */
    const tempId = Date.now();

    /* update the attendance record */
    updatedAttendances.map((record) => {
      if (record.id === attendanceSelectedId) {
        /* add new attendance record to array */
        const newAttendanceRecord = {
          id: tempId,
          student: {
            id: studentToAdd.id,
            last_name_kanji: studentToAdd.last_name_kanji,
            first_name_kanji: studentToAdd.first_name_kanji,
            last_name_katakana: studentToAdd.last_name_katakana,
            first_name_katakana: studentToAdd.first_name_katakana,
            last_name_romaji: studentToAdd.last_name_romaji,
            first_name_romaji: studentToAdd.first_name_romaji,
            grade_verbose: studentToAdd.grade_verbose,
          },
          status: 2,
        };

        /* push new attendance record to array */
        record.attendance_records.push(newAttendanceRecord);

        return record;
      }

      return record;
    });

    setAttendances(updatedAttendances);

    /* update the backend with the new attendance record and gets id, date_time_created, date_time_modified */
    const updateBackend = async () => {
      const data = {
        attendance_id: attendanceSelectedId,
        student: studentToAdd.id,
        status: 2,
      };

      try {
        await instance
          .post("api/attendance/attendance/attendance_record_details/", data, {
            headers: {
              "X-CSRFToken": csrfToken,
            },
          })
          .then((response) => {
            if (response) {
              updateAttendanceRecord(response.data);
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    /* updates attendance record with updated id, date_time_created, date_time_modified values */
    const updateAttendanceRecord = (updatedData) => {
      /* make a copy of attendance array */
      const updatedAttendances = [...attendances];

      /* get attendance to update */
      const attendanceToUpdate = updatedAttendances.find((record) => {
        return record.id === attendanceSelectedId;
      });

      /* get attendance record to update */
      const attendanceRecordToUpdate =
        attendanceToUpdate.attendance_records.find((record) => {
          return record.id === tempId;
        });

      /* update attendance record with new values */
      attendanceRecordToUpdate.id = updatedData.id;
      attendanceRecordToUpdate.date_time_created =
        updatedData.date_time_created;
      attendanceRecordToUpdate.date_time_modified =
        updatedData.date_time_modified;

      /* set updated attendance array */
      setAttendances(updatedAttendances);
    };

    /* drives code */
    updateBackend();
  };

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
        console.log(attendance.attendance_records);
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
          .put("api/attendance/attendance/attendance_record_details/", data, {
            headers: {
              "X-CSRFToken": csrfToken,
            },
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
    <Fragment>
      <div
        className="attendance-update-background"
        onClick={handleClicksToExitButton}></div>
      <div className="attendance-update-container">
        <div className="attendance-update-card">
          {/* HEADER */}
          <div className="attendance-update-card-header">
            <div className="attendance-event-name">{eventNameSelected}</div>
            <div
              className="exit-button"
              onClick={handleClicksToExitButton}></div>
          </div>
          {/* BODY */}
          <div
            className={`attendance-update-card-body${
              studentChoices.length === 0 ? " disable-clicks" : ""
            }`}>
            <div className="label-and-data instructor">
              <div className="label">講師</div>
              <input
                className="data instructor-input"
                value={`${activePrimaryInstructorLastNameKanji}先生`}
                readOnly={true}
              />
            </div>
            <div className="label-and-data date">
              <div className="label">日付</div>
              <input type="date" value={eventDateSelected} readOnly={true} />
            </div>

            <div className="label-and-data time">
              <div className="label">開始時間</div>
              <input
                className="data"
                type="time"
                value={attendanceStartTimeSelected}
                onChange={handleChangesToEventStartTimeInput}
              />
            </div>
            <div className="student-container">
              <div className="student-select-container">
                <div className="label">生徒検索</div>
                <div className="student-number-indicator">
                  {`${studentsFiltered.length}件`}
                </div>
                <input
                  className="student-search"
                  value={studentSearch}
                  onChange={handleStudentSearchChange}></input>
                <div id="select-container">
                  {studentsFiltered.length !== 0
                    ? studentsFiltered.map((student) => {
                        return (
                          <div
                            key={student.id}
                            id={`student-id-${student.id}`}
                            className={`student-name-container${
                              attendanceStudentsSelected.some(
                                (selectedStudent) => {
                                  return selectedStudent.id === student.id;
                                }
                              )
                                ? " student-selected"
                                : ""
                            }${
                              student.last_name_katakana === "" &&
                              student.first_name_katakana === ""
                                ? " no-katakana"
                                : ""
                            }${
                              student.last_name_kanji === "" &&
                              student.first_name_kanji === ""
                                ? " no-kanji"
                                : ""
                            }`}
                            onClick={handleClicksToAddStudentToAttendance}
                            data-id={student.id}
                            data-last_name_romaji={student.last_name_romaji}
                            data-first_name_romaji={student.first_name_romaji}
                            data-last_name_kanji={student.last_name_kanji}
                            data-first_name_kanji={student.first_name_kanji}
                            data-last_name_katakana={student.last_name_katakana}
                            data-first_name_katakana={
                              student.first_name_katakana
                            }
                            data-grade_verbose={student.grade_verbose}
                            data-status={student.status}>
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
                              }`}></div>
                            <div className="student-name-kanji">
                              {student.last_name_kanji &&
                                student.last_name_kanji}
                              {student.first_name_kanji &&
                                ` ${student.first_name_kanji}`}
                              {student.grade_verbose &&
                                ` (${student.grade_verbose})`}
                            </div>
                            <div className="student-name-katakana">
                              {student.last_name_katakana &&
                                student.last_name_katakana}
                              {student.first_name_katakana &&
                                ` ${student.first_name_katakana}`}
                            </div>
                            <div className="add-student-icon"></div>
                          </div>
                        );
                      })
                    : studentSearch === "" && <LoadingSpinner />}
                </div>
              </div>
            </div>
            <div className="student-enrolled-container">
              <div className="label">在籍生徒</div>
              <div
                className={`student-number-indicator${
                  attendanceStudentsSelected.length >= eventCapacitySelected
                    ? " class-over-capacity"
                    : ""
                }`}>
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
                      data-first_name_kanji={student.first_name_kanji}>
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
                        }`}></div>
                      <div className="student-name-kanji">
                        {student.last_name_kanji && student.last_name_kanji}
                        {student.first_name_kanji &&
                          ` ${student.first_name_kanji}`}
                        {student.grade_verbose && ` (${student.grade_verbose})`}
                      </div>
                      <div className="student-name-katakana">
                        {student.last_name_katakana &&
                          student.last_name_katakana}
                        {student.first_name_katakana &&
                          ` ${student.first_name_katakana}`}
                      </div>
                      <div className="remove-student-icon"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* FOOTER */}
          <div
            className={`attendance-update-card-footer${
              studentChoices.length === 0 ? " disable-clicks" : ""
            }`}>
            <button className="delete-attendance-button" />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default AttendanceUpdate;
