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

  /* renders calendar background */
  /* checks for overlapping events */
  useEffect(() => {
    function caculateCalendarBackgroundTimeIncrements(events) {
      if (events.length > 0) {
        /* sorts array of events by start time */
        const sortedEvents = [...events];
        sortedEvents.sort(
          (a, b) =>
            new Date(`1970-01-01T${a.start_time}Z`) -
            new Date(`1970-01-01T${b.start_time}Z`)
        );

        /* gets earlist and latest event in sorted array */
        const earlistEvent = sortedEvents[0];
        const latestEvent = sortedEvents[sortedEvents.length - 1];

        /* gets start hour, end hour and duration */
        const earlistEventStartHourInt = parseInt(
          earlistEvent.start_time.split(":")[0]
        );
        const latestEventStartHourInt = parseInt(
          latestEvent.start_time.split(":")[0]
        );

        /* creates array of time increments as integers to represent hours */
        const timeIncrementsArray = [];
        for (
          let i = earlistEventStartHourInt;
          i <= latestEventStartHourInt;
          i++
        ) {
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

  return (
    <Fragment>
      {events.length > 0 ? (
        <div id="calendar-container">
          {/* Calendar Container - Day of Week */}
          <div className="irregular-events-container">
            {events
              .filter((event) => {
                return !event.start_time;
              })
              .map((event) => {
                return (
                  <div className="event" key={`event-${event.id}`}>
                    <div className="event-header">
                      <div className="event-name">{event.event_name}</div>
                      <div className="event-start-time">{event.start_time}</div>
                    </div>
                    <div className="event-body">
                      {event.students.map((student) => {
                        return (
                          <div
                            className="student-container"
                            key={`student-${student.id}`}>
                            {student.last_name_kanji} {student.first_name_kanji}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
          {dayOfWeekArray.map((day) => {
            return (
              <div
                className="day-of-week-container"
                style={{
                  width: `${
                    instructors.length *
                    22 /* expands width of event container (1 of 2) */
                  }rem`,
                }}
                key={`day-of-week-${day[0]}`}>
                {/* Calendar Container - Day of Week - Header Container */}
                <div className="header-container">
                  {/* Calendar Container - Day of Week - Day Of Week Container */}
                  <div className="day-of-week-label">{day[1]}</div>
                  {/* Calendar Container - Day of Week - Instructor Header Container */}
                  <div className="instructor-name-container">
                    {instructors.map((instructor) => {
                      return (
                        <div className="instructor-name-text">
                          {`${instructor.userprofiles.last_name_kanji}先生`}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Calendar Container - Day of Week - Events Container */}
                <div className="background-and-events-container">
                  {/* Calendar Container - Day of Week - Events Container - Background */}
                  <div className="background-container">
                    {timeIncrements.map((hour) => {
                      return (
                        <div
                          className="hour-increment"
                          key={`day-${day[0]}-hour-${hour}`}>
                          <div className="hour-text">{`${hour}:00`}</div>
                        </div>
                      );
                    })}
                    <div className="hour-increment">
                      <div className="hour-text">{`${
                        timeIncrements[timeIncrements.length - 1] + 1
                      }:00`}</div>
                    </div>
                    <div className="hour-increment"></div>
                  </div>
                  {/* Calendar Container - Day of Week - Events Container - Events */}
                  <div
                    className="events-container"
                    style={{
                      width: `${
                        instructors.length *
                          22 /* expands width of event container (1 of 2) */ -
                        1
                      }rem`,
                    }}>
                    {/* Calendar Container - Day of Week - Events Container - Events - Instructor Container */}
                    {instructors.map((instructor) => {
                      return (
                        <div
                          className="instructor-container"
                          key={`instructor-${instructor.id}`}>
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
                                        20 /* match CSS and JS values (2 of 3) */ +
                                      event.start_time.slice(3, 5) * (20 / 60)
                                    }rem + ${
                                      (event.start_time.slice(0, 2) -
                                        timeIncrements[0]) *
                                      1
                                    }px - 3px)`,
                                    height: `calc(${
                                      event.event_type.duration *
                                      (20 /* match CSS and JS values (3 of 3) */ /
                                        60)
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
                                            {student.last_name_katakana}{" "}
                                            {student.first_name_katakana}
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
      ) : (
        <LoadingSpinner />
      )}
      <CalendarToolbar />
    </Fragment>
  );
}

export default Calendar;
