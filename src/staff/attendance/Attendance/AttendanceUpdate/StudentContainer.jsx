import React, { useState, useEffect } from "react";
/* AXIOS */
import instance from "../../../../axios/axios_authenticated";
/* CSS */
import "./StudentContainer.scss";
/* COMPONENTS */
import LoadingSpinner from "../../../micro/LoadingSpinner";

function StudentContainer({
  csrfToken,
  studentChoices,
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
  const [
    preventJumpToFirstSelectedStudent,
    setPreventJumpToFirstSelectedStudent,
  ] = useState(false);

  /* ------------------------------------------------------- */
  /* ---------------------- FUNCTIONS ---------------------- */
  /* ------------------------------------------------------- */

  /* JUMP TO FIRST SELECTED STUDENT IN LIST */
  useEffect(() => {
    if (
      studentChoices.length !== 0 &&
      attendanceStudentsSelected.length !== 0 &&
      !preventJumpToFirstSelectedStudent
    ) {
      const firstSelectedStudent = document.getElementById(
        `student-id-${attendanceStudentsSelected[0].id}`
      );
      const selectContainer = document.getElementById("select-container");

      if (firstSelectedStudent && selectContainer) {
        firstSelectedStudent.scrollIntoView();
        selectContainer.scrollTop -= 100;

        setPreventJumpToFirstSelectedStudent(true);
      }
    }
  }, [
    studentChoices,
    attendanceStudentsSelected,
    preventJumpToFirstSelectedStudent,
    setPreventJumpToFirstSelectedStudent,
  ]);

  /* FILTERS STUDENT LIST */
  useEffect(() => {
    setStudentsFiltered(
      studentChoices
        .sort((a, b) => {
          if (a.id > b.id) return -1;
          if (a.id < b.id) return 1;
          return 0;
        })
        .filter((student) => {
          return (
            (student.last_name_romaji + student.first_name_romaji)
              .toLowerCase()
              .includes(
                studentSearch.toLowerCase().replace(" ", "").replace(",", "")
              ) ||
            (student.first_name_romaji + student.last_name_romaji)
              .toLowerCase()
              .includes(
                studentSearch.toLowerCase().replace(" ", "").replace(",", "")
              ) ||
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
            status: studentToAdd.status,
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

  /* ------------------------------------------------------ */
  /* ------------------------ JSX ------------------------- */
  /* ------------------------------------------------------ */

  return (
    <div id="attendance-student-container" className="student-container">
      <div className="student-select-container">
        <div className="label">生徒検索</div>
        <div className="student-number-indicator">
          {`${studentsFiltered.length}件`}
        </div>
        <input
          className="student-search"
          value={studentSearch}
          onChange={handleStudentSearchChange}
        ></input>
        <div id="select-container">
          {studentsFiltered.length !== 0
            ? studentsFiltered.map((student) => {
                return (
                  <div
                    key={student.id}
                    id={`student-id-${student.id}`}
                    className={`student-name-container${
                      attendanceStudentsSelected.some((selectedStudent) => {
                        return selectedStudent.id === student.id;
                      })
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
                    data-first_name_katakana={student.first_name_katakana}
                    data-grade_verbose={student.grade_verbose}
                    data-status={student.status}
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
                      {student.first_name_kanji &&
                        ` ${student.first_name_kanji}`}
                      {student.grade_verbose && ` (${student.grade_verbose})`}
                    </div>
                    <div className="student-name-katakana">
                      {student.last_name_katakana && student.last_name_katakana}
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
  );
}

export default StudentContainer;
