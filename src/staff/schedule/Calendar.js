import React, { useState, useEffect } from "react";
/* Axios */
import instance from "../axios/axios_authenticated";
/* Components  */
import CalendarToolbar from "../toolbar/schedule/CalendarToolbar";
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
  useEffect(() => {
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
  }, [events]);

  return (
    <Fragment>
      {/* Calendar Container */}
      <div id="calendar-container">
        {/* Calendar Container - Day of Week */}
        {dayOfWeekArray.map((day) => {
          return (
            <div
              className="day-of-week-container"
              style={{ width: `${instructors.length * 10}rem` }}
              key={`day-of-week-${day[0]}`}>
              <div>{day[1]}</div>
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
                    width: `${instructors.length * 10 - 1}rem`,
                  }}>
                  {/* Calendar Container - Day of Week - Events Container - Events - Instructor Container */}
                  {instructors.map((instructor) => {
                    return (
                      <div
                        className="instructor-container"
                        key={`instructor-${instructor.id}`}>
                        <div className="instructor-name-text">
                          {instructor.username}
                        </div>
                        {events
                          .filter((event) => {
                            return (
                              event.primary_instructor === instructor.id &&
                              event.day_of_week === day[0]
                            );
                          })
                          .map((event) => {
                            return (
                              <div
                                className="event"
                                key={`event-${event.id}`}
                                style={{
                                  top: `calc(${
                                    (event.start_time.slice(0, 2) -
                                      timeIncrements[0] +
                                      1) *
                                      10 +
                                    event.start_time.slice(3, 5) * (10 / 60)
                                  }rem + ${
                                    (event.start_time.slice(0, 2) -
                                      timeIncrements[0]) *
                                    1
                                  }px - 3px)`,
                                  height: `calc(${
                                    event.event_type.duration * (10 / 60)
                                  }rem + 3px)`,
                                }}>
                                {event.event_name}
                                <br></br>
                                {event.start_time}
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
      <CalendarToolbar />
    </Fragment>
  );
}

export default Calendar;
