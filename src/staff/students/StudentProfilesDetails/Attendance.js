import React, { useEffect, useState } from "react";
// Axios
import instance from "../../axios/axios_authenticated";
// CSS
import "./Attendance.scss";

function Attendance({ profileId, profileStatus }) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [attendances, setAttendances] = useState([]);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* CALCULATES END TIME */
  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(":").map(Number);

    const date = new Date();
    date.setHours(hours, minutes);

    date.setMinutes(date.getMinutes() + duration);

    const timeString = `${date.getHours()}:${date.getMinutes()}`;

    return timeString;
  };

  /* STUDENT ENROLLMENT STATUS CSS CLASS CONVERSION */
  const studentAttendanceClass = {
    2: "pending",
    3: "present",
    4: "absent",
  };

  /* PROFILE STATUS CSS CLASS CONVERSION */
  const profileStatusClass = {
    1: "pre-enrolled",
    2: "enrolled",
    3: "short-absence",
    4: "long-absence",
  };

  /* CONVERTS DATE TO JAPANESE FORMAT */
  const convertDateToJapanese = (date) => {
    const dayOfWeekKanjiShort = {
      0: "日",
      1: "月",
      2: "火",
      3: "水",
      4: "木",
      5: "金",
      6: "土",
    };

    const dateObject = new Date(date);

    const recordYear = dateObject.getFullYear();
    const recordMonth = dateObject.getMonth() + 1;
    const recordDate = dateObject.getDate();
    const recordDay = dayOfWeekKanjiShort[dateObject.getDay()];

    return `${recordYear}年${recordMonth}月${recordDate}日 (${recordDay})`;
  };

  /* FETCH ATTENDANCE DATA ON LOAD */
  useEffect(() => {
    /* resets attendance contents */
    setAttendances([]);

    (async () => {
      try {
        await instance
          .get("api/attendance/attendance/get_attendance_for_profile/", {
            params: { profile_id: profileId },
          })
          .then((response) => {
            if (response) {
              setAttendances(response.data.attendance);
            }
          });
      } catch (e) {
        console.log(e);
      }
    })();
  }, [profileId]);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return attendances.length > 0 ? (
    <div id="attendance-records" className="card-container-full-width">
      <div className="attendance-records-container card-full-width">
        <div
          className={`attendance-records-header-container${` ${profileStatusClass[profileStatus]}`}`}>
          <div className="attendance-records-title">出欠履歴</div>
          <div className="attendance-records-number">{`${attendances.length}件`}</div>
        </div>
        <div className="attendance-records-body-container">
          {attendances.map((attendance) => (
            <div className="record-container" key={attendance.id}>
              <div className="record-data-container">
                <div
                  className="instructor-icon"
                  style={{
                    backgroundImage: `url(/img/instructors/${attendance.instructor.userprofilesinstructors.icon_stub})`,
                  }}
                />
                <div className="attendance-date">
                  {convertDateToJapanese(attendance.date)}
                </div>
                <div className="attendance-start-time">
                  {`${attendance.start_time.slice(0, 5)} ~ ${calculateEndTime(
                    attendance.start_time,
                    attendance.linked_class.event_type.duration
                  )}`}
                </div>
                <div className="attendance-event-name">
                  {attendance.linked_class.event_name}
                </div>

                <div className="attendance-record-grade-name">
                  {attendance.attendance_records[0].grade.name}
                </div>
              </div>
              <div
                className={`attendance-record-status-icon${` ${
                  studentAttendanceClass[
                    attendance.attendance_records[0].status
                  ]
                }`}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : null;
}

export default Attendance;
