import React, { useState } from "react";
/* CSS */
import "./AttendanceRecordNotes.scss";

function AttendanceRecordNotes({
  lastNameKanji,
  firstNameKanji,
  eventName,
  date,
}) {
  /* ---------------------------------------------- */
  /* ------------- ATTENDANCE - STATE ------------- */
  /* ---------------------------------------------- */
  const [isNotesSectionOpen, setIsNotesSectionOpen] = useState(false);

  /* ---------------------------------------------- */
  /* -----------------  FUNCTIONS ----------------- */
  /* ---------------------------------------------- */

  // open notes section
  const openNotesSection = () => {
    console.log("Opening notes section");
    setIsNotesSectionOpen(true);
  };

  // close notes section
  const closeNotesSection = () => {
    console.log("Closing notes section");
    setIsNotesSectionOpen(false);
  };

  // reformats date
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${month}月${day}日`;
  };

  // save notes
  const saveNotes = () => {
    console.log("Saving notes");
    // Implement the save functionality here
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <div className="attendance-record-notes-container">
      <div className="lesson-note" onClick={openNotesSection}></div>
      <div className="homework-note" onClick={openNotesSection}></div>
      <div className="student-note" onClick={openNotesSection}></div>
      <div
        className={`notes-overlay ${isNotesSectionOpen ? "active" : ""}`}
        onClick={closeNotesSection}
      >
        <div
          className="notes-content-container"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="notes-header">
            <div className="title-container">
              <div className="name">{`${lastNameKanji} ${firstNameKanji}`}</div>
              <div className="date">{`${formatDate(date)}`}</div>
              <div className="event">{`${eventName}`}</div>
            </div>
            <div className="exit-button" onClick={closeNotesSection}></div>
          </div>
          <div className="notes-body">
            <div className="lesson-note-container">
              <div className="note-type-title">レッスン内容</div>
              <textarea />
            </div>
            <div className="homework-note-container">
              <div className="note-type-title">宿題</div>
              <textarea />
            </div>
            <div className="student-note-container">
              <div className="note-type-title">フィードバック</div>
              <textarea />
            </div>
            <div className="button-container">
              <button className="cancel-button" onClick={closeNotesSection}>
                キャンセル
              </button>
              <button className="save-button" onClick={saveNotes}>
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceRecordNotes;
