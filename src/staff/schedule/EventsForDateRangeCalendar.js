import { useState, useEffect, Fragment } from "react";
// Axios
import instance from "../../staff/axios/axios_authenticated";
// CSS
import "./EventsForDateRangeCalendar.scss";
// COMPONENTS
import ScheduleWeekToolbar from "../toolbar/schedule/ScheduleWeekToolbar";
import DateSelector from "../micro/schedule/DateSelector";
import LoadingSpinner from "../micro/LoadingSpinner";

function EventsForDateRangeCalendar() {
  /* finds nearest previous Sunday and next closest Saturday */
  const getStartAndEndDates = (date) => {
    /* creates new date object */
    let dateToCheck = new Date(date);

    /* checks to see if day of week is Sunday */
    while (dateToCheck.getDay() !== 0) {
      dateToCheck.setDate(dateToCheck.getDate() - 1);
    }

    /* set start date */
    const startDateCopy = dateToCheck;
    /* end date is six days in future */
    const endDateCopy = new Date(startDateCopy);
    /* add 6 days to get end of week */
    endDateCopy.setDate(endDateCopy.getDate() + 6);

    /* returns dates as date objects */
    return { startDate: startDateCopy, endDate: endDateCopy };
  };

  /* PROPS */
  const [events, setEvents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [displayContent, setDisplayContent] = useState(false);
  const [currentDateData, setCurrentDateData] = useState(new Date());
  const [currentDateDisplay, setCurrentDateDisplay] = useState(new Date());
  const [startDate, setStartDate] = useState(
    getStartAndEndDates(new Date()).startDate
  );
  const [endDate, setEndDate] = useState(
    getStartAndEndDates(new Date()).endDate
  );

  /* performs initial fetch */
  useEffect(() => {
    // fetches event data from API
    const performInitialFetch = async () => {
      // date range parameters
      const params = {
        start_date: getStartAndEndDates(new Date())
          .startDate.toISOString()
          .slice(0, 10),
        end_date: getStartAndEndDates(new Date())
          .endDate.toISOString()
          .slice(0, 10),
      };

      // fetches events for date range
      try {
        await instance
          .get("api/schedule/events/", { params: params })
          .then((response) => {
            if (response) {
              setEvents(response.data.events);
              setInstructors(response.data.instructors);
              setDisplayContent(true);
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    /* drive code */
    performInitialFetch();
  }, []);

  /* attaches observers to day containers */
  useEffect(() => {
    // get viewport width
    const viewportWidth = window.innerWidth;

    // set rootMargin and threshold property
    let rootMargin = "0px 0px 300% 0px";
    let threshold = 0.5;
    if (viewportWidth >= 2800) {
      rootMargin = "0px -42% 300% -42%";
      threshold = 0.9;
    } else if (viewportWidth >= 2400) {
      rootMargin = "0px -50% 300% -33%";
      threshold = 0.65;
    } else if (viewportWidth >= 2000) {
      rootMargin = "0px -40% 300% -40%";
      threshold = 0.9;
    } else if (viewportWidth >= 1600) {
      rootMargin = "0px -50% 300% -25%";
      threshold = 0.65;
    } else if (viewportWidth >= 1200) {
      rootMargin = "0px -25% 300% -25%";
      threshold = 0.9;
    } else if (viewportWidth >= 992) {
      rootMargin = "0px -50% 300% 0px";
      threshold = 0.75;
    }

    // intersection observer to change date when scrolling between days of the week
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log(entry.target.id);
            setCurrentDateDisplay(entry.target.id);
          }
        });
      },
      { root: null, rootMargin: rootMargin, threshold: threshold }
    );

    // adds observers to day containers
    function addObserversToDayContainers() {
      document.querySelectorAll(".snap-element").forEach((day) => {
        observer.observe(day);
      });
    }

    if (events) {
      addObserversToDayContainers();
    }
  }, [events]);

  /* jumps to day of week element */
  useEffect(() => {
    // jumps to day of week element
    const jumpToDayOfWeekElement = () => {
      // creates copy of current date
      let currentDateCopy = new Date(currentDateData);

      // finds day of week element
      const dayOfWeekElement = document.getElementById(
        currentDateCopy.toISOString().slice(0, 10)
      );

      // scrolls to day of week element
      if (dayOfWeekElement) {
        dayOfWeekElement.parentNode.scrollTo({
          left: dayOfWeekElement.offsetLeft,
          behavior: "smooth",
        });
      }
    };

    // drives code
    jumpToDayOfWeekElement();
  }, [events, currentDateData]);

  /* handles date changes made to date input */
  useEffect(() => {
    // jumps to day of week element
    const jumpToDayOfWeekElement = () => {
      // creates copy of current date
      let currentDateDataCopy = new Date(currentDateData);

      // finds day of week element
      const dayOfWeekElement = document.getElementById(
        currentDateDataCopy.toISOString().slice(0, 10)
      );

      // scrolls to day of week element
      if (dayOfWeekElement) {
        dayOfWeekElement.parentNode.scrollTo({
          left: dayOfWeekElement.offsetLeft,
          behavior: "smooth",
        });
      }
    };

    const currentDateDataCopyString = new Date(currentDateData)
      .toISOString()
      .slice(0, 10);
    const startDateCopyString = startDate.toISOString().slice(0, 10);
    const endDateCopyString = endDate.toISOString().slice(0, 10);

    // if date selected is within current week, jumps to day of week element
    // if date selected is not within current week, fetches new week
    if (
      startDateCopyString <= currentDateDataCopyString &&
      currentDateDataCopyString <= endDateCopyString
    ) {
      // jumps to day of week element
      jumpToDayOfWeekElement();
    } else {
      // hides content
      setDisplayContent(false);

      // clears events
      setEvents([]);

      // sets new display, start and end dates
      setCurrentDateDisplay(currentDateData);
      setStartDate(getStartAndEndDates(currentDateData).startDate);
      setEndDate(getStartAndEndDates(currentDateData).endDate);

      // fetches event data for new week from API
      const performNewWeekFetch = async () => {
        // date range parameters
        const params = {
          start_date: startDate.toISOString().slice(0, 10),
          end_date: endDate.toISOString().slice(0, 10),
        };

        // fetches events for date range
        try {
          await instance
            .get("api/schedule/events/", { params: params })
            .then((response) => {
              if (response) {
                setEvents(response.data.events);
                setInstructors(response.data.instructors);
                setDisplayContent(true);
              }
            });
        } catch (e) {
          console.log(e);
        }
      };

      /* drive code */
      performNewWeekFetch();
    }
  }, [currentDateData, startDate, endDate]);

  /* returns events for day of week and instructor */
  function getEventsForDayAndInstructor(dayOfWeek, instructorId) {
    return events.filter((event) => {
      return (
        event.day_of_week === dayOfWeek &&
        event.primary_instructor === instructorId
      );
    });
  }

  /* returns top position of events as percentage */
  function setTopPositionBasedOnStartTime(startTime) {
    // converts time string to Date object
    const timeObject = new Date(`1970-01-01T${startTime}`);

    // total minutes in a day
    const totalMinutesInDay = 24 * 60;

    // start time in minutes
    const startTimeInMinutes =
      timeObject.getHours() * 60 + timeObject.getMinutes();

    // total minutes not displayed at start of day
    const totalMinutesNotDisplayedAtStartOfDay = 9 * 60;

    // total minutes not displayed at end of day
    const totalMinutesNotDisplayedAtEndOfDay = 2 * 60;

    // returns top position as percentage
    const topPosition =
      ((startTimeInMinutes - totalMinutesNotDisplayedAtStartOfDay) /
        (totalMinutesInDay -
          totalMinutesNotDisplayedAtStartOfDay -
          totalMinutesNotDisplayedAtEndOfDay)) *
      100;

    return `${topPosition}%`;
  }

  /* returns height of events as percentage */
  function setHeightBasedOnEventDuration(eventDuration) {
    // total minutes in a day
    const totalMinutesInDay = 24 * 60;

    // total minutes not displayed at start of day
    const totalMinutesNotDisplayedAtStartOfDay = 9 * 60;

    // total minutes not displayed at end of day
    const totalMinutesNotDisplayedAtEndOfDay = 2 * 60;

    // decrease space between events in minutes
    const decreaseSpaceBetweenEvents = 0;
    // height of event

    const height =
      ((eventDuration + decreaseSpaceBetweenEvents) /
        (totalMinutesInDay -
          totalMinutesNotDisplayedAtStartOfDay -
          totalMinutesNotDisplayedAtEndOfDay)) *
      100;

    // returns height as percentage
    return `${height}%`;
  }

  /* day of week integer to single character Japanese string */
  const dayIntToString = {
    0: "日",
    1: "月",
    2: "火",
    3: "水",
    4: "木",
    5: "金",
    6: "土",
  };

  return (
    <Fragment>
      <DateSelector
        currentDateDisplay={currentDateDisplay}
        setCurrentDateData={setCurrentDateData}
        startDate={startDate}
        endDate={endDate}
      />

      {displayContent ? (
        <div id="calendar-container">
          {/* creates array of indices */}
          {Array.from({ length: 7 }, (_, i) => i).map((day) => {
            /* creates new date object of first day of week*/
            const dateOfDay = getStartAndEndDates(currentDateData).startDate;
            /* increments date object by 9 hours to account for timezone */
            /* the .toISOString function returns a date in UTC */
            dateOfDay.setHours(dateOfDay.getHours() + 9);
            /* increments date object for each day of week */
            dateOfDay.setDate(dateOfDay.getDate() + day);

            return (
              /* snap element */
              <div
                className="snap-element"
                key={day}
                id={`${dateOfDay.toISOString().slice(0, 10)}`}>
                {/* date header */}
                <div className="date-header">
                  {`${dateOfDay.getMonth() + 1}月${dateOfDay.getDate()}日 (${
                    dayIntToString[dateOfDay.getDay()]
                  })`}
                </div>
                <div
                  key={day}
                  className={`day-container${
                    currentDateDisplay === dateOfDay.toISOString().slice(0, 10)
                      ? " active-day"
                      : ""
                  }`}>
                  <div className="schedule-container card">
                    <div className="markings-container">
                      <div className="markings">09:00</div>
                      <div className="markings">10:00</div>
                      <div className="markings">11:00</div>
                      <div className="markings">12:00</div>
                      <div className="markings">13:00</div>
                      <div className="markings">14:00</div>
                      <div className="markings">15:00</div>
                      <div className="markings">16:00</div>
                      <div className="markings">17:00</div>
                      <div className="markings">18:00</div>
                      <div className="markings">19:00</div>
                      <div className="markings">20:00</div>
                      <div className="markings">21:00</div>
                    </div>
                    {instructors && events
                      ? instructors.map((instructor) => (
                          /* instructor container */
                          <div
                            className="instructor-container"
                            key={instructor.id}>
                            <div className="instructor-name">
                              {instructor.username}
                            </div>
                            <div className="events-container">
                              {getEventsForDayAndInstructor(
                                day,
                                instructor.id
                              ).map((event) => (
                                /* event container */
                                <div
                                  className="event card"
                                  key={event.id}
                                  style={{
                                    top: setTopPositionBasedOnStartTime(
                                      event.start_time
                                    ),
                                    height: setHeightBasedOnEventDuration(
                                      event.event_type.duration
                                    ),
                                  }}>
                                  <div className="event-title">
                                    <div className="event-name">
                                      {event.event_name}
                                    </div>
                                    <div className="event-start-time">
                                      {event.start_time.slice(0, 5)}
                                    </div>
                                  </div>
                                  <div className="student-container">
                                    {event.students.map((student) => {
                                      return (
                                        <div
                                          className="student"
                                          key={student.id}>
                                          <div
                                            className={`enrollment-status-indicator status-${student.status}`}
                                          />

                                          <div className="student-name-kanji">
                                            {student.last_name_kanji &&
                                            student.first_name_kanji
                                              ? `${student.last_name_kanji} ${student.first_name_kanji}`
                                              : student.last_name_kanji
                                              ? student.last_name_kanji
                                              : student.first_name_kanji}
                                          </div>
                                          <div className="student-name-katakana">
                                            {student.last_name_katakana &&
                                            student.first_name_katakana
                                              ? `${student.last_name_katakana} ${student.first_name_katakana}`
                                              : student.last_name_katakana
                                              ? student.last_name_katakana
                                              : student.first_name_katakana}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      : ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <LoadingSpinner />
      )}

      <ScheduleWeekToolbar />
    </Fragment>
  );
}

export default EventsForDateRangeCalendar;
