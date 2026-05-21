import React, { useEffect } from "react";

/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./AttendanceAlerts.scss";
/* COMPONENTS */
import LoadingSpinner from "../../micro/LoadingSpinner";

function AttendanceAlerts() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [analytics, setAnalytics] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  const analyzeAttendance = () => {
    instance
      .get("api/alerts/alerts/attendance_alerts/analyze/")
      .then((response) => {
        if (response) {
          setAnalytics(response.data.analytics);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    analyzeAttendance();
  }, []);

  const dayOfWeekToString = ["日", "月", "火", "水", "木", "金", "土"];

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <div id="attendance-alerts-section">
      <div className="primary-container card">
        {analytics &&
          analytics.map((instructorRecord, index) => (
            <div className="instructor-container" key={index}>
              <div className="instructor-header">{`${instructorRecord.instructor_last_name_romaji}, ${instructorRecord.instructor_first_name_romaji}`}</div>
              <div className="day-of-week-header-container">
                {dayOfWeekToString.map((day, index) => (
                  <div className="day-of-week" key={index}>
                    {day}
                  </div>
                ))}
              </div>
              <div className="day-of-week-container">
                {instructorRecord.day_of_week_data.map(
                  (dayRecord, dayIndex) => {
                    return (
                      <div className="day-container" key={dayIndex}>
                        <div className="attendance-records-data-container">
                          {dayRecord.attendance_records_for_day_of_week.map(
                            (attendanceRecord, recordIndex) => (
                              <div
                                className={`attendance-record-container${attendanceRecord.incomplete_records !== 0 ? " alert-flag" : attendanceRecord.flagged ? " attention-flag" : ""}`}
                                key={recordIndex}
                              >
                                <div className="date">
                                  {`${new Date(attendanceRecord.date).getDate()}日`}
                                </div>
                                <div className="incomplete-and-total-records">
                                  {`${attendanceRecord.total_records - attendanceRecord.incomplete_records}/${attendanceRecord.total_records}`}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          ))}
        {isLoading ? <LoadingSpinner /> : null}
      </div>
    </div>
  );
}

export default AttendanceAlerts;
