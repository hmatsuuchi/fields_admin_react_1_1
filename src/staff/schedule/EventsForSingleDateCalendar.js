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

  /* creates an array of times for calendar markings using event data */
  const arrayOfTimesForCalendarMarkings = () => {
    let arrayOfTimes = [];

    const firstLessonStartTimeString = eventData[0].start_time;
    const lastLessonStartTimeString =
      eventData[eventData.length - 1].start_time;

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
    const endTimeInteger = lastLessonStartTimeDateObject.getHours() + 1;

    const totalTime = endTimeInteger - startTimeInteger + 2;

    for (let i = -1; i < totalTime - 1; i++) {
      arrayOfTimes.push(`${startTimeInteger + i}:00`);
    }

    return arrayOfTimes;
  };

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
              const events = response.data.events;
              setEventData(events);
              console.log(eventData);
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
        <div id="calendar-lines-container">
          {eventData.length !== 0 &&
            arrayOfTimesForCalendarMarkings().map((time) => {
              return <div>{time}</div>;
            })}
        </div>
      </div>
    </Fragment>
  );
}

export default EventsForSingleDateCalendar;
