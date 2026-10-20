import React, { useState, useEffect } from "react";
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
                      className={`student-attendance-record-data ${selectedStudentIndex === index ? "selected" : ""}`}
                    >
                      {student.attendance_records &&
                      student.attendance_records.length > 0 ? (
                        student.attendance_records.map(
                          (record, recordIndex) => (
                            <div key={recordIndex}>
                              {`attendancep[0].linked_class.event_type.name: ${record.attendance_reverse_relationship[0].linked_class.event_type.name}`}
                              <br />
                              {`attendance.linked_class.start_time: ${record.attendance_reverse_relationship[0].linked_class.start_time}`}
                              <br />
                              {`attendance.linked_class.primary_instructor: ${record.attendance_reverse_relationship[0].linked_class.primary_instructor}`}
                              <br />
                              {`attendance.linked_class.event_type: ${record.attendance_reverse_relationship[0].linked_class.event_type}`}
                              <br />
                              {`attendance.date: ${record.attendance_reverse_relationship[0].date}`}
                              <br />
                              {`status: ${record.status}`}
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
