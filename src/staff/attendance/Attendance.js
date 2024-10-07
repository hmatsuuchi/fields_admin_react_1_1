import React, { Fragment, useEffect, useState } from "react";
/* Axios */
import instance from "../axios/axios_authenticated";
/* CSS */
import "./Attendance.scss";
/* Components  */
import AttendanceToolbar from "../toolbar/attendance/AttendanceToolbar";
import LoadingSpinner from "../micro/LoadingSpinner";
import DataLoadError from "../micro/DataLoadError";
import AttendanceCreateUpdate from "./AttendanceCreateUpdate";
/* React Router DOM */
import { useNavigate } from "react-router-dom";

/* COMPONENTS - ATTENDANCE */
function Attendance({ csrfToken, setBackButtonText, setBackButtonLink }) {
  /* ---------------------------------------------------- */
  /* ----------- ATTENDANCE - STATE FUNCTIONS ----------- */
  /* ---------------------------------------------------- */

  const getDateToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getDayOfWeekText = (date) => {
    const dayOfWeek = new Date(date).getDay();
    const daysOfWeek = {
      0: "日曜日",
      1: "月曜日",
      2: "火曜日",
      3: "水曜日",
      4: "木曜日",
      5: "金曜日",
      6: "土曜日",
    };
    return daysOfWeek[dayOfWeek] || "";
  };

  /* ------------------------------------------ */
  /* ----------- ATTENDANCE - STATE ----------- */
  /* ------------------------------------------ */

  /* ATTENDANCE - STATE - PAGE/DATA LOAD UI */
  const [disableToolbarButtons, setDisableToolbarButtons] = useState(true);
  const [disableDateNavigationButtons, setDisableDateNavigationButtons] =
    useState(true);
  const [disableAttendance, setDisableAttendance] = useState(false);
  const [showAttendanceContainer, setShowAttendanceContainer] = useState(true);
  const [showDateSearchButton, setShowDateSearchButton] = useState(false);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
  const [showDataLoadError, setShowDataLoadError] = useState(false);
  const [
    showAttendanceCreateUpdateContainer,
    setShowAttendanceCreateUpdateContainer,
  ] = useState(false);

  /* ATTENDANCE - STATE - CHOICE LISTS */
  const [primaryInstructorChoices, setPrimaryInstructorChoices] = useState([]);
  const [eventChoices, setEventChoices] = useState([]);
  const [studentChoices, setStudentChoices] = useState([]);

  /* ATTENDANCE - STATE - INSTRUCTOR */
  const [activePrimaryInstructorId, setActivePrimaryInstructorId] =
    useState(null);

  /* ATTENDANCE - STATE - DATE */
  const [attendanceDate, setAttendanceDate] = useState(getDateToday());
  const [attendanceDateDisplay, setAttendanceDateDisplay] = useState(
    getDateToday()
  );
  const [dayOfWeekText, setDayOfWeekText] = useState(
    getDayOfWeekText(getDateToday())
  );

  /* ATTENDANCE - STATE - ATTENDANCE DATA */
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [
    attendanceRecordsWithScheduleBreaks,
    setAttendanceRecordsWithScheduleBreaks,
  ] = useState([]);

  /* ATTENDANCE - STATE - ATTENDANCE CREATE/UPDATE */
  const [eventIdSelected, setEventIdSelected] = useState(null);
  const [eventNameSelected, setEventNameSelected] = useState("");
  const [eventCapacitySelected, setEventCapacitySelected] = useState(0);
  const [eventDateSelected] = useState(attendanceDate);
  const [attendanceStartTimeSelected, setAttendanceStartTimeSelected] =
    useState("");
  // const [attendancePrimaryInstructorSelected] = useState(
  //   activePrimaryInstructorId
  // );
  const [attendanceStudentsSelected, setAttendanceStudentsSelected] = useState(
    []
  );

  /* ---------------------------------------------- */
  /* ----------- ATTENDANCE - FUNCTIONS ----------- */
  /* ---------------------------------------------- */

  /* ATTENDANCE - FUNCTIONS - SET BACK BUTTON TEXT AND LINK */
  useEffect(() => {
    setBackButtonText("出欠・日程");
    setBackButtonLink("/staff/attendance/day-view/");
  }, [setBackButtonText, setBackButtonLink]);

  /* ATTENDANCE - FUNCTIONS - FETCH USER PREFERENCES */
  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        await instance
          .get("api/attendance/attendance/user_preferences/")
          .then((response) => {
            if (response) {
              setActivePrimaryInstructorId(
                response.data.user_preferences
                  .pref_attendance_selected_instructor
              );
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    /* drives code */
    fetchUserPreferences();
  }, []);

  /* ATTENDANCE - FUNCTIONS - FETCH INSTRUCTOR CHOICES */
  useEffect(() => {
    const fetchPrimaryInstructorChoices = async () => {
      try {
        await instance
          .get("api/attendance/attendance/instructor_choices/")
          .then((response) => {
            if (response) {
              /* primary instructor choices */
              setPrimaryInstructorChoices(
                response.data.primary_instructor_choices
              );
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    /* drives code */
    fetchPrimaryInstructorChoices();
  }, []);

  /* ATTENDANCE - FUNCTIONS - FETCH EVENT CHOICES */
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

  /* ATTENDANCE - FUNCTIONS - FETCH STUDENT CHOICES */
  useEffect(() => {
    const fetchStudentChoices = async () => {
      try {
        await instance
          .get("api/attendance/attendance/student_choices/")
          .then((response) => {
            if (response) {
              /* primary instructor choices */
              setStudentChoices(response.data.student_choices);
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    /* drives code */
    fetchStudentChoices();
  }, []);

  /* ATTENDANCE - FUNCTIONS - MANUAL FETCH ATTENDANCE DATA FOR DATE */
  const fetchAttendanceDataForDate = () => {
    /* clears existing attendance records */
    setAttendanceRecords([]);

    /* hides data load error */
    setShowDataLoadError(false);

    /* disable toolbar buttons */
    setDisableToolbarButtons(true);

    /* disable date navigation buttons */
    setDisableDateNavigationButtons(true);

    /* show loading spinner */
    setShowLoadingSpinner(true);

    /* Fetch attendance data for date */
    const fetchData = async () => {
      /* parameters to include in the request */
      const params = {
        date: attendanceDate,
        instructor_id: activePrimaryInstructorId,
      };

      try {
        await instance
          .get("api/attendance/attendance/single_date/", { params })
          .then((response) => {
            if (response) {
              /* set attendance records */
              setAttendanceRecords(response.data.attendance);

              /* hide loading spinner */
              setShowLoadingSpinner(false);

              /* enable date navigation buttons */
              setDisableDateNavigationButtons(false);

              /* enable toolbar buttons */
              setDisableToolbarButtons(false);

              /* show attendance container */
              setShowAttendanceContainer(true);
            }
          });
      } catch (e) {
        console.log(e);
        /* hides attendance container */
        setShowAttendanceContainer(false);

        /* show data load error message */
        setShowDataLoadError(true);

        /* hide loading spinner */
        setShowLoadingSpinner(false);

        /* enable date navigation buttons */
        setDisableDateNavigationButtons(false);

        /* enable toolbar buttons */
        setDisableToolbarButtons(false);
      }
    };
    /* drives code */
    fetchData();
  };

  /* ATTENDANCE - FUNCTIONS - FETCH DATA ON DATE OR ACTIVE INSTRUCTOR CHANGE */
  useEffect(() => {
    /* clears existing attendance records */
    setAttendanceRecords([]);

    /* hides date search button */
    setShowDateSearchButton(false);

    /* hides attendance container */
    setShowAttendanceContainer(false);

    /* hides data load error */
    setShowDataLoadError(false);

    /* disable toolbar buttons */
    setDisableToolbarButtons(true);

    /* disable date navigation buttons */
    setDisableDateNavigationButtons(true);

    /* show loading spinner */
    setShowLoadingSpinner(true);

    /* Fetch attendance data for date */
    const fetchData = async () => {
      /* parameters to include in the request */
      const params = {
        date: attendanceDate,
        instructor_id: activePrimaryInstructorId,
      };

      try {
        await instance
          .get("api/attendance/attendance/single_date/", { params })
          .then((response) => {
            if (response) {
              /* set attendance records */
              setAttendanceRecords(response.data.attendance);

              /* hide loading spinner */
              setShowLoadingSpinner(false);

              /* enable date navigation buttons */
              setDisableDateNavigationButtons(false);

              /* enable toolbar buttons */
              setDisableToolbarButtons(false);

              /* show attendance container */
              setShowAttendanceContainer(true);
            }
          });
      } catch (e) {
        console.log(e);
        /* hides attendance container */
        setShowAttendanceContainer(false);

        /* show data load error message */
        setShowDataLoadError(true);

        /* hide loading spinner */
        setShowLoadingSpinner(false);

        /* enable date navigation buttons */
        setDisableDateNavigationButtons(false);

        /* enable toolbar buttons */
        setDisableToolbarButtons(false);
      }
    };

    /* only drives code if active instructor ID exists */
    if (activePrimaryInstructorId) {
      /* drives code */
      fetchData();
    }
  }, [attendanceDate, activePrimaryInstructorId]);

  /* ATTENDANCE - FUNCTIONS - SET START AND END TIME INTEGERS */
  const setStartEndTimeIntegers = (attendanceAll) => {
    /* uses start time and class length to calculate starting and ending hour/minute integers */
    attendanceAll.forEach((attendance) => {
      /* calculates start time integer by muliplying hours by 60 and adding minutes */
      const startTime = attendance.start_time;
      const startTimeInteger =
        parseInt(startTime.slice(0, 2)) * 60 + parseInt(startTime.slice(3, 5));

      /* sets start time integer */
      attendance.startTimeInteger = startTimeInteger;
      /* sets end time integer by adding start time integer to class duration */
      attendance.endTimeInteger =
        startTimeInteger + attendance.linked_class.event_type.duration;
    });
  };

  /* ATTENDANCE - FUNCTIONS - DETECT AND GROUP OVERLAPPING ATTENDANCE */
  const detectAndGroupOverlappingAttendance = (attendanceAll) => {
    attendanceAll.forEach((attendance) => {
      attendanceAll.forEach((attendanceToCheck) => {
        if (
          attendance.startTimeInteger < attendanceToCheck.endTimeInteger &&
          attendance.endTimeInteger > attendanceToCheck.startTimeInteger &&
          attendance.id !== attendanceToCheck.id
        ) {
          attendance.overlapping = true;
        }
      });
    });
  };

  /* ATTENDANCE - FUNCTIONS - INSERTS SCHEDULE BREAK ELEMENTS BETWEEN LESSONS */
  const insertScheduleBreakElements = (attendanceAll) => {
    /* new array to hold new elements */
    let newArray = [];

    /* iterates through the array of events but does not include last element in array */
    for (let i = 0; i < attendanceAll.length - 1; i++) {
      const currentEvent = attendanceAll[i];
      const nextEvent = attendanceAll[i + 1];

      const currentEventEndTimeInteger = currentEvent.endTimeInteger;
      const nextEventStartTimeInteger = nextEvent.startTimeInteger;

      if (currentEventEndTimeInteger < nextEventStartTimeInteger) {
        /* creates a new element to insert between the two events */
        const scheduleBreakElement = {
          id: i,
          isScheduleBreak: true,
          breakDuration: nextEventStartTimeInteger - currentEventEndTimeInteger,
        };

        /* pushes current event and schedule break element to new array */
        newArray.push(currentEvent);
        newArray.push(scheduleBreakElement);
      } else {
        /* if no time gap exists between elements, pushes current event to new array */
        newArray.push(currentEvent);
      }
    }

    /* pushes last element in array to new array only if at least one element exists in array */
    if (attendanceAll.length > 0) {
      newArray.push(attendanceAll[attendanceAll.length - 1]);
    }

    return newArray;
  };

  /* ATTENDANCE - FUNCTIONS - PROCESSES ATTENDANCE DATA */
  useEffect(() => {
    /* adds start and end time integers */
    setStartEndTimeIntegers(attendanceRecords);

    /* detects and groups overlapping attendance */
    detectAndGroupOverlappingAttendance(attendanceRecords);

    /* looks for gaps between lessons and inserts schedule break elements */
    setAttendanceRecordsWithScheduleBreaks(
      insertScheduleBreakElements(attendanceRecords)
    );
  }, [attendanceRecords, setAttendanceRecordsWithScheduleBreaks]);

  /* ATTENDANCE - FUNCTIONS - HANDLE DATE INPUT CHANGE */
  const handleDateInputChange = (event) => {
    /* hides attendance container */
    setShowAttendanceContainer(false);

    /* hides data load error */
    showDataLoadError && setShowDataLoadError(false);

    /* sets date display */
    setAttendanceDateDisplay(event.target.value);

    /* clears existing attendance records */
    setAttendanceRecords([]);

    /* changes day of week text */
    setDayOfWeekText(getDayOfWeekText(event.target.value));

    /* shows date search button */
    setShowDateSearchButton(true);
  };

  /* ATTENDANCE - FUNCTIONS - HANDLE DATE SEARCH BUTTON CLICK */
  const handleDateSearchButtonClick = () => {
    /* sets attendance date to display date if not already equal */
    if (attendanceDate !== attendanceDateDisplay) {
      setAttendanceDate(attendanceDateDisplay);
    } else {
      fetchAttendanceDataForDate();
    }

    /* hides date search button */
    setShowDateSearchButton(false);
  };

  /* ATTENDANCE - FUNCTIONS - HANDLE CLICKS TO DATE ARROW PREVIOUS */
  const handleClicksToDateArrowPrevious = () => {
    const updateDateValues = (date) => {
      setAttendanceDate(date.toISOString().split("T")[0]);
      setAttendanceDateDisplay(date.toISOString().split("T")[0]);
      setDayOfWeekText(getDayOfWeekText(date));
      setShowDateSearchButton(false);
    };

    try {
      const date = new Date(attendanceDateDisplay);
      date.setDate(date.getDate() - 1);

      updateDateValues(date);
    } catch (e) {
      console.error(e);
      const date = new Date();

      updateDateValues(date);
    }
  };

  /* ATTENDANCE - FUNCTIONS - HANDLE CLICKS TO DATE ARROW NEXT */
  const handleClicksToDateArrowNext = () => {
    const updateDateValues = (date) => {
      setAttendanceDate(date.toISOString().split("T")[0]);
      setAttendanceDateDisplay(date.toISOString().split("T")[0]);
      setDayOfWeekText(getDayOfWeekText(date));
      setShowDateSearchButton(false);
    };

    try {
      const date = new Date(attendanceDateDisplay);
      date.setDate(date.getDate() + 1);

      updateDateValues(date);
    } catch (e) {
      console.error(e);
      const date = new Date();

      updateDateValues(date);
    }
  };

  /* ATTENDANCE - FUNCTIONS - ATTENDANCE STATUS INTEGER TO CSS CLASS */
  const attendanceStatusIntegerToCssClass = (status) => {
    switch (status) {
      case 2:
        return "pending";
      case 3:
        return "present";
      case 4:
        return "absent";
      default:
        return "no-data";
    }
  };

  /* ATTENDANCE - FUNCTIONS - TOGGLE ATTENDANCE STATUS */
  const toggleAttendanceStatus = (e) => {
    /* disables all clicks to attendance records */
    setDisableAttendance(true);

    /* gets attendance record ID */
    const attendanceRecordId = parseInt(e.target.dataset.attendance_record_id);

    /* gets attendance status integer */
    const attendanceStatus = parseInt(
      e.target.dataset.attendance_status_integer
    );

    /* sets new attendance status integer and CSS class */
    if (attendanceStatus === 2) {
      e.target.classList.remove("pending");
      e.target.classList.add("present");
      e.target.dataset.attendance_status_integer = 3;
    } else if (attendanceStatus === 3) {
      e.target.classList.remove("present");
      e.target.classList.add("absent");
      e.target.dataset.attendance_status_integer = 4;
    } else if (attendanceStatus === 4) {
      e.target.classList.remove("absent");
      e.target.classList.add("pending");
      e.target.dataset.attendance_status_integer = 2;
    }

    /* updates attendance record status on backend */
    const data = {
      attendance_record_id: attendanceRecordId,
      attendance_record_status_id: e.target.dataset.attendance_status_integer,
    };

    const updateAttendanceRecordStatus = async () => {
      try {
        await instance
          .put(
            "api/attendance/attendance/update_attendance_record_status/",
            data,
            {
              headers: {
                "X-CSRFToken": csrfToken,
              },
            }
          )
          .then((response) => {
            if (response) {
              /* enables clicks to attendance records */
              setDisableAttendance(false);
            }
          });
      } catch (e) {
        /* enables clicks to attendance records */
        setDisableAttendance(false);

        console.log(e);
        window.alert("An error occurred.");
      }
    };

    /* drives code */
    updateAttendanceRecordStatus();
  };

  /* ATTENDANCE - FUNCTIONS - HANDLE CLICKS TO STUDENT NAME */
  const navigate = useNavigate();
  const handleClicksToStudentName = (e) => {
    const studentId = e.target.dataset.student_id;
    navigate(`/staff/students/profiles/details/${studentId}`);
  };

  /* ATTENDANCE - FUNCTIONS - HANDLE CLICKS TO ATTENDANCE */
  const handleClicksToAttendance = (e) => {
    /* gets attendance record */
    const attendanceId = e.target.dataset.attendance_id;
    const attendanceRecord = attendanceRecords.find((record) => {
      return record.id === parseInt(attendanceId);
    });

    /* sets attendance record values */
    setEventIdSelected(attendanceRecord.linked_class.id);

    /* toggles attendance update container visibility */
    setShowAttendanceCreateUpdateContainer(true);
  };

  /* ATTENDANCE - FUNCTIONS - REMOVE LEADING ZEROS FROM STRINGS */
  const removeLeadingZeroFromString = (str) => {
    return str.replace(/^0+/, "");
  };

  /* ---------------------------------------- */
  /* ----------- ATTENDANCE - JSX ----------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <section id="attendance">
        {/* Date Select Container */}
        <div
          id="date-select-container"
          className={disableDateNavigationButtons ? "disable-clicks" : ""}>
          <div
            className="date-arrow previous"
            onClick={handleClicksToDateArrowPrevious}></div>
          <input
            type="date"
            value={attendanceDateDisplay}
            onChange={handleDateInputChange}></input>
          <div
            className="date-arrow next"
            onClick={handleClicksToDateArrowNext}></div>
          <div className="day-of-week-text">{dayOfWeekText}</div>
          {showDateSearchButton ? (
            <button onClick={handleDateSearchButtonClick}>
              データを読み込み
            </button>
          ) : null}
        </div>
        {/* Attendance Container */}
        {showAttendanceContainer ? (
          <div
            id="attendance-container"
            className={disableAttendance ? "disable-clicks" : null}>
            {attendanceRecordsWithScheduleBreaks.map((record) =>
              !record.isScheduleBreak ? (
                <div className="attendance card" key={`attedance-${record.id}`}>
                  <div
                    className="primary-instructor-icon"
                    style={{
                      backgroundImage: `url(/img/instructors/${record.instructor.userprofilesinstructors.icon_stub})`,
                    }}></div>
                  <div
                    className="section-title-container"
                    data-attendance_id={record.id}
                    onClick={handleClicksToAttendance}>
                    <div className="class-name">
                      {record.linked_class.event_name}
                    </div>
                    <div className="three-dots-container">
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                    </div>
                    <div className="class-start-time">
                      {removeLeadingZeroFromString(
                        record.start_time.slice(0, 5)
                      )}
                    </div>
                  </div>
                  <div className="attendance-records-container">
                    {record.attendance_records.map((attendanceRecord) => (
                      <div
                        className="attendance-record"
                        key={`attendance-record-${attendanceRecord.id}`}>
                        <div
                          className="student-name-kanji"
                          data-student_id={attendanceRecord.student.id}
                          onClick={handleClicksToStudentName}>
                          {`${attendanceRecord.student.last_name_kanji} ${attendanceRecord.student.first_name_kanji} (${attendanceRecord.student.grade_verbose})`}
                        </div>
                        <div
                          className="student-name-katakana"
                          data-student_id={attendanceRecord.student.id}
                          onClick={
                            handleClicksToStudentName
                          }>{`${attendanceRecord.student.last_name_katakana} ${attendanceRecord.student.first_name_katakana}`}</div>
                        <div
                          className={`student-attendance-status ${attendanceStatusIntegerToCssClass(
                            attendanceRecord.status
                          )}`}
                          data-attendance_record_id={attendanceRecord.id}
                          data-attendance_status_integer={
                            attendanceRecord.status
                          }
                          onClick={toggleAttendanceStatus}></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className="schedule-break-container card"
                  key={`schedule-break-${record.id}`}
                  style={{ minHeight: `${record.breakDuration / 8}rem` }}>
                  <div>
                    {Math.floor(record.breakDuration / 60)}:
                    {record.breakDuration % 60}
                  </div>
                </div>
              )
            )}
          </div>
        ) : null}

        {/* Loading Spinner */}
        {showLoadingSpinner ? <LoadingSpinner /> : null}

        {/* Data Load Error */}
        {showDataLoadError ? (
          <DataLoadError
            errorMessage={"エラーが発生されました"}
            retryFunction={fetchAttendanceDataForDate}
          />
        ) : null}
      </section>

      {/* Attendance Create/Update Container */}
      {showAttendanceCreateUpdateContainer ? (
        <AttendanceCreateUpdate
          csrfToken={csrfToken}
          setShowAttendanceCreateUpdateContainer={
            setShowAttendanceCreateUpdateContainer
          }
          eventChoices={eventChoices}
          activePrimaryInstructorLastNameKanji={
            primaryInstructorChoices.find(
              (instructor) => instructor.id === activePrimaryInstructorId
            )?.userprofilesinstructors.last_name_kanji
          }
          studentChoices={studentChoices}
          eventIdSelected={eventIdSelected}
          setEventIdSelected={setEventIdSelected}
          eventNameSelected={eventNameSelected}
          setEventNameSelected={setEventNameSelected}
          eventCapacitySelected={eventCapacitySelected}
          setEventCapacitySelected={setEventCapacitySelected}
          eventDateSelected={eventDateSelected}
          attendanceStartTimeSelected={attendanceStartTimeSelected}
          setAttendanceStartTimeSelected={setAttendanceStartTimeSelected}
          activePrimaryInstructorId={activePrimaryInstructorId}
          attendanceStudentsSelected={attendanceStudentsSelected}
          setAttendanceStudentsSelected={setAttendanceStudentsSelected}
        />
      ) : null}

      {/* Attendance Toolbar */}
      <AttendanceToolbar
        disableToolbarButtons={disableToolbarButtons}
        activePrimaryInstructorId={activePrimaryInstructorId}
        setActivePrimaryInstructorId={setActivePrimaryInstructorId}
        primaryInstructorChoices={primaryInstructorChoices}
        attendanceDateDisplay={attendanceDateDisplay}
        setAttendanceDate={setAttendanceDate}
        setShowAttendanceCreateUpdateContainer={
          setShowAttendanceCreateUpdateContainer
        }
      />
    </Fragment>
  );
}

export default Attendance;
