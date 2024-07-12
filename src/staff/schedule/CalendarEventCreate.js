import React, { Fragment, useEffect, useState } from "react";
/* Axios */
import instance from "../axios/axios_authenticated";
/* Components  */
import CalendarCreateToolbar from "../toolbar/schedule/CalendarCreateToolbar";
import DisplayDescriptors from "../micro/students/DisplayDescriptors";
import ProfileSectionHeader from "../micro/students/ProfileSectionHeader";
/* CSS */
import "./CalendarEventCreate.scss";
// React Router
import { Link, useNavigate } from "react-router-dom";

/* COMPONENTS - CALENDAR EVENT CREATE */
function CalendarEventCreate({ csrfToken, setHighlightedEventId }) {
  /* ----------- CALENDAR EVENT CREATE - STATE ----------- */
  const [submitted, setSubmitted] = useState(false);
  const [disableToolbarButtons, setDisableToolbarButtons] = useState(false);

  const [eventTypeChoices, setEventTypeChoices] = useState([]);
  const [primaryInstructorChoices, setPrimaryInstructorChoices] = useState([]);

  /* FORM STATE */
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [primaryInstructor, setPrimaryInstructor] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [startTime, setStartTime] = useState("");

  /* FORM INPUT INVALID STATE */
  const [eventNameInvalid, setEventNameInvalid] = useState(false);
  const [eventTypeInvalid, setEventTypeInvalid] = useState(false);
  const [primaryInstructorInvalid, setPrimaryInstructorInvalid] =
    useState(false);
  const [dayOfWeekInvalid, setDayOfWeekInvalid] = useState(false);
  const [startTimeInvalid, setStartTimeInvalid] = useState(false);

  /* ----------- CALENDAR EVENT CREATE - FUNCTIONS ----------- */

  /* CALENDAR EVENT CREATE - FUNCTIONS - DAY OF WEEK CONVERSTION (FULL DAY) */
  const dayOfWeekArray = [
    [6, "日曜日"],
    [0, "月曜日"],
    [1, "火曜日"],
    [2, "水曜日"],
    [3, "木曜日"],
    [4, "金曜日"],
    [5, "土曜日"],
  ];

  /* CALENDAR EVENT CREATE - FUNCTIONS - FETCH CHOICE LIST VALUES */
  useEffect(() => {
    const fetchChoices = async () => {
      try {
        await instance.get("api/schedule/events/choices/").then((response) => {
          if (response) {
            if (response.status === 200) {
              setEventTypeChoices(response.data.event_type_choices);
              setPrimaryInstructorChoices(
                response.data.primary_instructor_choices
              );
            } else {
              window.alert("An error occurred.");
            }
          }
        });
      } catch (e) {
        console.log(e);
      }
    };

    /* drive code */
    fetchChoices();
  }, []);

  /*  CALENDAR EVENT CREATE - FUNCTIONS - REACT ROUTER DOM NAVIGATE */
  const navigate = useNavigate();

  /* CALENDAR EVENT CREATE - FUNCTIONS - SUBMIT DATA */
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    /* reset all invalid input flags */
    setEventNameInvalid(false);
    setEventTypeInvalid(false);
    setPrimaryInstructorInvalid(false);
    setDayOfWeekInvalid(false);
    setStartTimeInvalid(false);

    const data = {
      event_name: eventName,
      event_type: eventType,
      primary_instructor: primaryInstructor,
      day_of_week: dayOfWeek,
      start_time: startTime,
    };

    const submitData = async () => {
      setDisableToolbarButtons(true);
      setSubmitted(true);

      try {
        await instance
          .post("api/schedule/events/details/", data, {
            headers: {
              "X-CSRFToken": csrfToken,
            },
          })
          .then((response) => {
            if (response) {
              if (response.status === 201) {
                navigate("/staff/schedule/events/calendar/week-view/");
                setHighlightedEventId(response.data.eventId);
              } else {
                setDisableToolbarButtons(false);
                setSubmitted(false);
                window.alert("An error occurred.");
              }
            }
          });
      } catch (e) {
        console.log(e);
        setDisableToolbarButtons(false);
        setSubmitted(false);
        window.alert("An error occurred.");
      }
    };

    if (eventName && eventType && primaryInstructor && dayOfWeek && startTime) {
      /* drive code */
      submitData();
    }

    /* set invalid input flags */
    if (!eventName) {
      setEventNameInvalid(true);
    }
    if (!eventType) {
      setEventTypeInvalid(true);
    }
    if (!primaryInstructor) {
      setPrimaryInstructorInvalid(true);
    }
    if (!dayOfWeek) {
      setDayOfWeekInvalid(true);
    }
    if (!startTime) {
      setStartTimeInvalid(true);
    }
  };

  /* ----------- CALENDAR EVENT CREATE - JSX ----------- */
  return (
    <Fragment>
      <section
        id="calendar-event-create"
        className={`card-section-full-width${
          submitted ? " content-submitted" : ""
        }`}>
        <DisplayDescriptors
          displayTextArray={["新しいイベントを作成しています"]}
        />
        <div className="card-container-full-width">
          <div className="card-full-width">
            <div className="event-header-container">
              <div className="event-name-text">{eventName}</div>
            </div>
            <div className="event-body-container">
              <form onSubmit={handleFormSubmit}>
                <ProfileSectionHeader displayText="基本情報" />
                {/* FORM - EVENT NAME */}
                <label htmlFor="event_name">イベント名</label>
                <input
                  type="text"
                  id="event-name"
                  className={`input-width-20${
                    eventNameInvalid ? " invalid-input" : ""
                  }`}
                  name="event_name"
                  value={eventName}
                  maxLength={35}
                  onChange={(e) => {
                    setEventName(e.target.value);
                    setEventNameInvalid(false);
                  }}></input>
                {/* FORM - EVENT TYPE */}
                <label htmlFor="event_type">イベント種</label>
                <select
                  type="text"
                  id="event-type"
                  className={`input-width-15${
                    eventTypeInvalid ? " invalid-input" : ""
                  }`}
                  name="event_type"
                  value={eventType}
                  onChange={(e) => {
                    setEventType(e.target.value);
                    setEventTypeInvalid(false);
                  }}>
                  <option value="">-------</option>
                  {eventTypeChoices.map((eventType) => {
                    return (
                      <option
                        value={eventType.id}
                        key={`event-type-choice-${eventType.id}`}>
                        {eventType.name}
                      </option>
                    );
                  })}
                </select>
                {/* FORM - PRIMARY INSTRUCTOR */}
                <label htmlFor="primary-instructor">講師</label>
                <select
                  type="text"
                  id="primary-instructor"
                  className={`input-width-15${
                    primaryInstructorInvalid ? " invalid-input" : ""
                  }`}
                  name="primary_instructor"
                  value={primaryInstructor}
                  onChange={(e) => {
                    setPrimaryInstructor(e.target.value);
                    setPrimaryInstructorInvalid(false);
                  }}>
                  <option value="">-------</option>
                  {primaryInstructorChoices.map((instructor) => {
                    return (
                      <option
                        value={instructor.id}
                        key={`event-type-choice-${instructor.id}`}>
                        {instructor.userprofilesinstructors__last_name_kanji}
                        先生
                      </option>
                    );
                  })}
                </select>
                {/* FORM - DAY OF WEEK */}
                <label htmlFor="day_of_week">曜日</label>
                <select
                  type="text"
                  id="day-of-week"
                  className={`input-width-7${
                    dayOfWeekInvalid ? " invalid-input" : ""
                  }`}
                  name="day_of_week"
                  value={dayOfWeek}
                  onChange={(e) => {
                    setDayOfWeek(e.target.value);
                    setDayOfWeekInvalid(false);
                  }}>
                  <option value="">-------</option>
                  {dayOfWeekArray.map((day) => {
                    return (
                      <option
                        value={day[0]}
                        key={`event-type-choice-${day[0]}`}>
                        {day[1]}
                      </option>
                    );
                  })}
                </select>
                {/* FORM - START TIME */}
                <label htmlFor="start_time">開始時間</label>
                <input
                  type="time"
                  id="start-time"
                  className={`time-input${
                    startTimeInvalid ? " invalid-input" : ""
                  }`}
                  name="start_time"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    setStartTimeInvalid(false);
                  }}></input>
                <div className="bottom-buttons-container">
                  <Link
                    to="/staff/schedule/events/calendar/week-view/"
                    className="button cancel">
                    キャンセル
                  </Link>
                  <button type="submit" className="button submit">
                    作成
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <CalendarCreateToolbar disableToolbarButtons={disableToolbarButtons} />
    </Fragment>
  );
}

export default CalendarEventCreate;
