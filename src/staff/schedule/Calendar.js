import React, { useState, useEffect } from "react";
/* Axios */
import instance from "../axios/axios_authenticated";
/* Components  */
import CalendarToolbar from "../toolbar/schedule/CalendarToolbar";
import LoadingSpinner from "../micro/LoadingSpinner";
import DataLoadError from "../micro/DataLoadError";
/* CSS */
import "./Calendar.scss";
import { Fragment } from "react";
/* React Router DOM */
import { useNavigate } from "react-router-dom";

/* COMPONENTS - EVENT DETAILS */
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
  /* ----------- EVENT DETAILS - STATE ----------- */

  const [studentsSelectedIdArray, setStudentsSelectedIdArray] = useState([]);
  const [eventDetails, setEventDetails] = useState(null);
  const [eventInstructor, setEventInstructor] = useState({});
  /* EVENT DETAILS - STATE - REMOVE STUDENT FROM EVENT */
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
            onClick={handleClicksToCancelButton}>
            戻る
          </button>
          <button
            className="confirm-button"
            onClick={handleClicksToConfirmButton}>
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
            onClick={handleClicksToCancelButton}>
            戻る
          </button>
          <button
            className="confirm-button"
            onClick={handleClicksToConfirmButton}>
            アーカイブする
          </button>
        </div>
      </div>
    );
  }

  /* ----------- EVENT DETAILS - FUNCTIONS ----------- */

  /* EVENT DETAILS - FUNCTIONS - GET EVENT DETAILS */
  useEffect(() => {
    /* resets student search field */
    setStudentSearch("");

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
    setStudentSearch,
  ]);

  /* EVENT DETAILS - FUNCTIONS - SCROLL INTO VIEW FIRST STUDENT ENROLLED IN EVENT */
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

  /* EVENT DETAILS - FUNCTIONS - DAY OF WEEK CONVERSION */
  const dayOfWeekArray = [
    [6, "日曜日"],
    [0, "月曜日"],
    [1, "火曜日"],
    [2, "水曜日"],
    [3, "木曜日"],
    [4, "金曜日"],
    [5, "土曜日"],
  ];

  /* EVENT DETAILS - FUNCTIONS - HANDLE CLOSE EVENT DETAILS */
  function handleClicksToCloseEventDetails() {
    setEventDetailsVisible(false);
  }

  /* EVENT DETAILS - FUNCTIONS - HANDLE SEARCH INPUT CHANGES */
  const handleStudentSearchChange = (e) => {
    setStudentSearch(e.target.value);
  };

  /* EVENT DETAILS - FUNCTIONS - HANDLE ADD STUDENT TO EVENT */
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

  /* EVENT DETAILS - FUNCTIONS - HANDLE REMOVE STUDENT FROM EVENT*/
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

  /* EVENT DETAILS - FUNCTIONS - HANDLE ARCHIVE EVENT */
  const handleClicksToArchiveEvent = (e) => {
    setDisplayArchiveEventConfirmationDialog(true);
    setEventToArchive({
      id: e.target.dataset.event_id,
      eventName: e.target.dataset.event_name,
    });
  };

  /* EVENT DETAILS - FUNCTIONS - FILTERS STUDENT LIST */
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
            .includes(studentSearch.toLowerCase())
        );
      })
    );
  }, [studentSearch, studentsRaw, setStudentsFiltered]);

  /* ----------- EVENT DETAILS - JSX ----------- */
  return (
    <Fragment>
      <div
        id="close-event-details-background-overlay"
        onClick={handleClicksToCloseEventDetails}></div>
      <div id="event-details-container">
        {eventDetails && (
          <div className="event-details-card">
            <div className="event-details-card-header">
              <div className="event-details-card-header-text">
                {eventDetails.event_name}
              </div>
              <div
                className="event-details-card-header-close-button"
                onClick={handleClicksToCloseEventDetails}></div>
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
                  }`}>
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
                    ) : (
                      <LoadingSpinner />
                    )}
                  </div>
                </div>
                <div
                  className={`student-enrolled-container${
                    studentsFiltered.length === 0 ? " disable-clicks" : ""
                  }`}>
                  <div className="label">在籍生徒</div>
                  <div
                    className={`student-number-indicator${
                      eventDetails.students.length >=
                      eventDetails.event_type.capacity
                        ? " class-over-capacity"
                        : ""
                    }`}>
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
                data-event_name={eventDetails.event_name}></button>
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

/* COMPONENTS - CALENDAR */
function Calendar({
  csrfToken,
  highlightedEventId,
  setBackButtonText,
  setBackButtonLink,
}) {
  /* ----------- CALENDAR - STATE ----------- */
  const [events, setEvents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [initialJumpToNow, setInitialJumpToNow] = useState(false);
  const [displayErrorMessage, setDisplayErrorMessage] = useState(false);
  const [disableToolbarButtons, setDisableToolbarButtons] = useState(true);

  /* CALENDAR - STATE - STUDENTS FOR SELECT MENU */
  const [studentsRaw, setStudentsRaw] = useState([]);
  /* CALENDAR - STATE - FILTERED STUDENTS FROM SEARCH */
  const [studentsFiltered, setStudentsFiltered] = useState([]);
  /* CALENDAR - STATE - BACKGROUND CALENDAR */
  const [timeIncrements, setTimeIncrements] = useState([]);
  const [visibleDaysOfWeek, setVisibleDaysOfWeek] = useState([]);
  const [hourSegmentHeight, setHourSegmentHeight] = useState(0);
  /* CALENDAR - STATE - EVENT DETAILS */
  const [eventDetailsVisible, setEventDetailsVisible] = useState(false);
  const [currentlySelectedEventId, setCurrentlySelectedEventId] = useState(0);
  const [studentSearch, setStudentSearch] = useState("");

  /* ----------- CALENDAR - FUNCTIONS ----------- */

  // sets back button text and link
  useEffect(() => {
    setBackButtonText("カレンダー");
    setBackButtonLink("/staff/schedule/events/calendar/week-view/");
  }, [setBackButtonText, setBackButtonLink]);

  useEffect(() => {
    if (highlightedEventId !== "") {
      const eventElement = document.querySelector(
        `[data-event_id="${highlightedEventId}"]`
      );

      if (eventElement) {
        setTimeout(() => {
          eventElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 500);
      }
    }
  }, [highlightedEventId, timeIncrements]);

  /* CALENDAR - FUNCTIONS - DAY OF WEEK CONVERSTION (FULL DAY) */
  const dayOfWeekArray = [
    [6, "日曜日"],
    [0, "月曜日"],
    [1, "火曜日"],
    [2, "水曜日"],
    [3, "木曜日"],
    [4, "金曜日"],
    [5, "土曜日"],
  ];

  /* CALENDAR - FUNCTIONS - DAY OF WEEK CONVERSTION (STARTING CHARACTER) */
  const dayOfWeekSingleKanji = {
    6: "日",
    0: "月",
    1: "火",
    2: "水",
    3: "木",
    4: "金",
    5: "土",
  };

  /* CALENDAR - FUNCTIONS - JUMP TO CURRENT DAY OF WEEK ON CONTENT LOAD */
  useEffect(() => {
    const jumpToCurrentDayOfWeek = () => {
      /* gets current day of week */
      const currentDayOfWeek = new Date().getDay();

      /* adjusts current day of week for python day of week integer */
      let currentDayOfWeekAdjusted;
      if (currentDayOfWeek !== 0) {
        currentDayOfWeekAdjusted = currentDayOfWeek - 1;
      } else {
        currentDayOfWeekAdjusted = 6;
      }

      /* get day of week container */
      const dayOfWeekContainer = document.querySelector(
        `#day-of-week-container-${currentDayOfWeekAdjusted}`
      );

      dayOfWeekContainer.scrollIntoView();

      /* scrolls vertically to current time */
      const firstHourIncrement = timeIncrements[0];
      /* adds two additional increments not included in the timeIncrements array */
      const numberOfIncrements = timeIncrements.length + 2;
      /* dayOfWeekContainer has 56px padding-top */
      const dayOfWeekContainerHeight = dayOfWeekContainer.offsetHeight - 56;
      const incrementInPixels = dayOfWeekContainerHeight / numberOfIncrements;
      const currentHour = new Date().getHours();
      /* multiplies increment pixel height by number of hours elapsed since first increment time; */
      /* subtracts increment border heights; */
      /* adds additional vertical offset to place current hour closer to top of viewport */
      const verticalOffset =
        incrementInPixels * (currentHour - firstHourIncrement) -
        (currentHour - firstHourIncrement) +
        100;

      /* script runs only if current hour is after the first hour in the schedule calendar */
      if (currentHour > firstHourIncrement) {
        window.scrollBy(0, verticalOffset);
      }
    };

    /* drives code if event data loaded and only once on initial load */
    if (
      initialJumpToNow === false &&
      events.length > 0 &&
      highlightedEventId === ""
    ) {
      jumpToCurrentDayOfWeek();
      setInitialJumpToNow(true);
    }
  }, [initialJumpToNow, events.length, timeIncrements, highlightedEventId]);

  /* CALENDAR - FUNCTIONS - FETCH INITIAL DATA */
  useEffect(() => {
    // fetches event data from API
    const performInitialFetch = async () => {
      // fetches events for date range
      try {
        await instance.get("api/schedule/events").then((response) => {
          if (response) {
            setDisableToolbarButtons(false);
            setEvents(response.data.events);
            setInstructors(response.data.instructors);
            setDisplayErrorMessage(false);
          }
        });
      } catch (e) {
        setDisplayErrorMessage(true);
        console.log(e);
      }
    };

    /* drive code */
    performInitialFetch();
  }, []);

  /* CALENDAR - FUNCTIONS - RETRY FETCH INITIAL DATA */
  const retryPerformInitialFetch = async () => {
    setDisplayErrorMessage(false);
    // fetches events for date range
    try {
      await instance.get("api/schedule/events").then((response) => {
        if (response) {
          setDisableToolbarButtons(false);
          setEvents(response.data.events);
          setInstructors(response.data.instructors);
        }
      });
    } catch (e) {
      setDisplayErrorMessage(true);
      console.log(e);
    }
  };

  /* CALENDAR - FUNCTIONS - FETCH STUDENT LIST (SIMPLE) */
  useEffect(() => {
    // fetches event data from API
    const performSimplifiedStudentListFetch = async () => {
      // fetches events for date range
      try {
        await instance
          .get("api/students/profiles/select_list")
          .then((response) => {
            if (response) {
              setStudentsRaw(response.data);
              setStudentsFiltered(response.data);
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    /* drive code */
    performSimplifiedStudentListFetch();
  }, []);

  /* CALENDAR - FUNCTIONS - ADJUST HOUR SEGMENTS FOR VIEWPORT */
  useEffect(() => {
    /* calculates hour segment height based on viewport width */
    function calculateHourSegmentHeight() {
      if (window.innerWidth < 450) {
        setHourSegmentHeight(11);
      } else {
        setHourSegmentHeight(15.35);
      }
    }

    /* sets viewport width */
    const handleResize = () => {
      calculateHourSegmentHeight();
    };

    /* performs initial calculation of hour segment height */
    calculateHourSegmentHeight();

    /* adds resize event listener */
    window.addEventListener("resize", handleResize);

    /* cleanup */
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* CALENDAR - FUNCTIONS - ATTACH INTERSECTIONAL OBSERVERS */
  useEffect(() => {
    /* gets all day of week elements to observer */
    const elementsToObserve = document.querySelectorAll(
      ".day-of-week-container"
    );

    /* attaches observer instances */
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            /* checks if element is intersecting */
            if (entry.isIntersecting) {
              /* adds day of week to visible days of week */
              setVisibleDaysOfWeek((prevDays) => {
                if (
                  !prevDays.includes(parseInt(entry.target.id.split("-")[4]))
                ) {
                  return [...prevDays, parseInt(entry.target.id.split("-")[4])];
                } else {
                  return prevDays;
                }
              });
            } else {
              /* removes day of week from visible days of week */
              setVisibleDaysOfWeek((prevDays) => {
                return prevDays.filter(
                  (id) => id !== parseInt(entry.target.id.split("-")[4])
                );
              });
            }
          });
        },
        { root: null, rootMargin: "0px 0px 6000px 0px", threshold: 0.1 }
      );

      /* starts observing elements */
      elementsToObserve.forEach((element) => {
        observer.observe(element);
      });

      /* cleanup */
      return () => {
        elementsToObserve.forEach((element) => observer.unobserve(element));
      };
    } else {
      console.error("IntersectionalObserver not supported");
    }
  }, [events]);

  /* CALENDAR - FUNCTIONS - ENABLE/DISABLE PREV/NEXT BUTTONS */
  useEffect(() => {
    if (visibleDaysOfWeek.length !== 0) {
      const prevDayButton = document.getElementById("previous-day-button");
      const nextDayButton = document.getElementById("next-day-button");

      if (visibleDaysOfWeek.includes(5)) {
        nextDayButton.classList.add("disabled");
      } else if (nextDayButton.classList.contains("disabled")) {
        nextDayButton.classList.remove("disabled");
      }

      if (visibleDaysOfWeek.includes(6)) {
        prevDayButton.classList.add("disabled");
      } else if (prevDayButton.classList.contains("disabled")) {
        prevDayButton.classList.remove("disabled");
      }
    }
  }, [visibleDaysOfWeek]);

  /* CALENDAR - FUNCTIONS - GENERATE CALENDAR BACKGROUND & CHECK FOR OVERLAPPING EVENTS */
  useEffect(() => {
    function caculateCalendarBackgroundTimeIncrements(events) {
      if (events.length > 0) {
        /* gets earlist and latest event in sorted array */
        let minHour = 24;
        let maxHour = 0;

        events.forEach((event) => {
          if (event.start_time && event.start_time.length >= 2) {
            const hour = parseInt(event.start_time.slice(0, 2));
            if (hour < minHour) {
              minHour = hour;
            }
            if (hour > maxHour) {
              maxHour = hour;
            }
          }
        });

        /* creates array of time increments as integers to represent hours */
        const timeIncrementsArray = [];
        for (let i = minHour; i <= maxHour; i++) {
          timeIncrementsArray.push(i);
        }
        setTimeIncrements(timeIncrementsArray);
      } else {
        setTimeIncrements([
          9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
        ]);
      }
    }

    /* checks for overlapping events */
    function checkForOverlappingEvents(events) {
      if (events.length > 0) {
        events.forEach((event) => {
          /* set default duplicate value */
          event.duplicate = false;

          /* calculate integer values for start and end times */
          if (event.start_time && event.event_type.duration) {
            const startHour = parseInt(event.start_time.slice(0, 2)) * 60;
            const startMinute = parseInt(event.start_time.slice(3, 5));
            event.start_integer = startHour + startMinute;
            event.end_integer = event.start_integer + event.event_type.duration;
          }
        });

        /* check for overlapping events */
        events.forEach((eventToCheck) => {
          let duplicateEvents = events.filter((event) => {
            return (
              event.day_of_week === eventToCheck.day_of_week &&
              event.primary_instructor === eventToCheck.primary_instructor &&
              event.start_integer < eventToCheck.end_integer &&
              event.end_integer > eventToCheck.start_integer
            );
          });

          /* sorts duplicate events array and sets duplicate flag on last event in array */
          if (duplicateEvents.length > 1) {
            /* sorts array of duplicate events by start time */
            /* this ensures that the event that starts later is not obscured by the duplicate event */
            duplicateEvents.sort((a, b) => a.start_integer - b.start_integer);

            /* sets  flag */
            duplicateEvents[duplicateEvents.length - 1].duplicate = true;
          }
        });
      }
    }

    /* drive code */
    checkForOverlappingEvents(events);
    caculateCalendarBackgroundTimeIncrements(events);
  }, [events]);

  /* CALENDAR - FUNCTIONS - HANDLE NEXT DAY BUTTON */
  function handleNextDayButtonClick() {
    const calendarContainer = document.getElementById("calendar-container");
    const dayOfWeekContainer = calendarContainer.getElementsByClassName(
      "day-of-week-container"
    )[0];

    calendarContainer.scrollBy({
      top: 0,
      left: dayOfWeekContainer.offsetWidth,
      behavior: "smooth",
    });
  }

  /* CALENDAR - FUNCTIONS - HANDLE PREVIOUS DAY BUTTON */
  function handlePreviousDayButtonClick() {
    const calendarContainer = document.getElementById("calendar-container");
    const dayOfWeekContainer = calendarContainer.getElementsByClassName(
      "day-of-week-container"
    )[0];

    calendarContainer.scrollBy({
      top: 0,
      left: -dayOfWeekContainer.offsetWidth,
      behavior: "smooth",
    });
  }

  /* CALENDAR - FUNCTIONS - HANDLE EVENT DETAILS OPEN */
  function handleClicksToEvent(e) {
    /* get element which was clicked */
    const element = e.currentTarget;
    /* get event id */
    const eventId = element.dataset.event_id;

    /* set currently selected event id */
    setCurrentlySelectedEventId(eventId);

    /* toggle details visible state */
    setEventDetailsVisible(true);
  }

  /* CALENDAR - FUNCTIONS - HANDLE STUDENT DETAILS OPEN */
  const navigate = useNavigate();
  const handleClicksToStudentContainer = (e) => {
    const studentId = e.currentTarget.dataset.student_id;
    navigate(`/staff/students/profiles/details/${studentId}`);
  };

  /* CALENDAR - FUNCTIONS - HANDLE CLICKS TO DAY OF WEEK INDICATOR */
  function handleClicksToDayOfWeekIndicator(e) {
    const dayOfWeekInteger = e.target.id.split("-")[1];

    const dayOfWeekContainer = document.querySelector(
      `#day-of-week-container-${dayOfWeekInteger}`
    );

    dayOfWeekContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /* ----------- CALENDAR - JSX ----------- */
  return (
    <Fragment>
      {events.length > 0 ? (
        <Fragment>
          <div id="calendar-container">
            {/* Calendar Container - Day of Week */}
            {dayOfWeekArray.map((day) => {
              return (
                <div
                  id={`day-of-week-container-${day[0]}`}
                  className="day-of-week-container"
                  key={`day-of-week-${day[0]}`}>
                  {/* Calendar Container - Day of Week - Events Container */}
                  <div className="background-and-events-container">
                    {/* Calendar Container - Day of Week - Events Container - Background */}
                    <div className="background-container">
                      {timeIncrements.map((hour) => {
                        return (
                          <div
                            className="hour-increment"
                            key={`day-${day[0]}-hour-${hour}`}>
                            <div className="hour-text">{`${hour}:00 (${
                              dayOfWeekSingleKanji[day[0]]
                            })`}</div>
                          </div>
                        );
                      })}
                      <div className="hour-increment">
                        <div className="hour-text">{`${
                          timeIncrements[timeIncrements.length - 1] + 1
                        }:00 (${dayOfWeekSingleKanji[day[0]]})`}</div>
                      </div>
                      <div className="hour-increment"></div>
                    </div>
                    {/* Calendar Container - Day of Week - Events Container - Events */}
                    <div className="events-container">
                      {/* Calendar Container - Day of Week - Events Container - Events - Instructor Container */}
                      {instructors.map((instructor) => {
                        return (
                          <div
                            className="instructor-container"
                            key={`instructor-${instructor.id}`}>
                            {/* Calendar Container - Day of Week - Events Container - Events - Instructor Container - Instructor Header */}
                            <div className="instructor-header-container">
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
                                {
                                  instructor.userprofilesinstructors
                                    .last_name_katakana
                                }
                              </div>
                            </div>
                            {/* Calendar Container - Day of Week - Events Container - Events - Instructor Container - Event */}
                            {events
                              .filter((event) => {
                                return (
                                  event.primary_instructor === instructor.id &&
                                  event.day_of_week === day[0] &&
                                  event.start_time
                                );
                              })
                              .map((event) => {
                                return (
                                  <div
                                    id={`event-id-${event.id}`}
                                    className={`event${
                                      event.duplicate ? " duplicate" : ""
                                    }${
                                      highlightedEventId === event.id
                                        ? " highlighted-event"
                                        : ""
                                    }`}
                                    key={`event-${event.id}`}
                                    style={{
                                      top: `calc(${
                                        (event.start_time.slice(0, 2) -
                                          timeIncrements[0] +
                                          1) *
                                          hourSegmentHeight +
                                        event.start_time.slice(3, 5) *
                                          (hourSegmentHeight / 60)
                                      }rem + ${
                                        (event.start_time.slice(0, 2) -
                                          timeIncrements[0]) *
                                        1
                                      }px - 3px)`,
                                      height: `calc(${
                                        event.event_type.duration *
                                        (hourSegmentHeight / 60)
                                      }rem)`,
                                    }}
                                    data-event_id={event.id}
                                    data-event_start_time={event.start_time}>
                                    {/* Calendar Container - Day of Week - Events Container - Events - Instructor Container - Event - Event Header*/}
                                    <div
                                      className="event-header"
                                      data-event_id={event.id}
                                      onClick={handleClicksToEvent}>
                                      <div className="event-name">
                                        {event.event_name}
                                      </div>
                                      <div className="more-icon-container">
                                        <div className="more-icon-dot"></div>
                                        <div className="more-icon-dot"></div>
                                        <div className="more-icon-dot"></div>
                                      </div>
                                      <div className="event-start-time">
                                        {event.start_time.slice(0, 5)}
                                      </div>
                                      <div
                                        className={`student-count-container${
                                          event.students.length >=
                                          event.event_type.capacity
                                            ? " event-full"
                                            : ""
                                        }`}>
                                        <div className="student-count-text-element">
                                          {event.students.length}
                                        </div>
                                        <div className="student-count-text-element">
                                          /
                                        </div>
                                        <div className="student-count-text-element">
                                          {event.event_type.capacity}
                                        </div>
                                      </div>
                                    </div>
                                    {/* Calendar Container - Day of Week - Events Container - Events - Instructor Container - Event - Event Body */}
                                    <div
                                      className="event-body"
                                      data-event_id={event.id}
                                      onClick={handleClicksToEvent}>
                                      {event.students.map((student) => {
                                        return (
                                          <div
                                            className="student-container"
                                            key={`student-${student.id}`}
                                            data-student_id={student.id}
                                            onClick={
                                              handleClicksToStudentContainer
                                            }>
                                            <div
                                              className={`student-status${
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
                                              {`${student.last_name_kanji} ${
                                                student.first_name_kanji
                                              }${
                                                student.grade_verbose &&
                                                ` (${student.grade_verbose})`
                                              }`}
                                            </div>
                                            <div className="student-name-katakana">
                                              <span className="student-name-katakana-last">
                                                {student.last_name_katakana}
                                              </span>
                                              <span className="student-name-katakana-first">
                                                {student.first_name_katakana}
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div id="indicator-container">
            <div id="indicator-box">
              <div
                id="indicator-6"
                className={`indicator${
                  visibleDaysOfWeek.includes(6) ? " active" : ""
                }`}
                onClick={handleClicksToDayOfWeekIndicator}>
                日
              </div>
              <div
                id="indicator-0"
                className={`indicator${
                  visibleDaysOfWeek.includes(0) ? " active" : ""
                }`}
                onClick={handleClicksToDayOfWeekIndicator}>
                月
              </div>
              <div
                id="indicator-1"
                className={`indicator${
                  visibleDaysOfWeek.includes(1) ? " active" : ""
                }`}
                onClick={handleClicksToDayOfWeekIndicator}>
                火
              </div>
              <div
                id="indicator-2"
                className={`indicator${
                  visibleDaysOfWeek.includes(2) ? " active" : ""
                }`}
                onClick={handleClicksToDayOfWeekIndicator}>
                水
              </div>
              <div
                id="indicator-3"
                className={`indicator${
                  visibleDaysOfWeek.includes(3) ? " active" : ""
                }`}
                onClick={handleClicksToDayOfWeekIndicator}>
                木
              </div>
              <div
                id="indicator-4"
                className={`indicator${
                  visibleDaysOfWeek.includes(4) ? " active" : ""
                }`}
                onClick={handleClicksToDayOfWeekIndicator}>
                金
              </div>
              <div
                id="indicator-5"
                className={`indicator${
                  visibleDaysOfWeek.includes(5) ? " active" : ""
                }`}
                onClick={handleClicksToDayOfWeekIndicator}>
                土
              </div>
            </div>
          </div>
          <div id="next-previous-navigation-container">
            <button
              id="previous-day-button"
              onClick={handlePreviousDayButtonClick}></button>
            <button
              id="next-day-button"
              onClick={handleNextDayButtonClick}></button>
          </div>
        </Fragment>
      ) : displayErrorMessage ? (
        <DataLoadError
          errorMessage={"エラーが発生されました"}
          retryFunction={retryPerformInitialFetch}
        />
      ) : (
        <LoadingSpinner />
      )}
      <CalendarToolbar disableToolbarButtons={disableToolbarButtons} />
      {eventDetailsVisible && (
        <Fragment>
          <EventDetails
            events={events}
            setEvents={setEvents}
            currentlySelectedEventId={currentlySelectedEventId}
            setEventDetailsVisible={setEventDetailsVisible}
            instructors={instructors}
            studentsRaw={studentsRaw}
            studentsFiltered={studentsFiltered}
            setStudentsFiltered={setStudentsFiltered}
            studentSearch={studentSearch}
            setStudentSearch={setStudentSearch}
            csrfToken={csrfToken}
          />
        </Fragment>
      )}
    </Fragment>
  );
}

export default Calendar;
