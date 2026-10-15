import React, { useState, useEffect, useRef } from "react";
/* Axios */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./AttendanceRecordNotes.scss";

function AttendanceRecordNotes({
  csrfToken,
  lastNameKanji,
  firstNameKanji,
  eventName,
  date,
  attendanceRecordId,
  studentId,
  lessonNote: initialLessonNote,
  homeworkNote: initialHomeworkNote,
  studentNote: initialStudentNote,
}) {
  /* ---------------------------------------------- */
  /* ------------- ATTENDANCE - STATE ------------- */
  /* ---------------------------------------------- */
  const [isNotesSectionOpen, setIsNotesSectionOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [lessonNote, setLessonNote] = useState(
    initialLessonNote ? initialLessonNote : "",
  );
  const [homeworkNote, setHomeworkNote] = useState(
    initialHomeworkNote ? initialHomeworkNote : "",
  );
  const [studentNote, setStudentNote] = useState(
    initialStudentNote ? initialStudentNote : "",
  );

  const [noteToFocus, setNoteToFocus] = useState("");

  const hasUnsavedChanges = () => {
    return (
      notesAtOpenRef.current?.lessonNote !== lessonNote ||
      notesAtOpenRef.current?.homeworkNote !== homeworkNote ||
      notesAtOpenRef.current?.studentNote !== studentNote
    );
  };

  const lessonNoteRef = useRef();
  const homeworkNoteRef = useRef();
  const studentNoteRef = useRef();
  const notesAtOpenRef = useRef(null);

  /* ---------------------------------------------- */
  /* -----------------  FUNCTIONS ----------------- */
  /* ---------------------------------------------- */

  // open notes section and focus on the notes content container
  const openNotesSection = (noteType) => {
    notesAtOpenRef.current = { lessonNote, homeworkNote, studentNote };
    setNoteToFocus(noteType);
    setIsNotesSectionOpen(true);

    console.log(notesAtOpenRef.current);
  };

  // close notes section
  const closeNotesSection = (discardChanges = true) => {
    if (isSaving && discardChanges) return;

    if (discardChanges && notesAtOpenRef.current) {
      setLessonNote(notesAtOpenRef.current.lessonNote);
      setHomeworkNote(notesAtOpenRef.current.homeworkNote);
      setStudentNote(notesAtOpenRef.current.studentNote);
    }

    notesAtOpenRef.current = null;
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
  const saveNotes = async () => {
    setIsSaving(true);

    const trimmedLessonNote = lessonNote.trim();
    const trimmedHomeworkNote = homeworkNote.trim();
    const trimmedStudentNote = studentNote.trim();

    setLessonNote(trimmedLessonNote);
    setHomeworkNote(trimmedHomeworkNote);
    setStudentNote(trimmedStudentNote);

    const data = {
      attendance_record_id: attendanceRecordId,
      student_id: studentId,
      lesson_note: trimmedLessonNote,
      homework_note: trimmedHomeworkNote,
      student_note: trimmedStudentNote,
    };
    try {
      const response = await instance.post(
        "api/attendance/attendance/add_edit_attendance_record_note/",
        data,
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        },
      );
      if (response.status === 200) {
        closeNotesSection(false);
      }
      setIsSaving(false);
    } catch (e) {
      // remove the dimming effect
      setIsSaving(false);

      console.log(e);
      window.alert("エラーが発生しました。");
    }
  };

  // jumps to the note textarea that should be focused when the notes section is opened
  useEffect(() => {
    if (!isNotesSectionOpen) return;

    const refs = {
      lesson: lessonNoteRef,
      homework: homeworkNoteRef,
      student: studentNoteRef,
    };

    const textarea = refs[noteToFocus]?.current;
    if (!textarea) return;

    textarea.focus();
    const cursorPosition = textarea.value.length;
    textarea.setSelectionRange(cursorPosition, cursorPosition);
  }, [isNotesSectionOpen, noteToFocus]);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <div className="attendance-record-notes-container">
      <div
        className={`lesson-note${lessonNote ? " complete" : ""}`}
        onClick={() => openNotesSection("lesson")}
      ></div>
      <div
        className={`homework-note${homeworkNote ? " complete" : ""}`}
        onClick={() => openNotesSection("homework")}
      ></div>
      <div
        className={`student-note${studentNote ? " complete" : ""}`}
        onClick={() => openNotesSection("student")}
      ></div>
      <div
        className={`notes-overlay${isSaving ? " saving" : ""} ${isNotesSectionOpen ? " active" : ""}`}
        onClick={() => closeNotesSection()}
      >
        <div
          className={`notes-content-container${isSaving ? " saving" : ""}`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="notes-header">
            <div className="title-container">
              <div className="name">{`${lastNameKanji} ${firstNameKanji}`}</div>
              <div className="date">{`${formatDate(date)}`}</div>
              <div className="event">{`${eventName}`}</div>
            </div>
            <div
              className="exit-button"
              onClick={() => closeNotesSection()}
            ></div>
          </div>
          <div
            className={`save-status-indicator-container${hasUnsavedChanges() ? " unsaved-changes" : ""}`}
          >
            <div className="saved-message">すべて保存済み</div>
            <div className="unsaved-message">未保存の変更があります</div>
            <div className="save-status-indicator" />
          </div>
          <div className="notes-body">
            <div className="lesson-note-container">
              <div className="note-type-title">レッスン内容</div>
              <textarea
                ref={lessonNoteRef}
                value={lessonNote}
                onChange={(e) => setLessonNote(e.target.value)}
              />
            </div>
            <div className="homework-note-container">
              <div className="note-type-title">宿題</div>
              <textarea
                ref={homeworkNoteRef}
                value={homeworkNote}
                onChange={(e) => setHomeworkNote(e.target.value)}
              />
            </div>
            <div className="student-note-container">
              <div className="note-type-title">フィードバック</div>
              <textarea
                ref={studentNoteRef}
                value={studentNote}
                onChange={(e) => setStudentNote(e.target.value)}
              />
            </div>
            <div className="button-container">
              <button
                className="cancel-button"
                onClick={() => closeNotesSection()}
              >
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
