import React, { useEffect, Fragment } from "react";
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
  setShowJournalArchive,
  journalEntries,
  setJournalEntries,
  setSelectedEntry,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

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
  }, [profileId, setJournalEntries]);

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

  /* LOADS SELECTED JOURNAL OBJECT INTO STATE */
  const loadJournalIntoState = (journalId) => {
    const journalObject = journalEntries.find(
      (entry) => entry.id === journalId
    );
    setSelectedEntry(journalObject);
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
          <div className="journal-entries-title">活動記録</div>
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
                onClick={() => {
                  setShowJournalArchive(true);
                  loadJournalIntoState(entry.id);
                }}
              >
                <div className="more-info-container">
                  <div className="more-info-tab" />
                </div>
                <div className="data-container">
                  <div>{convertDateToJapanese(entry.date)}</div>
                  <div>{entry.time ? entry.time.slice(0, 5) : null}</div>
                  <div>{entry.type.name}</div>
                </div>
                {entry.instructor.length > 0 ? (
                  <div className="instructor-container">
                    {entry.instructor.slice(0, 3).map((instructor) => (
                      <div
                        key={instructor.id}
                        className="instructor-icon"
                        style={{
                          backgroundImage: `url(/img/instructors/${instructor.userprofilesinstructors.icon_stub})`,
                        }}
                      ></div>
                    ))}
                  </div>
                ) : null}
                {entry.text !== "" ? (
                  <Fragment>
                    <div className="divider-line" />
                    <div className="journal-entry-text">{entry.text}</div>
                  </Fragment>
                ) : null}
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
