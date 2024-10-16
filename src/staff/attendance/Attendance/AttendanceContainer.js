import React, { useState } from "react";
/* Axios */
import instance from "../../axios/axios_authenticated";
/* CSS */
import "./AttendanceContainer.scss";
/* React Router DOM */
import { useNavigate } from "react-router-dom";

function AttendanceContainer({
  csrfToken,
  attendanceRecords,
  attendanceRecordsWithScheduleBreaks,
  showAttendanceContainer,
  setShowAttendanceCreateUpdateContainer,
  setEventIdSelected,
}) {
  /* ---------------------------------------------- */
  /* ------------- ATTENDANCE - STATE ------------- */
  /* ---------------------------------------------- */

  const [disableAttendance, setDisableAttendance] = useState(false);

  /* ---------------------------------------------- */
  /* -----------------  FUNCTIONS ----------------- */
  /* ---------------------------------------------- */

  /* HANDLE CLICKS TO ATTENDANCE */
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

  /* REMOVE LEADING ZEROS FROM STRINGS */
  const removeLeadingZeroFromString = (str) => {
    return str.replace(/^0+/, "");
  };

  /* HANDLE CLICKS TO STUDENT NAME */
  const navigate = useNavigate();
  const handleClicksToStudentName = (e) => {
    const studentId = e.target.dataset.student_id;
    navigate(`/staff/students/profiles/details/${studentId}`);
  };

  /* ATTENDANCE STATUS INTEGER TO CSS CLASS */
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

  /* TOGGLE ATTENDANCE STATUS */
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

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return showAttendanceContainer ? (
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
              <div className="class-name">{record.linked_class.event_name}</div>
              <div className="three-dots-container">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <div className="class-start-time">
                {removeLeadingZeroFromString(record.start_time.slice(0, 5))}
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
                    data-attendance_status_integer={attendanceRecord.status}
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
  ) : null;
}

export default AttendanceContainer;
