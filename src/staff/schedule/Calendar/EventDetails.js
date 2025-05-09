import React, { Fragment, useEffect, useState } from "react";
/* Axios */
import instance from "../../../axios/axios_authenticated";
/* COMPONENTS */
import LoadingSpinner from "../../micro/LoadingSpinner";
/* CSS */
import "./EventDetails.scss";

function EventDetails({
  events,
  setEvents,
  currentlySelectedEventId,
  setEventDetailsVisible,
  instructors,
  studentsRaw,
  studentsFiltered,
  setStudentsFiltered,
  studentSearch,
  setStudentSearch,
  csrfToken,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [studentsSelectedIdArray, setStudentsSelectedIdArray] = useState([]);
  const [eventDetails, setEventDetails] = useState(null);
  const [eventInstructor, setEventInstructor] = useState({});
  /* REMOVE STUDENT FROM EVENT */
  const [
    displayRemoveStudentFromEventConfirmationDialog,
    setDisplayConfirmationDialog,
  ] = useState(false);
  const [eventFromWhichStudentIsRemoved, setEventFromWhichStudentIsRemoved] =
    useState({});
  const [studentToRemove, setStudentToRemove] = useState({});
  /* EVENT DETAILS - STATE - ARCHIVE EVENT */
  const [
    displayArchiveEventConfirmationDialog,
    setDisplayArchiveEventConfirmationDialog,
  ] = useState(false);
  const [eventToArchive, setEventToArchive] = useState({});
  /* EVENT DETAILS - STATE - PREVENT JUMP TO FIRST SELECTED STUDENT FUNCTIONALITY */
  const [
    preventJumpToFirstSelectedStudent,
    setPreventJumpToFirstSelectedStudent,
  ] = useState(false);

  /* ----------- EVENT DETAILS - COMPONENTS ----------- */

  /* EVENT DETAILS - COMPONENTS - REMOVE STUDENT CONFIRMATION MODAL */
  function RemoveStudentConfirmationModal() {
    /* EVENT DETAILS - COMPONENTS - CONFIRMATION MODAL - FUNCTIONS - HANDLE CANCEL BUTTON CLICKS */
    function handleClicksToCancelButton() {
      setDisplayConfirmationDialog(false);
    }

    function handleClicksToConfirmButton() {
      setDisplayConfirmationDialog(false);

      const removeStudentFromEvent = (eventId, studentId) => {
        setEvents((prevArray) =>
          prevArray.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  students: [
                    ...event.students.filter(
                      (student) => student.id !== studentId
                    ),
                  ],
                }
              : event
          )
        );
      };
      /* drives code */
      removeStudentFromEvent(
        parseInt(eventFromWhichStudentIsRemoved.id),
        parseInt(studentToRemove.id)
      );

      /* removes student from event in backend */
      const removeStudentFromEventBackend = async () => {
        try {
          await instance
            .put(
              "api/schedule/events/remove_student_from_event/",
              {
                event_id: eventDetails.id,
                student_id: studentToRemove.id,
              },
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
      /* drives code */
      removeStudentFromEventBackend();
    }

    return (
      <div id="confirmation-modal-container">
        <div className="confirmation-modal-dialog-container">
          <div className="confirmation-modal-dialog">{`「${studentToRemove.last_name_kanji} ${studentToRemove.first_name_kanji}」を授業から削除しますか？`}</div>
          <button
            className="cancel-button"
            onClick={handleClicksToCancelButton}
          >
            戻る
          </button>
          <button
            className="confirm-button"
            onClick={handleClicksToConfirmButton}
          >
            削除する
          </button>
        </div>
      </div>
    );
  }

  /* EVENT DETAILS - COMPONENTS - ARCHIVE EVENT CONFIRMATION MODAL */
  function ArchiveEventConfirmationModal() {
    /* EVENT DETAILS - COMPONENTS - CONFIRMATION MODAL - FUNCTIONS - HANDLE CANCEL BUTTON CLICKS */
    function handleClicksToCancelButton() {
      setDisplayArchiveEventConfirmationDialog(false);
    }

    function handleClicksToConfirmButton() {
      setDisplayArchiveEventConfirmationDialog(false);
      setEventDetailsVisible(false);

      /* temporarily hides event */
      const eventToArchive = document.querySelector(
        `#event-id-${eventDetails.id}`
      );
      eventToArchive.style.display = "none";

      /* removes student from event in backend */
      const removeStudentFromEventBackend = async () => {
        try {
          await instance
            .put(
              "api/schedule/events/archive_event/",
              {
                event_id: eventDetails.id,
              },
              {
                headers: {
                  "X-CSRFToken": csrfToken,
                },
              }
            )
            .then((response) => {
              if (response) {
                /* removes event from events array */
                const archiveEvent = (eventId) => {
                  setEvents((prevArray) =>
                    prevArray.filter((event) => event.id !== eventId)
                  );
                };
                /* drives code */
                archiveEvent(parseInt(eventToArchive.id));
              }
            });
        } catch (e) {
          console.log(e);

          eventToArchive.style.display = "grid";

          /* popup system error message */
          window.alert("エラーが発生されました");
        }
      };
      /* drives code */
      removeStudentFromEventBackend();
    }

    return (
      <div id="confirmation-modal-container">
        <div className="confirmation-modal-dialog-container">
          <div className="confirmation-modal-dialog">{`「${eventToArchive.eventName}」をアーカイブしますか？`}</div>
          <button
            className="cancel-button"
            onClick={handleClicksToCancelButton}
          >
            戻る
          </button>
          <button
            className="confirm-button"
            onClick={handleClicksToConfirmButton}
          >
            アーカイブする
          </button>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* GET EVENT DETAILS */
  useEffect(() => {
    /* get event object from array of all events */
    const event = events.find(
      (event) => event.id === parseInt(currentlySelectedEventId)
    );
    setEventDetails(event);

    /* get array of student ids from event object */
    const enrolledStudentsArray = event.students.map((student) => student.id);
    setStudentsSelectedIdArray(enrolledStudentsArray);

    /* get instructor object from array of all instructors */
    const instructor = instructors.find(
      (inst) => inst.id === event.primary_instructor
    );
    setEventInstructor(instructor);
  }, [
    events,
    instructors,
    currentlySelectedEventId,
    setEventDetails,
    setEventInstructor,
  ]);

  /* SCROLL INTO VIEW FIRST STUDENT ENROLLED IN EVENT */
  useEffect(() => {
    if (
      studentsSelectedIdArray.length !== 0 &&
      !preventJumpToFirstSelectedStudent
    ) {
      /* sorts studentsSelectedIdArray */
      studentsSelectedIdArray.sort((a, b) => b - a);

      /* scroll first selected student into view */
      const selectContainer = document.getElementById("select-container");
      const studentElement = document.getElementById(
        `student-id-${studentsSelectedIdArray[0]}`
      );

      if (selectContainer && studentElement) {
        studentElement.scrollIntoView();
        selectContainer.scrollTop -= 100;
      }

      /* disables jump to first selected student */
      setPreventJumpToFirstSelectedStudent(true);
    }
  }, [studentsSelectedIdArray, preventJumpToFirstSelectedStudent]);

  /* DAY OF WEEK CONVERSION */
  const dayOfWeekArray = [
    [6, "日曜日"],
    [0, "月曜日"],
    [1, "火曜日"],
    [2, "水曜日"],
    [3, "木曜日"],
    [4, "金曜日"],
    [5, "土曜日"],
  ];

  /* HANDLE CLOSE EVENT DETAILS */
  function handleClicksToCloseEventDetails() {
    setEventDetailsVisible(false);

    /* resets student search field */
    setStudentSearch("");
  }

  /* HANDLE SEARCH INPUT CHANGES */
  const handleStudentSearchChange = (e) => {
    setStudentSearch(e.target.value);
  };

  /* HANDLE ADD STUDENT TO EVENT */
  const handleClicksToAddStudentToEvent = (e) => {
    /* adds student to event in events array */
    const appendStudentToEvent = (eventId, studentId) => {
      setEvents((prevArray) =>
        prevArray.map((event) =>
          event.id === eventId
            ? {
                ...event,
                students: [studentId, ...event.students],
              }
            : event
        )
      );
    };

    /* drives code */
    appendStudentToEvent(eventDetails.id, {
      id: parseInt(e.target.dataset.id),
      last_name_romaji: e.target.dataset.last_name_romaji,
      first_name_romaji: e.target.dataset.first_name_romaji,
      last_name_kanji: e.target.dataset.last_name_kanji,
      first_name_kanji: e.target.dataset.first_name_kanji,
      last_name_katakana: e.target.dataset.last_name_katakana,
      first_name_katakana: e.target.dataset.first_name_katakana,
      grade_verbose: e.target.dataset.grade_verbose,
      status: parseInt(e.target.dataset.status),
    });

    /* add student to event in backend */
    const addStudentToEventInBackend = async () => {
      try {
        await instance
          .put(
            "api/schedule/events/add_student_to_event/",
            {
              event_id: eventDetails.id,
              student_id: parseInt(e.target.dataset.id),
            },
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
    /* drives code */
    addStudentToEventInBackend();
  };

  /* HANDLE REMOVE STUDENT FROM EVENT*/
  const handleClicksToRemoveStudentFromEvent = (e) => {
    setDisplayConfirmationDialog(true);

    setEventFromWhichStudentIsRemoved({
      id: parseInt(eventDetails.id),
    });

    setStudentToRemove({
      id: parseInt(e.target.dataset.id),
      last_name_kanji: e.target.dataset.last_name_kanji,
      first_name_kanji: e.target.dataset.first_name_kanji,
    });
  };

  /* HANDLE ARCHIVE EVENT */
  const handleClicksToArchiveEvent = (e) => {
    setDisplayArchiveEventConfirmationDialog(true);
    setEventToArchive({
      id: e.target.dataset.event_id,
      eventName: e.target.dataset.event_name,
    });
  };

  /* FILTERS STUDENT LIST */
  useEffect(() => {
    setStudentsFiltered(
      studentsRaw.filter((student) => {
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
            .includes(studentSearch.toLowerCase()) ||
          `${student.last_name_romaji}${student.first_name_romaji}`
            .toLowerCase()
            .includes(
              studentSearch.toLowerCase().replace(" ", "").replace(",", "")
            ) ||
          `${student.first_name_romaji}${student.last_name_romaji}`
            .toLowerCase()
            .includes(
              studentSearch.toLowerCase().replace(" ", "").replace(",", "")
            )
        );
      })
    );
  }, [studentSearch, studentsRaw, setStudentsFiltered]);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <div
        id="close-event-details-background-overlay"
        onClick={handleClicksToCloseEventDetails}
      ></div>
      <div id="event-details-container">
        {eventDetails && (
          <div className="event-details-card">
            <div className="event-details-card-header">
              <div className="event-details-card-header-text">
                {eventDetails.event_name}
              </div>
              <div
                className="event-details-card-header-close-button"
                onClick={handleClicksToCloseEventDetails}
              ></div>
            </div>
            <div className="event-details-card-body">
              <div className="class-info-container">
                <div className="label">曜日:</div>
                <div className="day-of-week data">
                  {dayOfWeekArray[eventDetails.day_of_week][1]}
                </div>
                <div className="label">開始時間:</div>
                <div className="start-time data">
                  {eventDetails.start_time.slice(0, 5)}
                </div>
                <div className="label">教師:</div>
                <div className="instructor-name data">
                  {eventInstructor.userprofilesinstructors.last_name_katakana}{" "}
                  {eventInstructor.userprofilesinstructors.first_name_katakana}
                </div>
                <div className="label">授業種:</div>
                <div className="event-type-name data">
                  {eventDetails.event_type.name}
                </div>
                <div className="label">授業時間:</div>
                <div className="event-duration data">
                  {eventDetails.event_type.duration}分
                </div>
                <div className="label">人数制限:</div>
                <div className="event-capacity data">
                  {eventDetails.event_type.capacity}人
                </div>
              </div>
              <div className="student-container">
                <div
                  className={`student-select-container${
                    studentsFiltered.length === 0 ? " disable-clicks" : ""
                  }`}
                >
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
                    {studentsFiltered.length !== 0 ? (
                      studentsFiltered.map((student) => {
                        return (
                          <div
                            key={student.id}
                            id={`student-id-${student.id}`}
                            className={`student-name-container${
                              studentsSelectedIdArray.includes(student.id)
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
                            onClick={handleClicksToAddStudentToEvent}
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
                    ) : studentSearch === "" ? (
                      <LoadingSpinner />
                    ) : null}
                  </div>
                </div>
                <div
                  className={`student-enrolled-container${
                    studentsFiltered.length === 0 ? " disable-clicks" : ""
                  }`}
                >
                  <div className="label">在籍生徒</div>
                  <div
                    className={`student-number-indicator${
                      eventDetails.students.length >=
                      eventDetails.event_type.capacity
                        ? " class-over-capacity"
                        : ""
                    }`}
                  >
                    {`${eventDetails.students.length}/${eventDetails.event_type.capacity}`}
                  </div>
                  <div className="enrolled-container">
                    {eventDetails.students
                      .sort((a, b) => b.id - a.id)
                      .map((student) => {
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
                            <div className="remove-student-icon"></div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
            <div className="event-details-card-footer">
              <button
                className="archive-button"
                onClick={handleClicksToArchiveEvent}
                data-event_id={eventDetails.id}
                data-event_name={eventDetails.event_name}
              ></button>
            </div>
          </div>
        )}
      </div>

      {displayRemoveStudentFromEventConfirmationDialog && (
        <RemoveStudentConfirmationModal />
      )}

      {displayArchiveEventConfirmationDialog && (
        <ArchiveEventConfirmationModal />
      )}
    </Fragment>
  );
}

export default EventDetails;
