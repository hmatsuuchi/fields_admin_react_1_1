import React from "react";
/* Axios */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./AttendanceContainer.scss";
/* React Router DOM */
import { useNavigate } from "react-router-dom";
/* timeout id for updateAttendanceRecordStatus*/
let timeoutMap = new Map();

function AttendanceContainer({
  csrfToken,
  attendances,
  setAttendances,
  attendancesWithScheduleBreaks,
  showAttendanceContainer,
  setShowAttendanceUpdateContainer,
  attendanceDate,
  setAttendanceSelectedId,
  setEventIdSelected,
  setEventDateSelected,
  setEventNameSelected,
  setEventCapacitySelected,
  setEventStartTimeSelected,
  setAttendanceStudentsSelected,
  setBackButtonText,
  setBackButtonLink,
}) {
  /* ---------------------------------------------- */
  /* ------------- ATTENDANCE - STATE ------------- */
  /* ---------------------------------------------- */

  /* ---------------------------------------------- */
  /* -----------------  FUNCTIONS ----------------- */
  /* ---------------------------------------------- */

  /* HANDLE CLICKS TO ATTENDANCE */
  const handleClicksToAttendance = (e) => {
    /* gets attendance record */
    const attendanceId = e.target.dataset.attendance_id;
    const attendance = attendances.find((record) => {
      return record.id === parseInt(attendanceId);
    });

    /* sets attendance record */
    setAttendanceSelectedId(attendance.id);

    /* sets attendance id */
    setEventIdSelected(attendance.linked_class.id);

    /* sets attendance start time */
    setEventStartTimeSelected(attendance.start_time);

    /* sets event name */
    setEventNameSelected(attendance.linked_class.event_name);

    /* sets attendance date */
    setEventDateSelected(attendanceDate);

    /* sets event capacity */
    setEventCapacitySelected(attendance.linked_class.event_type.capacity);

    /* sets attendance students */
    setAttendanceStudentsSelected(
      attendance.attendance_records
        .sort((a, b) => {
          if (a.student.id > b.student.id) return -1;
          if (a.student.id < b.student.id) return 1;
          return 0;
        })
        .map((record) => ({
          ...record.student,
        }))
    );

    /* toggles attendance update container visibility */
    setShowAttendanceUpdateContainer(true);
  };

  /* REMOVE LEADING ZEROS FROM STRINGS */
  const removeLeadingZeroFromString = (str) => {
    return str.replace(/^0+/, "");
  };

  /* HANDLE CLICKS TO STUDENT NAME */
  const navigate = useNavigate();
  const handleClicksToStudentName = (e) => {
    /* set back button text and link */
    setBackButtonText("出欠・日程");
    setBackButtonLink("/staff/attendance/day-view/");
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
    /* gets attendance record ID */
    const attendanceRecordId = parseInt(e.target.dataset.attendance_record_id);

    /* duplicates attendance records and updates status value */
    let updatedRecordStatusValue = 0;
    const updatedAttendanceRecords = attendances.map((attendance) => {
      return {
        ...attendance,
        attendance_records: attendance.attendance_records.map((record) => {
          if (record.id === attendanceRecordId) {
            updatedRecordStatusValue =
              record.status === 2 ? 3 : record.status === 3 ? 4 : 2;
            return {
              ...record,
              status: (record.status = updatedRecordStatusValue),
            };
          } else {
            return record;
          }
        }),
      };
    });

    /* sets updated attendance records */
    setAttendances(updatedAttendanceRecords);

    /* updates attendance record status on backend */
    const data = {
      attendance_record_id: attendanceRecordId,
      attendance_record_status_id: updatedRecordStatusValue,
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
            if (response.status === 200) {
              // rerun analysis of student's attendance records to predict churn
              const anylizeStudentToPredictChurn = async () => {
                try {
                  await instance.get(
                    `api/analytics/analytics/ml_predict_for_attendance_record/${attendanceRecordId}/`,
                    data,
                    {
                      headers: {
                        "X-CSRFToken": csrfToken,
                      },
                    }
                  );
                } catch (error) {
                  console.error(
                    "Error predicting churn for student based on attendance record:",
                    error
                  );
                }
              };

              // drives code
              anylizeStudentToPredictChurn();
            }
          });
      } catch (e) {
        console.log(e);
        window.alert("エラーが発生しました。");
      }
    };

    // clear the previous timeout
    if (timeoutMap.has(attendanceRecordId)) {
      clearTimeout(timeoutMap.get(attendanceRecordId));
    }

    // set a new timeout
    const newTimeoutId = setTimeout(() => {
      updateAttendanceRecordStatus();
      timeoutMap.delete(attendanceRecordId);
    }, 1000);

    // store the new timeout ID in the map
    timeoutMap.set(attendanceRecordId, newTimeoutId);
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return showAttendanceContainer ? (
    <div id="attendance-container">
      {attendancesWithScheduleBreaks.map((record) =>
        !record.isScheduleBreak ? (
          <div className="attendance card" key={`attedance-${record.id}`}>
            <div
              className="more-info-container"
              data-attendance_id={record.id}
              onClick={handleClicksToAttendance}
            ></div>
            <div
              className="primary-instructor-icon"
              style={{
                backgroundImage: `url(/img/instructors/${record.instructor.userprofilesinstructors.icon_stub})`,
              }}
            ></div>
            <div
              className="section-title-container"
              data-attendance_id={record.id}
              onClick={handleClicksToAttendance}
            >
              <div className="class-name">{record.linked_class.event_name}</div>
              <div className="class-start-time">
                {removeLeadingZeroFromString(record.start_time.slice(0, 5))}
              </div>
            </div>
            <div className="attendance-records-container">
              {record.attendance_records.map((attendanceRecord) => (
                <div
                  className="attendance-record"
                  key={`attendance-record-${attendanceRecord.id}`}
                >
                  <div
                    className="student-name-kanji"
                    data-student_id={attendanceRecord.student.id}
                    onClick={handleClicksToStudentName}
                  >
                    {`${attendanceRecord.student.last_name_kanji} ${attendanceRecord.student.first_name_kanji} (${attendanceRecord.grade_verbose})`}
                  </div>
                  <div
                    className="student-name-katakana"
                    data-student_id={attendanceRecord.student.id}
                    onClick={handleClicksToStudentName}
                  >{`${attendanceRecord.student.last_name_katakana} ${attendanceRecord.student.first_name_katakana}`}</div>
                  <div
                    className={`student-attendance-status ${attendanceStatusIntegerToCssClass(
                      attendanceRecord.status
                    )}`}
                    data-attendance_record_id={attendanceRecord.id}
                    data-attendance_status_integer={attendanceRecord.status}
                    onClick={toggleAttendanceStatus}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="schedule-break-container card"
            key={`schedule-break-${record.id}`}
            style={{ minHeight: `${record.breakDuration / 8}rem` }}
          >
            <div>
              {Math.floor(record.breakDuration / 60)}:
              {`0${record.breakDuration % 60}`.slice(-2)}
            </div>
          </div>
        )
      )}
    </div>
  ) : null;
}

export default AttendanceContainer;
