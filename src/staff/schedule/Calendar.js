import React, { useState, useEffect, Fragment } from "react";
/* Axios */
import instance from "../axios/axios_authenticated";
/* COMPONENTS */
import CalendarToolbar from "../toolbar/schedule/CalendarToolbar";
import LoadingSpinner from "../micro/LoadingSpinner";
import DataLoadError from "../micro/DataLoadError";
import EventDetails from "./Calendar/EventDetails";
import FloatingInstructorIcons from "./Calendar/FloatingInstructorIcons";
/* CSS */
import "./Calendar.scss";
/* React Router DOM */
import { useNavigate } from "react-router-dom";

function Calendar({
  csrfToken,
  highlightedEventId,
  setHighlightedEventId,
  setBackButtonText,
  setBackButtonLink,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [events, setEvents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [allowJumpToNow, setAllowJumpToNow] = useState(true);
  const [displayErrorMessage, setDisplayErrorMessage] = useState(false);
  const [disableToolbarButtons, setDisableToolbarButtons] = useState(true);

  /* STUDENTS FOR SELECT MENU */
  const [studentsRaw, setStudentsRaw] = useState([]);
  /* FILTERED STUDENTS FROM SEARCH */
  const [studentsFiltered, setStudentsFiltered] = useState([]);
  /* BACKGROUND CALENDAR */
  const [timeIncrements, setTimeIncrements] = useState([]);
  const [visibleDaysOfWeek, setVisibleDaysOfWeek] = useState([]);
  const [hourSegmentHeight, setHourSegmentHeight] = useState(0);
  /* EVENT DETAILS */
  const [eventDetailsVisible, setEventDetailsVisible] = useState(false);
  const [currentlySelectedEventId, setCurrentlySelectedEventId] = useState(0);
  const [studentSearch, setStudentSearch] = useState("");

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* SETS BACK BUTTON TEXT AND LINK */
  useEffect(() => {
    setBackButtonText("カレンダー");
    setBackButtonLink("/staff/schedule/events/calendar/week-view/");
  }, [setBackButtonText, setBackButtonLink]);

  /* DAY OF WEEK CONVERSTION (FULL DAY) */
  const dayOfWeekArray = [
    [6, "日曜日"],
    [0, "月曜日"],
    [1, "火曜日"],
    [2, "水曜日"],
    [3, "木曜日"],
    [4, "金曜日"],
    [5, "土曜日"],
  ];

  /* DAY OF WEEK CONVERSTION (STARTING CHARACTER) */
  const dayOfWeekSingleKanji = {
    6: "日",
    0: "月",
    1: "火",
    2: "水",
    3: "木",
    4: "金",
    5: "土",
  };

  /* JUMP TO CURRENT DAY OF WEEK ON CONTENT LOAD */
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
        console.log(verticalOffset);
      }
    };

    const jumpToHighlightedEvent = () => {
      if (highlightedEventId !== null) {
        const eventElement = document.querySelector(
          `[data-event_id="${highlightedEventId}"]`
        );

        if (eventElement) {
          setTimeout(() => {
            eventElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }, 500);
        }
      }
    };

    /* drives code if event data loaded and only once on initial load */
    if (
      allowJumpToNow === true &&
      highlightedEventId === null &&
      events.length > 0
    ) {
      jumpToCurrentDayOfWeek();
      setAllowJumpToNow(false);
    } else if (
      allowJumpToNow === false &&
      highlightedEventId !== null &&
      events.length > 0
    ) {
      jumpToHighlightedEvent();
      setAllowJumpToNow(false);
    } else if (events.length > 0) {
      setAllowJumpToNow(false);
    }
  }, [allowJumpToNow, events, timeIncrements, highlightedEventId]);

  /* FETCH INITIAL DATA */
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

  /* RETRY FETCH INITIAL DATA */
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

  /* FETCH STUDENT LIST (SIMPLE) */
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

  /* ADJUST HOUR SEGMENTS FOR VIEWPORT */
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

  /* ATTACH INTERSECTIONAL OBSERVERS */
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

  /* ENABLE/DISABLE PREV/NEXT BUTTONS */
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

  /* GENERATE CALENDAR BACKGROUND & CHECK FOR OVERLAPPING EVENTS */
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

  /* HANDLE NEXT DAY BUTTON */
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

  /* HANDLE PREVIOUS DAY BUTTON */
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

  /* HANDLE EVENT DETAILS OPEN */
  function handleClicksToEvent(e) {
    /* get element which was clicked */
    const element = e.currentTarget;
    /* get event id */
    const eventId = element.dataset.event_id;

    /* set currently selected event id */
    setCurrentlySelectedEventId(eventId);

    /* toggle details visible state */
    setEventDetailsVisible(true);

    /* removes highlight from previously selected event */
    setHighlightedEventId(null);
  }

  /* HANDLE STUDENT DETAILS OPEN */
  const navigate = useNavigate();
  const handleClicksToStudentContainer = (e) => {
    const studentId = e.currentTarget.dataset.student_id;
    navigate(`/staff/students/profiles/details/${studentId}`);
  };

  /* HANDLE CLICKS TO DAY OF WEEK INDICATOR */
  function handleClicksToDayOfWeekIndicator(e) {
    const dayOfWeekInteger = e.target.id.split("-")[1];

    const dayOfWeekContainer = document.querySelector(
      `#day-of-week-container-${dayOfWeekInteger}`
    );

    dayOfWeekContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

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
                            {/* <div className="instructor-header-container">
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
                            </div> */}
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
                                      <div className="more-info-container"></div>
                                      <div className="event-name">
                                        {event.event_name}
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
      <FloatingInstructorIcons
        dayOfWeekArray={dayOfWeekArray}
        instructors={instructors}
      />
    </Fragment>
  );
}

export default Calendar;
