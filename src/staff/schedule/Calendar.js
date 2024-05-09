import React, { useState, useEffect } from "react";
/* Axios */
import instance from "../axios/axios_authenticated";
/* Components  */
import CalendarToolbar from "../toolbar/schedule/CalendarToolbar";
import LoadingSpinner from "../micro/LoadingSpinner";
// import LoadingSpinner from "../micro/LoadingSpinner";
/* CSS */
import "./Calendar.scss";
import { Fragment } from "react";

function Calendar() {
  /* state */
  const [events, setEvents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [timeIncrements, setTimeIncrements] = useState([]);
  const [visibleDaysOfWeek, setVisibleDaysOfWeek] = useState([]);
  const [hourSegmentHeight, setHourSegmentHeight] = useState(0);

  // array of day of week and corresponding python day of week integer
  const dayOfWeekArray = [
    [6, "日曜日"],
    [0, "月曜日"],
    [1, "火曜日"],
    [2, "水曜日"],
    [3, "木曜日"],
    [4, "金曜日"],
    [5, "土曜日"],
  ];

  // dictionary of day of week expressed as single kanji character
  const dayOfWeekSingleKanji = {
    6: "日",
    0: "月",
    1: "火",
    2: "水",
    3: "木",
    4: "金",
    5: "土",
  };

  /* performs initial fetch data */
  useEffect(() => {
    // fetches event data from API
    const performInitialFetch = async () => {
      // fetches events for date range
      try {
        await instance.get("api/schedule/events/all").then((response) => {
          if (response) {
            setEvents(response.data.events);
            setInstructors(response.data.instructors);
          }
        });
      } catch (e) {
        console.log(e);
      }
    };

    /* drive code */
    performInitialFetch();
  }, []);

  /* detects changes to viewport width and sets height of hour segments */
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

  /* attaches intersctional observers */
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

  /* handles enabling and disabling next previous day buttons */
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

  /* renders calendar background */
  /* checks for overlapping events */
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

    function checkForOverlappingEvents(events) {
      if (events.length > 0) {
        events.forEach((event) => {
          if (event.start_time && event.event_type.duration) {
            event.start_integer = parseInt(event.start_time.slice(0, 2)) * 60;
            event.end_integer = event.start_integer + event.event_type.duration;
          }
        });

        events.forEach((eventToCheck) => {
          let duplicateEvents = events.filter((event) => {
            return (
              event.day_of_week === eventToCheck.day_of_week &&
              event.primary_instructor === eventToCheck.primary_instructor &&
              event.start_integer < eventToCheck.end_integer &&
              event.end_integer > eventToCheck.start_integer
            );
          });

          if (duplicateEvents.length > 1) {
            duplicateEvents[duplicateEvents.length - 1].duplicate = true;
          }
        });
      }
    }

    /* drive code */
    checkForOverlappingEvents(events);
    caculateCalendarBackgroundTimeIncrements(events);
  }, [events]);

  /* handles next day button click */
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

  /* handles previous day button click */
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
                                    className={`event${
                                      event.duplicate ? " duplicate" : ""
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
                                    }}>
                                    {/* Calendar Container - Day of Week - Events Container - Events - Instructor Container - Event - Event Header*/}
                                    <div className="event-header">
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
                                    <div className="event-body">
                                      {event.students.map((student) => {
                                        return (
                                          <div
                                            className="student-container"
                                            key={`student-${student.id}`}>
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
                                              {`${student.last_name_kanji} ${student.first_name_kanji} (${student.grade_verbose})`}
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
                }`}>
                日
              </div>
              <div
                id="indicator-0"
                className={`indicator${
                  visibleDaysOfWeek.includes(0) ? " active" : ""
                }`}>
                月
              </div>
              <div
                id="indicator-1"
                className={`indicator${
                  visibleDaysOfWeek.includes(1) ? " active" : ""
                }`}>
                火
              </div>
              <div
                id="indicator-2"
                className={`indicator${
                  visibleDaysOfWeek.includes(2) ? " active" : ""
                }`}>
                水
              </div>
              <div
                id="indicator-3"
                className={`indicator${
                  visibleDaysOfWeek.includes(3) ? " active" : ""
                }`}>
                木
              </div>
              <div
                id="indicator-4"
                className={`indicator${
                  visibleDaysOfWeek.includes(4) ? " active" : ""
                }`}>
                金
              </div>
              <div
                id="indicator-5"
                className={`indicator${
                  visibleDaysOfWeek.includes(5) ? " active" : ""
                }`}>
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
      ) : (
        <LoadingSpinner />
      )}
      <CalendarToolbar />
    </Fragment>
  );
}

export default Calendar;
