import React, { useState, useEffect, useRef, useCallback } from "react";
// AXIOS
import instance from "../../axios/axios_authenticated";
// CSS
import "./StudentAttendance.scss";
// COMPONENTS
import LoadingSpinner from "./LoadingSpinner";

function StudentAttendance() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [attendanceData, setAttendanceData] = useState(null);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(0);

  // reference to the notes body container for overflow detection
  const bodyRefs = useRef(new Map());
  const [edges, setEdges] = useState({});

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* fetches revenue by month data from the API */
  const fetchAttendanceData = () => {
    instance
      .get("api/dashboard/dashboard/attendance_for_customer/")
      .then((response) => {
        if (response) {
          setAttendanceData(response.data.student_attendance);
          console.log(response.data.student_attendance);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  /* runs on component mount */
  useEffect(() => {
    fetchAttendanceData();
  }, []);

  /* applies class based on number of students */
  const numberOfStudentsClass = {
    1: "single",
    2: "double",
    3: "triple",
    4: "quadruple",
    5: "too-many",
  };

  // detect if the notes body is overflowing and update the state accordingly
  const update = useCallback((index, el) => {
    if (!el) return;

    const top = el.scrollTop > 1;
    const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 1;

    setEdges((prev) => {
      const current = prev[index] ?? {};
      if (current.top === top && current.bottom === bottom) return prev;
      return { ...prev, [index]: { top, bottom } };
    });
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      bodyRefs.current.forEach((el, index) => update(index, el));
    });

    bodyRefs.current.forEach((el) => observer.observe(el));
    bodyRefs.current.forEach((el, index) => update(index, el));

    return () => observer.disconnect();
  }, [attendanceData, update]);

  const statusClassConverter = {
    2: "unknown",
    3: "present",
    4: "absent",
  };

  // converts date string to Japanese formatted date
  const formatDateJapanese = (dateString) => {
    const date = new Date(dateString);

    const dayOfWeekJapanese = {
      0: "日",
      1: "月",
      2: "火",
      3: "水",
      4: "木",
      5: "金",
      6: "土",
    };

    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 (${dayOfWeekJapanese[date.getDay()]})`;
  };

  // formats start time and duration
  const formatStartEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(":").map(Number);

    const totalMinutes = (hours * 60 + minutes + duration) % (24 * 60);

    return `${startTime.slice(0, 5)} ~ ${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(
      totalMinutes % 60,
    ).padStart(2, "0")}`;
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <section id="student-attendance-section">
      <div className="student-attendance-container customer-card">
        <div className="customer-card-title">出欠履歴</div>
        {attendanceData ? (
          <div className="customer-card-content">
            <div
              className={`student-tabs ${attendanceData ? numberOfStudentsClass[attendanceData.length] || "" : ""}`}
            >
              {attendanceData && attendanceData.length > 0
                ? attendanceData.map((student, index) => {
                    return (
                      <div
                        key={index}
                        className={`tab${selectedStudentIndex === index ? " selected" : ""}`}
                        onClick={() => setSelectedStudentIndex(index)}
                      >
                        {`${student.last_name_kanji} ${student.first_name_kanji}`}
                      </div>
                    );
                  })
                : null}
            </div>
            <div className="attendance-records-data-container">
              {attendanceData && attendanceData.length > 0
                ? attendanceData.map((student, index) => {
                    return (
                      <div
                        key={index}
                        ref={(el) => {
                          if (el) bodyRefs.current.set(index, el);
                          else bodyRefs.current.delete(index);
                        }}
                        onScroll={(event) => update(index, event.currentTarget)}
                        className={`student-attendance-record-data ${
                          selectedStudentIndex === index ? "selected" : ""
                        } ${edges[index]?.top ? "has-top" : ""} ${
                          edges[index]?.bottom ? "has-bottom" : ""
                        }`}
                      >
                        {student.attendance_records &&
                        student.attendance_records.length > 0 ? (
                          student.attendance_records.map(
                            (record, recordIndex) => (
                              <div
                                className="record-container"
                                key={recordIndex}
                              >
                                <div
                                  className="instructor-icon"
                                  style={{
                                    backgroundImage: `url("/img/instructors/${record.attendance_reverse_relationship[0].linked_class.primary_instructor.icon_stub}")`,
                                  }}
                                />
                                <div className="event-date">{`${formatDateJapanese(record.attendance_reverse_relationship[0].date)}`}</div>
                                <div className="event-start-end-time">
                                  {formatStartEndTime(
                                    record.attendance_reverse_relationship[0]
                                      .linked_class.start_time,
                                    record.attendance_reverse_relationship[0]
                                      .linked_class.event_type.duration,
                                  )}
                                </div>
                                <div className="event-name-type">
                                  {`${record.attendance_reverse_relationship[0].linked_class.event_name}（${
                                    record.attendance_reverse_relationship[0]
                                      .linked_class.event_type.name
                                  }）`}
                                </div>
                                <div className="instructor-name">{`${record.attendance_reverse_relationship[0].linked_class.primary_instructor.last_name_kanji}先生`}</div>
                                <div
                                  className={`attendance-status ${statusClassConverter[record.status]}`}
                                ></div>
                                {record.lesson_note ? (
                                  <div className="note-container">
                                    <div className="note-title">
                                      レッスン内容
                                    </div>
                                    <div className="lesson-note">
                                      {record.lesson_note}
                                    </div>
                                    {record.homework_note ? (
                                      <div className="note-container">
                                        <div className="note-title">宿題</div>
                                        <div className="homework-note">
                                          {record.homework_note}
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>
                                ) : null}
                                {record.student_note ? (
                                  <div className="note-container">
                                    <div className="note-title">
                                      フィードバック
                                    </div>
                                    <div className="student-note">
                                      {record.student_note}
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            ),
                          )
                        ) : (
                          <div>No attendance records</div>
                        )}
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </section>
  );
}

export default StudentAttendance;
