import React, { useState, useEffect } from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./ClassSelectContainer.scss";
/* COMPONENTS */
import LoadingSpinner from "../../../micro/LoadingSpinner";

function ClassSelectContainer({
  eventIdSelected,
  setEventIdSelected,
  setEventNameSelected,
  setAttendanceStartTimeSelected,
  setAttendanceStudentsSelected,
}) {
  /* ----------------------------------------------------- */
  /* ----------------------- STATE ----------------------- */
  /* ----------------------------------------------------- */

  const [eventChoices, setEventChoices] = useState([]);
  const [eventChoicesFiltered, setEventChoicesFiltered] = useState([]);

  /* ----------------------------------------------------- */
  /* --------------------- FUNCTIONS --------------------- */
  /* ----------------------------------------------------- */

  /* FETCH EVENT CHOICES ON COMPONENT MOUNT */
  useEffect(() => {
    /* sorts event choices by day of week, start time, and primary instructor */
    const sortEventChoices = (eventChoices) => {
      eventChoices.sort((a, b) => {
        /* puts sunday at the start of the sort */
        if (a.day_of_week === 6) return -1;
        if (b.day_of_week === 6) return 1;
        /* compares day of week integer */
        if (a.day_of_week < b.day_of_week) return -1;
        if (a.day_of_week > b.day_of_week) return 1;
        /* compares start time string */
        if (a.start_time < b.start_time) return -1;
        if (a.start_time > b.start_time) return 1;
        /* compares primary instructor integer */
        if (a.primary_instructor.id < b.primary_instructor.id) return 1;
        if (a.primary_instructor.id > b.primary_instructor.id) return -1;
        return 0;
      });

      return eventChoices;
    };

    /* makes API call to fetch event choices */
    const fetchEventChoices = async () => {
      try {
        await instance
          .get("api/attendance/attendance/event_choices/")
          .then((response) => {
            if (response) {
              /* sorts event choices */
              const eventChoices = sortEventChoices(
                response.data.event_choices
              );
              setEventChoices(eventChoices);
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    /* drives code */
    fetchEventChoices();
  }, []);

  /* FILTERS EVENT CHOICES */
  useEffect(() => {
    setEventChoicesFiltered(eventChoices);
  }, [eventChoices]);

  /* HANDLE EVENT SEARCH ON CHANGE */
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

  /* HANDLE CLICKS TO EVENT CHOICES */
  const handleClicksToEventChoices = (event) => {
    setEventIdSelected(parseInt(event.target.dataset.event_id));
    setEventNameSelected(event.target.dataset.event_name);
    setAttendanceStartTimeSelected(event.target.dataset.event_start_time);

    const selectedEvent = eventChoices.find((eventChoice) => {
      return eventChoice.id === parseInt(event.target.dataset.event_id);
    });

    const selectedEventEnrolledStudents = selectedEvent.students;

    setAttendanceStudentsSelected(selectedEventEnrolledStudents);
  };

  /* DAY OF WEEK ARRAY */
  const dayOfWeekArray = [
    [6, "日"],
    [0, "月"],
    [1, "火"],
    [2, "水"],
    [3, "木"],
    [4, "金"],
    [5, "土"],
  ];

  /* DAY OF WEEK INTEGER CONVERTER */
  const dayOfWeekIntegerConverter = [2, 3, 4, 5, 6, 7, 1];

  /* REMOVE LEADING ZEROS FROM STRINGS */
  const removeLeadingZeroFromString = (str) => {
    return str.replace(/^0+/, "");
  };

  /* ----------------------------------------------------- */
  /* ------------------------ JSX ------------------------ */
  /* ----------------------------------------------------- */

  return (
    <div id="class-input" className="class-select-container">
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
                data-event_primary_instructor={event.primary_instructor.id}
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
                      gridColumn: dayOfWeekIntegerConverter[event.day_of_week],
                    }}>
                    {removeLeadingZeroFromString(event.start_time.slice(0, 5))}
                  </div>
                </div>
                <div
                  className="event-primary-instructor"
                  style={{
                    backgroundImage: `url(/img/instructors/${event.primary_instructor.userprofilesinstructors.icon_stub})`,
                  }}></div>
                <div className="event-name">{event.event_name}</div>
                <div className="event-type">{event.event_type.name}</div>

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
  );
}

export default ClassSelectContainer;
