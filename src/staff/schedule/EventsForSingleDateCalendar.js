import { Fragment, useEffect, useState } from "react";
/* Axios */
import instance from "../../staff/axios/axios_authenticated";
/* Components  */
import ScheduleWeekToolbar from "../toolbar/schedule/ScheduleWeekToolbar";
/* CSS */
import "./EventsForSingleDateCalendar.scss";

function EventsForSingleDateCalendar() {
  /* props */
  const [selectedDate, setSelectedDate] = useState(new Date("2024-03-22"));

  const [eventData, setEventData] = useState([]);
  const [instructorData, setInstructorData] = useState([]);

  const [calendarMarkings, setCalendarMarkings] = useState([]);

  /* creates an array of times for calendar markings using event data */
  function arrayOfTimesForCalendarMarkings(
    firstLessonStartTimeString,
    lastLessonStartTimeString
  ) {
    let arrayOfTimes = [];

    const firstLessonStartTimeDateObject = new Date();
    const [hoursFirst, minutesFirst, secondsFirst] =
      firstLessonStartTimeString.split(":");
    firstLessonStartTimeDateObject.setHours(
      hoursFirst,
      minutesFirst,
      secondsFirst
    );

    const lastLessonStartTimeDateObject = new Date();
    const [hoursLast, minutesLast, secondsLast] =
      lastLessonStartTimeString.split(":");
    lastLessonStartTimeDateObject.setHours(hoursLast, minutesLast, secondsLast);

    const startTimeInteger = firstLessonStartTimeDateObject.getHours();
    const endTimeInteger = lastLessonStartTimeDateObject.getHours() + 2;

    const totalTime = endTimeInteger - startTimeInteger;

    for (let i = 0; i < totalTime; i++) {
      arrayOfTimes.push(`${startTimeInteger + i}:00`);
    }

    setCalendarMarkings(arrayOfTimes);
  }

  /* day of week in kanji */
  const dayOfWeekInKanji = {
    0: "日",
    1: "月",
    2: "火",
    3: "水",
    4: "木",
    5: "金",
    6: "土",
  };

  /* performs initial fetch of data */
  useEffect(() => {
    console.log(selectedDate.toISOString());
    // fetches event data from API
    const performInitialFetch = async () => {
      // date parameter
      const params = {
        date: selectedDate.toISOString().split("T")[0],
      };

      // fetches events for date range
      try {
        await instance
          .get("api/schedule/events/single_date", { params: params })
          .then((response) => {
            if (response) {
              const eventData = response.data.events;
              const instructorData = response.data.instructors;

              setEventData(eventData);
              setInstructorData(instructorData);
              arrayOfTimesForCalendarMarkings(
                eventData[0].start_time,
                eventData[response.data.events.length - 1].start_time
              );

              console.log(eventData);
              console.log(instructorData);
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    /* drive code */
    performInitialFetch();
  }, [selectedDate]);

  return (
    <Fragment>
      {/* toolbar */}
      <ScheduleWeekToolbar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      {/* header */}
      <div id="calendar-header">
        <div id="day-of-week-dot">
          <div id="day-of-week">
            {dayOfWeekInKanji && dayOfWeekInKanji[selectedDate.getDay()]}
          </div>
        </div>
        <div id="date-dot">
          <div id="date">{selectedDate.getDate()}</div>
        </div>
      </div>
      {/* events */}
      <div id="calendar-container">
        {/* events - calendar lines */}
        <div id="calendar-lines-container">
          <div className="time-block-container"></div>
          {eventData.length !== 0 &&
            calendarMarkings.map((time) => {
              return (
                <Fragment key={`time-block-container-${time}`}>
                  <div className="time-block-container">
                    <div className="time-block">{time}</div>
                  </div>
                </Fragment>
              );
            })}
        </div>
        {/* events - instructors */}
        <div id="instructor-container">
          {instructorData.map((instructor) => {
            return (
              <div className="instructor-column">
                <div className="instructor-header">{instructor.username}</div>
                {/* events - instructors - events */}
                {eventData
                  .filter((event) => event.primary_instructor === instructor.id)
                  .map((event) => {
                    {
                      /* calculates starting y-axis position of event */
                    }
                    let startTime = event.start_time;
                    let startTimeHourInt = parseInt(startTime.split(":")[0]);

                    if (startTimeHourInt > 12) {
                      startTimeHourInt -= 12;
                    }

                    let startTimeOffset = parseInt(
                      calendarMarkings[0].split(":")[0]
                    );

                    if (startTimeOffset > 12) {
                      startTimeOffset -= 12;
                    }

                    {
                      /* calculates height of event */
                    }
                    let eventHeight = (17 / 60) * event.event_type.duration;

                    return (
                      <div
                        className="event-container"
                        style={{
                          top: `${
                            (startTimeHourInt - startTimeOffset) * 17 + 17
                          }rem`,
                          height: `${eventHeight}rem`,
                        }}>
                        <div className="event-name">{event.event_name}</div>
                        <div className="class-list-container">
                          {event.students.map((student) => {
                            return (
                              <div className="student-container">
                                <div
                                  className={`student-enrollment-status${
                                    student.status === 1
                                      ? " pre-enrolled"
                                      : student.status === 2
                                      ? " enrolled"
                                      : student.status === 3
                                      ? " short-absence"
                                      : student.status === 4
                                      ? " long-absence"
                                      : " status-unknown"
                                  }`}></div>
                                <div className="student-name-kanji">
                                  {" "}
                                  {`${student.last_name_kanji} ${student.first_name_kanji}`}
                                </div>
                                {student.grade_verbose && (
                                  <div className="student-grade">
                                    {`${student.grade_verbose}`}
                                  </div>
                                )}
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
    </Fragment>
  );
}

export default EventsForSingleDateCalendar;
