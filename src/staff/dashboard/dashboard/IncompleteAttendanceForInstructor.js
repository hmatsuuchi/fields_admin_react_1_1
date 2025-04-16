import React, { useEffect, Fragment } from "react";

/* AXIOS */
import instance from "../../axios/axios_authenticated";
/* COMPONENTS */
import LoadingSpinner from "../../micro/LoadingSpinner";

/* CSS */
import "./IncompleteAttendanceForInstructor.scss";

function IncompleteAttendanceForInstructor() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [recordsDateStatusCount, setRecordsDateStatusCount] = React.useState(
    []
  );
  const [dayOfWeekOffset, setDayOfWeekOffset] = React.useState(0);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */
  /* FETCH ATTENDANCE RECORD COUNTS FOR INSTRUCTOR ON COMPONENT MOUNT */
  useEffect(() => {
    const fetchData = async () => {
      try {
        await instance
          .get("api/dashboard/dashboard/incomplete_attendance_for_instructor/")
          .then((response) => {
            if (response) {
              const record_count_data =
                response.data.past_month_by_date_annotated;

              /* gets the instructor's working days preference */
              const pref_dashboard_working_days =
                response.data.pref_dashboard_working_days;

              /* set the day of week offset integer */
              setDayOfWeekOffsetInteger();

              /* add missing dates to the array */
              const processed_data = addMissingDates(
                record_count_data,
                pref_dashboard_working_days
              );
              setRecordsDateStatusCount(processed_data);
            }
          });
      } catch (e) {
        console.log(e);
        window.alert("エラーが発生しました。");
      }
    };

    /* sets the day of week offset integer */
    const setDayOfWeekOffsetInteger = () => {
      const firstDate = new Date();
      /* calculates the day of week offset */
      setDayOfWeekOffset(6 - firstDate.getDay());
    };

    /* adds missing dates to the array */
    const addMissingDates = (
      record_count_data,
      pref_dashboard_working_days_js
    ) => {
      /* sets start and end dates which define the range of dates though which to iterate */
      const firstDate = new Date();
      const lastDate = new Date();
      lastDate.setDate(lastDate.getDate() - 28);

      const dateArray = [];
      let currentDateBeingIterated = new Date(firstDate);

      while (currentDateBeingIterated >= lastDate) {
        /* converts the date being iterated to JST for use in ISO String conversions */
        const currentDateBeingIteratedJST = new Date(
          currentDateBeingIterated.getTime() + 9 * 60 * 60 * 1000
        );

        /* searches for date in the array that matches current date being iterated */
        const matchingDate = record_count_data.find((dateRecord) => {
          /* compares the date being iterated with the date in the record */
          return (
            dateRecord.attendance__date ===
            currentDateBeingIteratedJST.toISOString().split("T")[0]
          );
        });

        const isWorkday = pref_dashboard_working_days_js.includes(
          currentDateBeingIterated.getDay()
        );

        /* add existing dates to the array or create new objects for non-existing dates */
        if (matchingDate) {
          dateArray.push({
            attendanceDate: currentDateBeingIteratedJST
              .toISOString()
              .split("T")[0],
            attendanceAllCount: matchingDate.record_count_all,
            attendancePresentCount: matchingDate.record_count_present,
            attendanceAbsentCount: matchingDate.record_count_absent,
            attendanceIncompleteCount: matchingDate.record_count_incomplete,
            isWorkday: isWorkday,
          });
        } else {
          dateArray.push({
            attendanceDate: currentDateBeingIteratedJST
              .toISOString()
              .split("T")[0],
            isWorkday: isWorkday,
          });
        }

        /* decrements the current date being iterated */
        currentDateBeingIterated.setDate(
          currentDateBeingIterated.getDate() - 1
        );
      }

      return dateArray;
    };

    /* drives code */
    fetchData();
  }, []);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <div
      id="incomplete-attendance-for-instructor"
      className="component-primary-container"
    >
      <div className="component-title">出欠状況</div>
      {recordsDateStatusCount.length > 0 ? (
        <div className="dates-container">
          <div className="day-of-week-title">土</div>
          <div className="day-of-week-title">金</div>
          <div className="day-of-week-title">木</div>
          <div className="day-of-week-title">水</div>
          <div className="day-of-week-title">火</div>
          <div className="day-of-week-title">月</div>
          <div className="day-of-week-title">日</div>

          {Array.from({ length: dayOfWeekOffset }, (_, index) => {
            return (
              <div
                className="offset-container"
                key={`offset-container-${index}`}
              ></div>
            );
          })}

          {recordsDateStatusCount.map((dateRecord) => {
            const all = dateRecord.attendanceAllCount;
            const incomplete = dateRecord.attendanceIncompleteCount;

            const isWorkday = dateRecord.isWorkday;

            const currentDate = new Date(dateRecord.attendanceDate);

            return (
              <div
                key={`date-id-${dateRecord.attendanceDate}`}
                className={`date-record-container${
                  incomplete ? " incomplete" : ""
                }${!all ? " no-records" : ""}${isWorkday ? " is-workday" : ""}`}
              >
                <div className="attendance-date">{`${currentDate.getDate()}日`}</div>
                {all ? (
                  <Fragment>
                    <div className="complete-fraction">{`${
                      all - incomplete
                    }/${all}`}</div>
                  </Fragment>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}

export default IncompleteAttendanceForInstructor;
