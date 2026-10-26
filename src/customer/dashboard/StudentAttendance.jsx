import React, { useState, useEffect, useRef, useCallback } from "react";
/* AXIOS */
import instance from "../../axios/axios_authenticated";
// CSS
import "./StudentAttendance.scss";

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

  const dayOfWeek = (dateString) => {
    const date = new Date(dateString);

    const dayOfWeekJapanese = {
      0: "日曜日",
      1: "月曜日",
      2: "火曜日",
      3: "水曜日",
      4: "木曜日",
      5: "金曜日",
      6: "土曜日",
    };

    return dayOfWeekJapanese[date.getDay()];
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <section id="student-attendance-section">
      <div className="student-attendance-container customer-card">
        <div className="customer-card-title">出欠履歴</div>
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
                            <div className="record-container" key={recordIndex}>
                              {`Event Name: ${record.attendance_reverse_relationship[0].linked_class.event_name}`}
                              <br />
                              {`Event Start Time: ${record.attendance_reverse_relationship[0].linked_class.start_time}`}
                              <br />
                              {`Instructor Last Name: ${record.attendance_reverse_relationship[0].linked_class.primary_instructor.last_name_kanji}`}
                              <br />
                              {`Instructor First Name: ${record.attendance_reverse_relationship[0].linked_class.primary_instructor.first_name_kanji}`}
                              <br />
                              {`Instructor Icon Stub: ${record.attendance_reverse_relationship[0].linked_class.primary_instructor.icon_stub}`}
                              <br />
                              {`Event Type: ${record.attendance_reverse_relationship[0].linked_class.event_type.name}`}
                              <br />
                              {`Attendance Date: ${record.attendance_reverse_relationship[0].date}`}
                              <br />
                              {`Attendance Day of Week: ${dayOfWeek(record.attendance_reverse_relationship[0].date)}`}
                              <br />
                              {`Attendance Status: ${statusClassConverter[record.status]}`}
                              <br />
                              {`Lesson Note: ${record.lesson_note}`}
                              <br />
                              {`Homework Note: ${record.homework_note}`}
                              <br />
                              {`Student Note: ${record.student_note}`}
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
      </div>
    </section>
  );
}

export default StudentAttendance;
