import React, { Fragment, useEffect, useState } from "react";
/* AXIOS */
import instance from "../axios/axios_authenticated";
/* CSS */
import "./Attendance.scss";
/* COMPONENTS  */
import AttendanceToolbar from "../toolbar/attendance/AttendanceToolbar";
import LoadingSpinner from "../micro/LoadingSpinner";
import DataLoadError from "../micro/DataLoadError";
import AttendanceUpdate from "./AttendanceUpdate";
import DateSelect from "./Attendance/DateSelect";
import AttendanceContainer from "./Attendance/AttendanceContainer";

function Attendance({ csrfToken, setBackButtonText, setBackButtonLink }) {
  /* ----------------------------------------------------- */
  /* ------------------ STATE FUNCTIONS ------------------ */
  /* ----------------------------------------------------- */

  const getDateToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  /* PAGE/DATA LOAD UI */
  const [disableToolbarButtons, setDisableToolbarButtons] = useState(true);
  const [disableDateNavigationButtons, setDisableDateNavigationButtons] =
    useState(true);
  const [showAttendanceContainer, setShowAttendanceContainer] = useState(true);
  const [showDateSearchButton, setShowDateSearchButton] = useState(false);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
  const [showDataLoadError, setShowDataLoadError] = useState(false);
  const [showAttendanceUpdateContainer, setShowAttendanceUpdateContainer] =
    useState(false);

  /* CHOICE LISTS */
  const [primaryInstructorChoices, setPrimaryInstructorChoices] = useState([]);
  const [eventChoices, setEventChoices] = useState([]);
  const [studentChoices, setStudentChoices] = useState([]);

  /* INSTRUCTOR */
  const [activePrimaryInstructor, setActivePrimaryInstructor] = useState(null);

  /* DATE */
  const [attendanceDate, setAttendanceDate] = useState(null);
  const [attendanceDateDisplay, setAttendanceDateDisplay] = useState(null);

  /* ATTENDANCE DATA */
  const [attendances, setAttendances] = useState([]);
  const [attendancesWithScheduleBreaks, setAttendancesWithScheduleBreaks] =
    useState([]);

  /* ATTENDANCE CREATE/UPDATE */
  const [attendanceSelectedId, setAttendanceSelectedId] = useState(null);
  const [eventIdSelected, setEventIdSelected] = useState(null);
  const [eventNameSelected, setEventNameSelected] = useState("");
  const [eventCapacitySelected, setEventCapacitySelected] = useState(0);
  const [eventDateSelected, setEventDateSelected] = useState(attendanceDate);
  const [attendanceStartTimeSelected, setAttendanceStartTimeSelected] =
    useState("");
  const [attendanceStudentsSelected, setAttendanceStudentsSelected] = useState(
    []
  );

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* SET BACK BUTTON TEXT AND LINK */
  useEffect(() => {
    setBackButtonText("出欠・日程");
    setBackButtonLink("/staff/attendance/day-view/");
  }, [setBackButtonText, setBackButtonLink]);

  /* FETCH USER PREFERENCES */
  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        await instance
          .get("api/attendance/attendance/user_preferences/")
          .then((response) => {
            if (response) {
              /* all user preferences */
              const userPreferences = response.data.user_preferences;

              /* selected primary instructor */
              const instructorId =
                userPreferences.pref_attendance_selected_instructor;
              const instructor = primaryInstructorChoices.find(
                (item) => item.id === instructorId
              );
              setActivePrimaryInstructor(instructor);

              /* selected date */
              const selectedDate =
                userPreferences.pref_attendance_selected_date;
              setAttendanceDate(selectedDate);
              setAttendanceDateDisplay(selectedDate);
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    /* drives code */
    if (primaryInstructorChoices.length > 0) {
      fetchUserPreferences();
    }
  }, [primaryInstructorChoices]);

  /* UPDATE USER PREFERENCES */
  const updateUserPreferences = async (userPreferencesArray) => {
    try {
      await instance
        .put(
          "api/attendance/attendance/user_preferences/",
          userPreferencesArray,
          {
            headers: {
              "X-CSRFToken": csrfToken,
            },
          }
        )
        .then((response) => {
          if (response) {
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  /* FETCH PRIMARY INSTRUCTOR CHOICES */
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

  /* FETCH EVENT CHOICES */
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

  /* FETCH STUDENT CHOICES */
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

  /* MANUAL FETCH ATTENDANCE DATA FOR DATE */
  const fetchAttendanceDataForDate = () => {
    /* clears existing attendances */
    setAttendances([]);

    /* hides data load error */
    setShowDataLoadError(false);

    /* disable toolbar buttons */
    setDisableToolbarButtons(true);

    /* disable date navigation buttons */
    setDisableDateNavigationButtons(true);

    /* show loading spinner */
    setShowLoadingSpinner(true);

    /* updates user preferences */
    updateUserPreferences({ pref_attendance_selected_date: attendanceDate });

    /* Fetch attendance data for date */
    const fetchData = async () => {
      /* parameters to include in the request */
      const params = {
        date: attendanceDate,
        instructor_id: activePrimaryInstructor.id,
      };

      try {
        await instance
          .get("api/attendance/attendance/single_date/", { params })
          .then((response) => {
            if (response) {
              /* set attendances */
              setAttendances(response.data.attendance);

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

  /* FETCH DATA ON DATE OR ACTIVE INSTRUCTOR CHANGE */
  useEffect(() => {
    /* clears existing attendances */
    setAttendances([]);

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
        instructor_id: activePrimaryInstructor.id,
      };

      try {
        await instance
          .get("api/attendance/attendance/single_date/", { params })
          .then((response) => {
            if (response) {
              /* set attendance records */
              setAttendances(response.data.attendance);

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
    if (activePrimaryInstructor) {
      /* drives code */
      fetchData();
    }
  }, [attendanceDate, activePrimaryInstructor]);

  /* SET START AND END TIME INTEGERS */
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

  /* DETECT AND GROUP OVERLAPPING ATTENDANCE */
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

  /* INSERTS SCHEDULE BREAK ELEMENTS BETWEEN LESSONS */
  const insertScheduleBreakElementsAndSort = (attendanceAll) => {
    /* attendance array by start time integer */
    attendanceAll.sort((a, b) => {
      if (a.startTimeInteger < b.startTimeInteger) return -1;
      if (a.startTimeInteger > b.startTimeInteger) return 1;
      return 0;
    });

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
          startTimeInteger: currentEventEndTimeInteger,
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

    /* sorts new array by start time integer */
    newArray.sort((a, b) => {
      if (a.startTimeInteger < b.startTimeInteger) return -1;
      if (a.startTimeInteger > b.startTimeInteger) return 1;
      return 0;
    });

    return newArray;
  };

  /* PROCESSES ATTENDANCE DATA */
  useEffect(() => {
    /* adds start and end time integers */
    setStartEndTimeIntegers(attendances);

    /* detects and groups overlapping attendance */
    detectAndGroupOverlappingAttendance(attendances);

    /* looks for gaps between lessons and inserts schedule break elements */
    setAttendancesWithScheduleBreaks(
      insertScheduleBreakElementsAndSort(attendances)
    );
  }, [attendances, setAttendancesWithScheduleBreaks]);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <section id="attendance">
        {/* Date Select */}
        <DateSelect
          csrfToken={csrfToken}
          attendanceDate={attendanceDate}
          setAttendanceDate={setAttendanceDate}
          showDateSearchButton={showDateSearchButton}
          setShowDateSearchButton={setShowDateSearchButton}
          attendanceDateDisplay={attendanceDateDisplay}
          setAttendanceDateDisplay={setAttendanceDateDisplay}
          showDataLoadError={showDataLoadError}
          setShowDataLoadError={setShowDataLoadError}
          disableDateNavigationButtons={disableDateNavigationButtons}
          setShowAttendanceContainer={setShowAttendanceContainer}
          setAttendances={setAttendances}
          getDateToday={getDateToday}
          fetchAttendanceDataForDate={fetchAttendanceDataForDate}
        />

        {/* Attendance Container */}
        <AttendanceContainer
          csrfToken={csrfToken}
          showAttendanceContainer={showAttendanceContainer}
          setShowAttendanceUpdateContainer={setShowAttendanceUpdateContainer}
          attendances={attendances}
          attendancesWithScheduleBreaks={attendancesWithScheduleBreaks}
          attendanceDate={attendanceDate}
          setEventIdSelected={setEventIdSelected}
          setEventDateSelected={setEventDateSelected}
          setEventNameSelected={setEventNameSelected}
          setEventCapacitySelected={setEventCapacitySelected}
          setEventStartTimeSelected={setAttendanceStartTimeSelected}
          setAttendanceStudentsSelected={setAttendanceStudentsSelected}
          setAttendanceSelectedId={setAttendanceSelectedId}
        />

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
      {showAttendanceUpdateContainer ? (
        <AttendanceUpdate
          csrfToken={csrfToken}
          setShowAttendanceUpdateContainer={setShowAttendanceUpdateContainer}
          eventChoices={eventChoices}
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
          activePrimaryInstructor={activePrimaryInstructor}
          attendanceStudentsSelected={attendanceStudentsSelected}
          setAttendanceStudentsSelected={setAttendanceStudentsSelected}
          attendances={attendances}
          setAttendances={setAttendances}
          attendanceSelectedId={attendanceSelectedId}
          primaryInstructorChoices={primaryInstructorChoices}
        />
      ) : null}

      {/* Attendance Toolbar */}
      <AttendanceToolbar
        csrfToken={csrfToken}
        disableToolbarButtons={disableToolbarButtons}
        activePrimaryInstructor={activePrimaryInstructor}
        setActivePrimaryInstructor={setActivePrimaryInstructor}
        primaryInstructorChoices={primaryInstructorChoices}
        attendanceDate={attendanceDate}
        attendanceDateDisplay={attendanceDateDisplay}
        setAttendanceDate={setAttendanceDate}
        setShowAttendanceUpdateContainer={setShowAttendanceUpdateContainer}
      />
    </Fragment>
  );
}

export default Attendance;
