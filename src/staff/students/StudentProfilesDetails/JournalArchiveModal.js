import { Fragment } from "react";
// Axios
import instance from "../../../axios/axios_authenticated";
// CSS
import "./JournalArchiveModal.scss";

function JournalArchiveModal({
  csrfToken,
  setShowJournalArchive,
  journalEntries,
  setJournalEntries,
  selectedEntry,
  setSelectedEntry,
  setShowJournalArchiveModal,
  disableAllModals,
  setDisableAllModals,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  const removeJournalEntryFromArray = (entryId) => {
    const updatedEntries = journalEntries.filter(
      (entry) => entry.id !== entryId
    );
    setJournalEntries(updatedEntries);
  };

  const archiveJournalEntry = async () => {
    setDisableAllModals(true);

    try {
      const response = await instance.put(
        "api/journal/journal/archive_journal_entry/",
        {
          journal_id: selectedEntry.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
        }
      );
      if (response.status === 200) {
        removeJournalEntryFromArray(selectedEntry.id);
        setShowJournalArchiveModal(false);
        setShowJournalArchive(false);
        setSelectedEntry(null);
        setDisableAllModals(false);
      }
    } catch (error) {
      console.error("Error archiving journal entry:", error);
      setDisableAllModals(false);
    }
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      {/* Archive Journal Modal */}
      <div
        id="archive-journal-modal-container"
        className={disableAllModals ? "disable-all-modals" : ""}
      >
        <div className="dark-background-overlay"></div>
        <div className="modal-card">
          <div className="confirmation-modal-dialog">
            「{selectedEntry.type.name}」をアーカイブしますか？
          </div>
          <button
            className="cancel-button"
            onClick={() => setShowJournalArchiveModal(false)}
          >
            戻る
          </button>
          <button className="confirm-button" onClick={archiveJournalEntry}>
            アーカイブする
          </button>
        </div>
      </div>
    </Fragment>
  );
}

export default JournalArchiveModal;
