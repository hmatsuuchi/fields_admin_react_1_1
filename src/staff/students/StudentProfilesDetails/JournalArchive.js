import { Fragment, useState } from "react";
// CSS
import "./JournalArchive.scss";
// Components
import JournalArchiveModal from "./JournalArchiveModal";

function JournalArchive({
  csrfToken,
  setShowJournalArchive,
  journalEntries,
  setJournalEntries,
  selectedEntry,
  setSelectedEntry,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [showJournalArchiveModal, setShowJournalArchiveModal] = useState(false);
  const [disableAllModals, setDisableAllModals] = useState(false);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  const handleClicksToArchiveButton = () => {
    setShowJournalArchiveModal(true);
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
    <Fragment>
      {/* Edit/Delete Journal Card */}
      <div
        id="archive-journal-container"
        className={disableAllModals ? "disable-all-modals" : ""}
      >
        <div id="archive-journal-card">
          <div className="archive-journal-card-header">
            <div className="archive-journal-card-header-text">
              {selectedEntry.type.name}
            </div>
            <div
              className="archive-journal-card-header-close-button"
              onClick={() => {
                setShowJournalArchive(false);
                setSelectedEntry(null);
              }}
            />
          </div>
          <div className="archive-journal-card-body">
            <div className="section-header">基礎情報</div>
            <div className="data-container">
              <div className="label">日付:</div>
              <div className="data">
                {convertDateToJapanese(selectedEntry.date)}
              </div>
              <div className="label">時間:</div>
              <div className="data">{selectedEntry.time.slice(0, 5)}</div>
              <div className="label">タイプ:</div>
              <div className="data">{selectedEntry.type.name}</div>
            </div>
            <div className="section-header">講師</div>
            <div className="instructor-container">
              {selectedEntry.instructor.map((instructor) => (
                <Fragment>
                  <div
                    key={instructor.id}
                    className="instructor-icon"
                    style={{
                      backgroundImage: `url(/img/instructors/${instructor.userprofilesinstructors.icon_stub})`,
                    }}
                  ></div>
                  <div className="instructor-name">
                    {`${instructor.userprofilesinstructors.last_name_kanji}先生`}
                  </div>
                </Fragment>
              ))}
            </div>
            {selectedEntry.text ? (
              <Fragment>
                <div className="section-header">コメント</div>
                <div className="comment-container">{selectedEntry.text}</div>
              </Fragment>
            ) : null}
          </div>
          <div className="archive-journal-card-footer">
            <button
              className="archive-button"
              onClick={handleClicksToArchiveButton}
            ></button>
          </div>
        </div>
      </div>
      {/* Background Overlay */}
      <div
        className={disableAllModals ? "disable-all-modals" : ""}
        id="dark-background-overlay"
        onClick={() => {
          setShowJournalArchive(false);
          setSelectedEntry(null);
        }}
      ></div>
      {/* Journal Archive Modal */}
      {showJournalArchiveModal ? (
        <JournalArchiveModal
          csrfToken={csrfToken}
          setShowJournalArchive={setShowJournalArchive}
          journalEntries={journalEntries}
          setJournalEntries={setJournalEntries}
          selectedEntry={selectedEntry}
          setSelectedEntry={setSelectedEntry}
          setShowJournalArchiveModal={setShowJournalArchiveModal}
          disableAllModals={disableAllModals}
          setDisableAllModals={setDisableAllModals}
        />
      ) : null}
    </Fragment>
  );
}

export default JournalArchive;
