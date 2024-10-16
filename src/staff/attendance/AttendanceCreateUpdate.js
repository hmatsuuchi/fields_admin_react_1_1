import React, { Fragment, useEffect, useState } from "react";
/* CSS */
import "./AttendanceCreateUpdate.scss";
/* components */
import LoadingSpinner from "../micro/LoadingSpinner";

/* COMPONENTS - ATTENDANCE CREATE/UPDATE */
function AttendanceCreateUpdate({
  csrfToken,
  setShowAttendanceCreateUpdateContainer,
  eventChoices,
  activePrimaryInstructorLastNameKanji,
  studentChoices,
  eventIdSelected,
  setEventIdSelected,
  eventNameSelected,
  setEventNameSelected,
  eventCapacitySelected,
  setEventCapacitySelected,
  eventDateSelected,
  attendanceStartTimeSelected,
  setAttendanceStartTimeSelected,
  activePrimaryInstructor,
  attendanceStudentsSelected,
  setAttendanceStudentsSelected,
}) {
  /* ------------------------------------------------------ */
  /* ---------- ATTENDANCE CREATE/UPDATE - STATE ----------- */
  /* ------------------------------------------------------ */

  const [eventChoicesFiltered, setEventChoicesFiltered] = useState([]);
  const [studentsFiltered, setStudentsFiltered] = useState(studentChoices);
  const [studentSearch, setStudentSearch] = useState("");

  /* ------------------------------------------------------ */
  /* -------- ATTENDANCE CREATE/UPDATE - FUNCTIONS -------- */
  /* ------------------------------------------------------ */

  /* DEBUGGING */
  useEffect(() => {
    console.log("eventIdSelected: ", eventIdSelected);
    console.log("eventNameSelected: ", eventNameSelected);
    console.log("eventDateSelected: ", eventDateSelected);
    console.log("eventCapacitySelected: ", eventCapacitySelected);
    console.log("AttendanceStartTimeSelected: ", attendanceStartTimeSelected);
    console.log("activePrimaryInstructor: ", activePrimaryInstructor);
    console.log("attendanceStudentsSelected: ", attendanceStudentsSelected);
    console.log("--------------------");
  }, [
    eventIdSelected,
    eventNameSelected,
    eventDateSelected,
    attendanceStartTimeSelected,
    activePrimaryInstructor,
    attendanceStudentsSelected,
    eventCapacitySelected,
  ]);

  /* ATTENDANCE CREATE/UPDATE - FUNCTIONS - SET EVENT CHOICES FILTERED ON COMPONENT MOUNT */
  useEffect(() => {
    setEventChoicesFiltered(eventChoices);
  }, [eventChoices]);

  /* ATTENDANCE CREATE/UPDATE - FUNCTIONS - HANDLE CLICKS TO EXIT BUTTON */
  const handleClicksToExitButton = () => {
    setShowAttendanceCreateUpdateContainer(false);
  };

  /* ATTENDANCE CREATE/UPDATE - FUNCTIONS - DAY OF WEEK ARRAY */
  const dayOfWeekArray = [
    [6, "日"],
    [0, "月"],
    [1, "火"],
    [2, "水"],
    [3, "木"],
    [4, "金"],
    [5, "土"],
  ];

  /* ATTENDANCE CREATE/UPDATE - FUNCTIONS - DAY OF WEEK INTEGER CONVERTER */
  const dayOfWeekIntegerConverter = [2, 3, 4, 5, 6, 7, 1];

  /* ATTENDANCE CREATE/UPDATE - FUNCTIONS - REMOVE LEADING ZEROS FROM STRINGS */
  const removeLeadingZeroFromString = (str) => {
    return str.replace(/^0+/, "");
  };

  /* ATTENDANCE CREATE/UPDATE - FUNCTIONS - HANDLE CLICKS TO EVENT CHOICES */
  const handleClicksToEventChoices = (event) => {
    setEventIdSelected(parseInt(event.target.dataset.event_id));
    setEventNameSelected(event.target.dataset.event_name);
    setAttendanceStartTimeSelected(event.target.dataset.event_start_time);
    setEventCapacitySelected(parseInt(event.target.dataset.event_capacity));

    const selectedEvent = eventChoices.find((eventChoice) => {
      return eventChoice.id === parseInt(event.target.dataset.event_id);
    });

    const selectedEventEnrolledStudents = selectedEvent.students;

    setAttendanceStudentsSelected(selectedEventEnrolledStudents);
  };

  /* ATTENDANCE CREATE/UPDATE - FUNCTIONS - HANDLE EVENT SEARCH KEY UP */
  const handleEventSearchOnChange = (event) => {
    const searchInputValue = event.target.value;

    /* sets the search input value to lowercase and removes spaces */
    const searchInputValueLowerCase = searchInputValue
      .toLowerCase()
      .replace(/\s+/g, "");

    /* filters the event choices by the search input value */
    const eventChoicesFiltered = eventChoices.filter((event) => {
      return (
        /* filters by event name */
        event.event_name.toLowerCase().includes(searchInputValueLowerCase) ||
        /* filters by enrolled student names */
        event.students.some((student) => {
          const studentNameSearchString = `${student.last_name_romaji}${student.first_name_romaji}${student.last_name_romaji},${student.first_name_romaji}`;
          return studentNameSearchString
            .toLowerCase()
            .includes(searchInputValueLowerCase);
        })
      );
    });

    setEventChoicesFiltered(eventChoicesFiltered);
  };

  /* ATTENDANCE CREATE/UPDATE - FUNCTIONS - HANDLE CHANGES TO EVENT START TIME INPUT */
  const handleChangesToEventStartTimeInput = (event) => {
    setAttendanceStartTimeSelected(event.target.value);
  };

  /* ATTENDANCE CREATE/UPDATE - FUNCTIONS - FILTERS STUDENT LIST */
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

  /* ATTENDANCE CREATE/UPDATE - FUNCTIONS - HANDLE SEARCH INPUT CHANGES */
  const handleStudentSearchChange = (e) => {
    setStudentSearch(e.target.value);
  };

  /* ATTENDANCE CREATE/UPDATE - FUNCTIONS - HANDLE CLICKS TO ADD STUDENT TO ATTENDANCE */
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
  };

  /* ATTENDANCE CREATE/UPDATE - FUNCTIONS - HANDLE CLICKS TO REMOVE STUDENT FROM ATTENDANCE */
  const handleClicksToRemoveStudentFromEvent = (event) => {
    const studentToRemoveId = parseInt(event.target.dataset.id);

    setAttendanceStudentsSelected((prevStudents) => {
      return prevStudents.filter((student) => {
        return studentToRemoveId !== student.id;
      });
    });
  };

  /* -------------------------------------------- */
  /* ------ ATTENDANCE CREATE/UPDATE - JSX ------ */
  /* -------------------------------------------- */

  return (
    <Fragment>
      <div
        className="attendance-update-background"
        onClick={handleClicksToExitButton}></div>
      <div className="attendance-update-container">
        <div className="attendance-update-card">
          {/* ATTENDANCE CREATE/UPDATE - CARD - HEADER */}
          <div className="attendance-update-card-header">
            <div className="attendance-event-name">{eventNameSelected}</div>
            <div
              className="exit-button"
              onClick={handleClicksToExitButton}></div>
          </div>
          {/* ATTENDANCE CREATE/UPDATE - CARD - BODY */}
          <div
            className={`attendance-update-card-body${
              eventChoicesFiltered.length === 0 || studentChoices.length === 0
                ? " disable-clicks"
                : ""
            }`}>
            <div className="class-select-container">
              <div className="event-search-label label">授業検索</div>
              <div className="event-number-indicator label">{`${eventChoicesFiltered.length}件`}</div>
              <input
                className="event-search"
                onChange={handleEventSearchOnChange}></input>
              <div className="event-select-container">
                {eventChoicesFiltered.length !== 0 ? (
                  eventChoicesFiltered.map((event) => {
                    return (
                      <div
                        key={`event-id-${event.id}`}
                        className={`event-container${
                          eventIdSelected === event.id ? " active" : ""
                        }`}
                        onClick={handleClicksToEventChoices}
                        data-event_id={event.id}
                        data-event_name={event.event_name}
                        data-event_start_time={event.start_time}
                        data-event_primary_instructor={
                          event.primary_instructor.id
                        }
                        data-event_capacity={event.event_type.capacity}>
                        <div className="event-day-time-container">
                          {dayOfWeekArray.map((day) => {
                            return (
                              <div
                                className={`day-of-week-box${
                                  event.day_of_week === day[0] ? " active" : ""
                                }${
                                  event.day_of_week === day[0] &&
                                  event.day_of_week === 5
                                    ? " saturday"
                                    : ""
                                }${
                                  event.day_of_week === day[0] &&
                                  event.day_of_week === 6
                                    ? " sunday"
                                    : ""
                                }`}
                                key={`day-of-week-id-${day[0]}`}>
                                {day[1]}
                              </div>
                            );
                          })}
                          <div
                            className={`start-time-box${
                              event.day_of_week === 5 ? " saturday" : ""
                            }`}
                            style={{
                              gridColumn:
                                dayOfWeekIntegerConverter[event.day_of_week],
                            }}>
                            {removeLeadingZeroFromString(
                              event.start_time.slice(0, 5)
                            )}
                          </div>
                        </div>
                        <div
                          className="event-primary-instructor"
                          style={{
                            backgroundImage: `url(/img/instructors/${event.primary_instructor.userprofilesinstructors.icon_stub})`,
                          }}></div>
                        <div className="event-name">{event.event_name}</div>
                        <div className="event-type">
                          {event.event_type.name}
                        </div>

                        <div className="event-students-container">
                          {event.students
                            .sort((a, b) => a.id - b.id)
                            .map((student, index) => {
                              return (
                                <div
                                  key={`student-id-${student.id}`}
                                  className="event-student">
                                  <div
                                    className={`status-indicator${
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
                                  <div className="event-student-name-kanji-grade">
                                    {`${student.last_name_kanji} ${student.first_name_kanji} (${student.grade_verbose}${student.id})`}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <LoadingSpinner />
                )}
              </div>
            </div>
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
                  {studentsFiltered.length !== 0 ? (
                    studentsFiltered.map((student) => {
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
                          data-first_name_katakana={student.first_name_katakana}
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
                            {student.last_name_kanji && student.last_name_kanji}
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
                  ) : (
                    <LoadingSpinner />
                  )}
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
          {/* ATTENDANCE CREATE/UPDATE - CARD - FOOTER */}
          <div
            className={`attendance-update-card-footer${
              eventChoicesFiltered.length === 0 || studentChoices.length === 0
                ? " disable-clicks"
                : ""
            }`}>
            <button className="delete-attendance-button" />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default AttendanceCreateUpdate;
