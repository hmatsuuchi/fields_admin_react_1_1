import React, { useState, useEffect, Fragment } from "react";
// Axios
import instance from "../../../axios/axios_authenticated";
// CSS
import "./JournalCreate.scss";
// React Router DOM
import { useNavigate } from "react-router-dom";
// Toolbar
import JournalEntryCreateToolbar from "../../toolbar/students/JournalEntryCreateToolbar";
// Components
import DisplayDescriptors from "../../micro/students/DisplayDescriptors";
// Loading Spinner
import LoadingSpinner from "../../micro/LoadingSpinner";

function JournalCreate({
  csrfToken,
  backButtonText,
  setBackButtonText,
  backButtonLink,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */
  const navigate = useNavigate();

  const [journalEntryStudent, setJournalEntryStudent] = useState(null);
  const [journalEntryDate, setJournalEntryDate] = useState("");
  const [journalEntryTime, setJournalEntryTime] = useState("");
  const [journalEntryType, setJournalEntryType] = useState("0");
  const [journalEntryInstructors, setJournalEntryInstructors] = useState([]);
  const [journalEntryText, setJournalEntryText] = useState("");

  const [journalTypes, setJournalTypes] = useState([]);
  const [activeInstructors, setActiveInstructors] = useState([]);
  const [contentSubmitted, setContentSubmitted] = useState(false);
  const [displayContent, setDisplayContent] = useState(false);

  const [dateError, setDateError] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [instructorError, setInstructorError] = useState(false);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  // fetches journal entry types from the API
  const fetchJournalEntryTypes = async () => {
    try {
      await instance
        .get("api/journal/journal/get_journal_types/")
        .then((response) => {
          if (response) {
            setJournalTypes(response.data.journal_types);
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  // fetches active instructors from the API
  const fetchActiveInstructors = async () => {
    try {
      await instance
        .get("api/journal/journal/get_active_instructors/")
        .then((response) => {
          if (response) {
            setActiveInstructors(response.data.active_instructors);
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  // fetch student profile data
  const fetchStudentProfileData = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const profileId = searchParams.get("profile_id");

      await instance
        .get("api/journal/journal/get_profile_data/", {
          params: { profile_id: profileId },
        })
        .then((response) => {
          if (response) {
            setJournalEntryStudent(response.data);
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  // runs on component mount to fetch journal types and active instructors
  useEffect(() => {
    fetchJournalEntryTypes();
    fetchActiveInstructors();
    fetchStudentProfileData();
  }, []);

  // handles clicks to select instructors for the journal entry
  const handleInstructorCheckboxChange = (instructorId) => {
    setJournalEntryInstructors((prev) =>
      prev.includes(instructorId)
        ? prev.filter((id) => id !== instructorId)
        : [...prev, instructorId]
    );
  };

  // handles form submission to create a new journal entry
  const handFormSubmit = async (e) => {
    e.preventDefault();

    setDateError(false);
    setTypeError(false);
    setInstructorError(false);

    if (
      journalEntryStudent &&
      journalEntryDate &&
      journalEntryType !== "0" &&
      journalEntryInstructors.length > 0
    ) {
      setContentSubmitted(true);

      try {
        const response = await instance.post(
          "api/journal/journal/create_journal_entry/",
          {
            student: journalEntryStudent.id,
            date: journalEntryDate,
            time: journalEntryTime,
            type: journalEntryType,
            instructor: journalEntryInstructors,
            text: journalEntryText,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
            },
          }
        );
        if (response.status === 201) {
          // redirects back to the student details page
          navigate(backButtonLink);
        } else {
          console.error("Failed to create journal entry:", response.data);
          setContentSubmitted(false);
        }
      } catch (error) {
        console.error("Error creating journal entry:", error);
        setContentSubmitted(false);
      }
    }
    if (!journalEntryDate) {
      setContentSubmitted(false);
      setDateError(true);
    }
    if (journalEntryType === "0") {
      setContentSubmitted(false);
      setTypeError(true);
    }
    if (journalEntryInstructors.length === 0) {
      setContentSubmitted(false);
      setInstructorError(true);
    }
  };

  // converts enrollment status to CSS class
  const enrollmentStatusAsCSSClass = [
    "",
    " pre-enrolled",
    " enrolled",
    " short-absence",
    " long-absence",
  ];

  // waits for journal entry types, active instructors and student profile data to be fetched before displaying content
  useEffect(() => {
    if (
      journalTypes.length > 0 &&
      activeInstructors.length > 0 &&
      journalEntryStudent !== null
    ) {
      setDisplayContent(true);
    }
  }, [journalTypes, activeInstructors, journalEntryStudent]);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <JournalEntryCreateToolbar
        backButtonText={backButtonText}
        setBackButtonText={setBackButtonText}
        backButtonLink={backButtonLink}
        displayContent={true}
      />
      {displayContent ? (
        <Fragment>
          <DisplayDescriptors
            displayTextArray={["新しいジャーナルを作成しています"]}
          />
          <div
            id="journal-create-container"
            className={`${contentSubmitted ? "content-submitted" : ""}`}
          >
            <div className="card-section-full-width">
              <div className="card-container-full-width">
                <div className="card-full-width">
                  <div id="journal-create-form">
                    <div
                      className={`journal-entry-header-container${
                        enrollmentStatusAsCSSClass[
                          journalEntryStudent
                            ? journalEntryStudent.status
                            : null
                        ]
                      }`}
                    >
                      <div></div>
                      <div className="status">
                        {/* Zero width character to prevent element collapse */}
                        {"\u200b"}
                      </div>
                    </div>
                    <div className="journal-entry-body-container">
                      <form>
                        <div className="profile-section-header">基本情報</div>
                        {/* Date */}
                        <label htmlFor="journal-entry-date">日付</label>
                        <input
                          type="date"
                          id="journal-entry-date"
                          className={`input-width-s${
                            dateError ? " error" : ""
                          }`}
                          name="journal-entry-date"
                          value={journalEntryDate}
                          onChange={(e) => setJournalEntryDate(e.target.value)}
                        ></input>

                        {/* Time */}
                        <label htmlFor="journal-entry-time">時間</label>
                        <input
                          type="time"
                          id="journal-entry-time"
                          className="input-width-s"
                          name="journal-entry-time"
                          value={journalEntryTime}
                          onChange={(e) => setJournalEntryTime(e.target.value)}
                        ></input>
                        {/* Type */}
                        <label htmlFor="journal-entry-type">タイプ</label>
                        <select
                          id="journal-entry-type"
                          className={`input-width-s${
                            typeError ? " error" : ""
                          }`}
                          name="journal-entry-type"
                          value={journalEntryType}
                          onChange={(e) => setJournalEntryType(e.target.value)}
                        >
                          <option value="0">-------</option>
                          {journalTypes.length !== 0
                            ? journalTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.name}
                                </option>
                              ))
                            : null}
                        </select>

                        <div className="profile-section-header">講師</div>

                        {/* Instructor */}
                        <div
                          className={`instructor-container${
                            instructorError ? " error" : ""
                          }`}
                        >
                          {activeInstructors.length !== 0
                            ? activeInstructors.map((instructor) => (
                                <Fragment
                                  key={`instructor-id-${instructor.id}`}
                                >
                                  <input
                                    name={`instructor-id-${instructor.id}`}
                                    type="checkbox"
                                    value={instructor.id}
                                    checked={journalEntryInstructors.includes(
                                      instructor.id
                                    )}
                                    onChange={() =>
                                      handleInstructorCheckboxChange(
                                        instructor.id
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={`instructor-id-${instructor.id}`}
                                  >
                                    {`${instructor.userprofilesinstructors.last_name_kanji} ${instructor.userprofilesinstructors.first_name_kanji}`}
                                  </label>
                                </Fragment>
                              ))
                            : null}
                        </div>

                        <div className="profile-section-header">コメント</div>

                        {/* Text */}
                        <label htmlFor="journal-entry-text">内容</label>
                        <textarea
                          id="journal-entry-text"
                          className="input-width-l"
                          name="journal-entry-text"
                          rows={5}
                          value={journalEntryText}
                          onChange={(e) => setJournalEntryText(e.target.value)}
                        ></textarea>

                        <div className="bottom-buttons-container">
                          <button
                            className="button-cancel"
                            onClick={() => {
                              navigate(backButtonLink);
                            }}
                          >
                            キャンセル
                          </button>
                          <button
                            type="submit"
                            className="button-submit"
                            onClick={handFormSubmit}
                          >
                            送信
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      ) : (
        <LoadingSpinner />
      )}
    </Fragment>
  );
}

export default JournalCreate;
