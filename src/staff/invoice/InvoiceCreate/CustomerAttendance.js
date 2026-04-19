import React, { useEffect, useRef, Fragment } from "react";
/* CSS */
import "./CustomerAttendance.scss";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* LOADING SPINNER */
import LoadingSpinner from "../../micro/LoadingSpinner";

function CustomerAttendance({ invoiceData }) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const fetchAttendanceRecordsTimerRef = useRef(null);

  const [customerAttendanceRecords, setCustomerAttendanceRecords] =
    React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  useEffect(() => {
    // clears any existing attendance record data
    setCustomerAttendanceRecords([]);

    /* fetch list of student profiles for select list */
    const fetchStudentAttendanceRecords = async () => {
      try {
        // enables loading spinner
        setIsLoading(true);

        await instance
          .get(
            "api/attendance/attendance/attendance_for_student_for_invoice/",
            {
              params: { student_id: invoiceData.id },
            },
          )
          .then((response) => {
            if (response) {
              setCustomerAttendanceRecords(response.data.attendance_records);
            }
          });
      } catch (e) {
        console.log(e);
      } finally {
        // disables loading spinner
        setIsLoading(false);
      }
    };

    // resets any previous timers and starts a new timer
    clearTimeout(fetchAttendanceRecordsTimerRef.current);

    // sets a new timer
    if (invoiceData && invoiceData.id) {
      fetchAttendanceRecordsTimerRef.current = setTimeout(() => {
        fetchStudentAttendanceRecords();
      }, 1500);
    }

    // cleanup when invoiceData changes or component unmounts
    return () => {
      clearTimeout(fetchAttendanceRecordsTimerRef.current);
    };
  }, [invoiceData]);

  // converts date to Japanese format
  const convertDateToJapaneseFormat = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dayOfWeek = date.getDay();
    const daysOfWeekJapanese = ["日", "月", "火", "水", "木", "金", "土"];
    const dayOfWeekJapanese = daysOfWeekJapanese[dayOfWeek];

    return `${year}年${month}月${day}日 (${dayOfWeekJapanese})`;
  };

  // toggles attendance drawer
  const toggleAttendanceDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <div
        id="customer-attendance-section"
        className={isDrawerOpen ? "open" : ""}
      >
        <div className="open-close-tab" onClick={toggleAttendanceDrawer}>
          <div className="tag-label">出欠履歴</div>
        </div>

        <div className="customer-attendance-container">
          {!isLoading ? (
            customerAttendanceRecords.map((record) => (
              <div className="customer-attendance-record" key={record.id}>
                <div
                  className="instructor-icon"
                  style={{
                    backgroundImage: `url(/img/instructors/${record.icon_stub})`,
                  }}
                />
                <div>{convertDateToJapaneseFormat(record.date)}</div>
                <div>{record.start_time.slice(0, 5)}</div>
                <div>{record.grade}</div>
                <div>{record.linked_class_name}</div>
                <div
                  className={`status-icon${
                    record.status === 3
                      ? " present"
                      : record.status === 4
                        ? " absent"
                        : ""
                  }`}
                ></div>
              </div>
            ))
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default CustomerAttendance;
