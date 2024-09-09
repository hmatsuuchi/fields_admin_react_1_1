import React, { Fragment, useEffect, useState } from "react";
/* Axios */
import instance from "../axios/axios_authenticated";
/* CSS */
import "./Attendance.scss";
/* Components  */
import AttendanceToolbar from "../toolbar/attendance/AttendanceToolbar";

/* COMPONENTS - ATTENDANCE */
function Attendance({ csrfToken }) {
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

  /* ------------------------------------------ */
  /* ----------- ATTENDANCE - STATE ----------- */
  /* ------------------------------------------ */

  /* ATTENDANCE - STATE - PAGE/DATA LOAD UI */
  const [disableToolbarButtons, setDisableToolbarButtons] = useState(true);
  const [searching, setSearching] = useState(false);
  /* ATTENDANCE - STATE - DATE */
  const [attendanceDate, setAttendanceDate] = useState(getDateToday());
  const [attendanceDateBuffer, setAttendanceDateBuffer] = useState(
    getDateToday()
  );
  const [dateInputTimeoutFunction, setDateInputTimeoutFunction] =
    useState(null);
  /* ATTENDANCE - STATE - ATTENDANCE DATA */
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [
    attendanceRecordsWithScheduleBreaks,
    setAttendanceRecordsWithScheduleBreaks,
  ] = useState([]);

  /* ---------------------------------------------- */
  /* ----------- ATTENDANCE - FUNCTIONS ----------- */
  /* ---------------------------------------------- */

  /* ATTENDANCE - FUNCTIONS - FETCH ATTENDANCE DATA FOR SPECIFIED DATE */
  useEffect(() => {
    /* Fetch attendance data for date */
    const fetchAttendanceDataForDate = async () => {
      /* parameters to include in the request */
      const params = {
        date: attendanceDate,
        instructor_id: 4 /* temporary instructor ID set to hmatsuuchi */,
      };

      try {
        await instance
          .get("api/attendance/attendance/single_date/", { params })
          .then((response) => {
            if (response) {
              /* set attendance records */
              setAttendanceRecords(response.data.attendance);

              /* disables searching boolean when server responds with data */
              setSearching(false);

              console.log("=============================");
              console.log(attendanceDate);
              console.log(response.data.attendance);
              console.log("-----------------------------");
            }
          });
      } catch (e) {
        console.log(e);
      }
    };
    /* drives code */
    fetchAttendanceDataForDate();

    /* enable toolbar buttons */
    setDisableToolbarButtons(false);
  }, [attendanceDate]);

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
    /* clear existing records */
    if (attendanceRecords.length > 0) {
      setAttendanceRecords([]);
    }

    /* set buffer */
    setAttendanceDateBuffer(event.target.value);

    /* clear existing timeout functions */
    if (dateInputTimeoutFunction) {
      clearTimeout(dateInputTimeoutFunction);
    }

    /* sets timeout function to run search of records for a particular date */
    const newDateInputTimeoutFunction = setTimeout(() => {
      /* set searching boolean */
      setSearching(true);

      /* blur date input */
      event.target.blur();

      /* set input date after specified time has elapsed; this allows user to arrow through or manually type the date withou making requests to the server on every keystroke */
      setAttendanceDate(event.target.value);
    }, 1000);

    /* set new timeout function */
    setDateInputTimeoutFunction(newDateInputTimeoutFunction);
  };
  /* ---------------------------------------- */
  /* ----------- ATTENDANCE - JSX ----------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <section id="attendance">
        <div id="date-select-container">
          <input
            className={searching ? "searching" : ""}
            type="date"
            value={attendanceDateBuffer}
            onChange={handleDateInputChange}></input>
        </div>
        <div id="attendance-container">
          {attendanceRecordsWithScheduleBreaks.map((record) =>
            !record.isScheduleBreak ? (
              <div className="attendance" key={`attedance-${record.id}`}>
                <div>{record.linked_class.event_name}</div>
                <div>{record.start_time.slice(0, 5)}</div>
                <div>
                  {`${record.instructor.userprofilesinstructors.last_name_romaji}, ${record.instructor.userprofilesinstructors.first_name_romaji}`}
                </div>
                <div className="attendance-records-container">
                  {record.attendance_records.map((attendanceRecord) => (
                    <div
                      className="attendance-record"
                      key={`attendance-record-${attendanceRecord.id}`}>
                      <div className="student-name-kanji">
                        {`${attendanceRecord.student.last_name_kanji}, ${attendanceRecord.student.first_name_kanji} (${attendanceRecord.student.grade_verbose})`}
                      </div>
                      <div className="student-name-katakana">{`${attendanceRecord.student.last_name_katakana} ${attendanceRecord.student.first_name_katakana}`}</div>
                      <div className="student-attendance-status">
                        {`[${attendanceRecord.status}]`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className="schedule-break-container"
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
      </section>
      <AttendanceToolbar disableToolbarButtons={disableToolbarButtons} />
    </Fragment>
  );
}

export default Attendance;
