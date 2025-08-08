import React, { useEffect, useState } from "react";
// React Router DOM
import { Link } from "react-router-dom";
// Axios
import instance from "../../../axios/axios_authenticated";
// CSS
import "./Journal.scss";
// Components
import LoadingSpinner from "../../micro/LoadingSpinner";

function Journal({
  profileId,
  profileStatus,
  profileLastNameKanji,
  profileFirstNameKanji,
  setBackButtonText,
  setBackButtonLink,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [journalEntries, setJournalEntries] = useState(null);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  // Fetch journal data on load
  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const response = await instance.get(
          "api/journal/journal/get_journal_for_profile/",
          { params: { profile_id: profileId } }
        );
        if (response) {
          setJournalEntries(response.data.journal_entries);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchJournal();
  }, [profileId]);

  /* PROFILE STATUS CSS CLASS CONVERSION */
  const profileStatusClass = {
    1: "pre-enrolled",
    2: "enrolled",
    3: "short-absence",
    4: "long-absence",
  };

  /* CONVERTS DATE TO JAPANESE FORMAT */
  const convertDateToJapanese = (date) => {
    const dayOfWeekKanjiShort = {
      0: "日",
      1: "月",
      2: "火",
      3: "水",
      4: "木",
      5: "金",
      6: "土",
    };

    const dateObject = new Date(date);

    const recordYear = dateObject.getFullYear();
    const recordMonth = dateObject.getMonth() + 1;
    const recordDate = dateObject.getDate();
    const recordDay = dayOfWeekKanjiShort[dateObject.getDay()];

    return `${recordYear}年${recordMonth}月${recordDate}日 (${recordDay})`;
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <div id="journal" className="card-container-full-width">
      <div className="journal-entries-container card-full-width">
        <div
          className={`journal-entries-header-container${` ${profileStatusClass[profileStatus]}`}`}
        >
          <div className="journal-entries-title">履歴</div>
          <div className="journal-entries-number">{`${
            journalEntries !== null ? journalEntries.length : 0
          }件`}</div>
        </div>
        <div className="journal-entries-body-container">
          {journalEntries === null ? (
            <LoadingSpinner />
          ) : journalEntries.length > 0 ? (
            journalEntries.map((entry) => (
              <div
                key={`journal-entry-${entry.id}`}
                className="journal-entry-container"
              >
                <div>
                  {convertDateToJapanese(entry.date)}{" "}
                  {entry.time ? entry.time.slice(0, 5) : null}
                </div>
                <div className="journal-entry-instructor-container">
                  {entry.instructor.map((instructor) => (
                    <div key={`instructor-user-id-${instructor.id}`}>
                      {instructor.userprofilesinstructors.last_name_kanji}先生
                    </div>
                  ))}
                </div>
                <div>{entry.type.name}</div>
                <div>{entry.text ? entry.text : null}</div>
              </div>
            ))
          ) : null}
        </div>
        <div className="journal-entries-footer-container">
          <Link
            className="journal-entry-add-button"
            to={`/staff/students/journal/create/?profile_id=${profileId}`}
            onClick={() => {
              setBackButtonText(
                `${profileLastNameKanji} ${profileFirstNameKanji} (明細)`
              );
              setBackButtonLink(
                `/staff/students/profiles/details/${profileId}/`
              );
            }}
          ></Link>
        </div>
      </div>
    </div>
  );
}

export default Journal;
