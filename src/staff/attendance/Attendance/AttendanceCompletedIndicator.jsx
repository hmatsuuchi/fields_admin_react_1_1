import React, { useState, useEffect } from "react";
/* CSS */
import "./AttendanceCompletedIndicator.scss";

function AttendanceCompletedIndicator({ attendances }) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [recordCountIncomplete, setRecordCountIncomplete] = useState(0);
  const [recordCountPresent, setRecordCountPresent] = useState(0);
  const [recordCountAbsent, setRecordCountAbsent] = useState(0);
  const [recordCompletePercent, setRecordCompletePercent] = useState(0);

  /* CALCULATES STATUS BREAKDOWN OF ATTENDANCE RECORDS */
  useEffect(() => {
    let recordCountIncomplete = 0;
    let recordCountPresent = 0;
    let recordCountAbsent = 0;

    for (let i = 0; i < attendances.length; i++) {
      recordCountIncomplete += attendances[i].attendance_records.filter(
        (record) => record.status === 2
      ).length;
      recordCountPresent += attendances[i].attendance_records.filter(
        (record) => record.status === 3
      ).length;
      recordCountAbsent += attendances[i].attendance_records.filter(
        (record) => record.status === 4
      ).length;
    }

    setRecordCountIncomplete(recordCountIncomplete);
    setRecordCountPresent(recordCountPresent);
    setRecordCountAbsent(recordCountAbsent);
    setRecordCompletePercent(
      Math.round(
        ((recordCountPresent + recordCountAbsent) /
          (recordCountPresent + recordCountAbsent + recordCountIncomplete)) *
          100
      )
    );
  }, [attendances]);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (recordCountIncomplete !== 0) |
    (recordCountPresent !== 0) |
    (recordCountAbsent !== 0) ? (
    <div
      id={"attendance-completed-indicator"}
      className={recordCountIncomplete === 0 ? " completed" : ""}
    >
      <div className="completion-percentage">{`${recordCompletePercent}%`}</div>
      <div className="completion-counter-text record-count-incomplete">
        {recordCountIncomplete}
      </div>
      <div className="completion-counter-text record-count-present">
        {recordCountPresent}
      </div>
      <div className="completion-counter-text record-count-absent">
        {recordCountAbsent}
      </div>
    </div>
  ) : null;
}

export default AttendanceCompletedIndicator;
