import React, { Fragment, useState } from "react";
/* AXIOS */
import instance from "../../axios/axios_authenticated";
/* CSS */
import "./JounalEntryCreate.scss";
/* COMPONENTS */
import JournalEntryCreateToolbar from "../../staff/toolbar/accounting/JournalEntryCreateToolbar";

function JounalEntryCreate({
  csrfToken,
  backButtonText,
  backButtonLink,
  displayBackButton,
  setDisplayBackButton,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [disableToolbarButtons, setDisableToolbarButtons] = useState(true);

  const [journalData, setJournalData] = React.useState({
    date: "",
    description: "",
    reference: "",
    lines: [{ account: "", side: "", amount: "" }],
  });

  // const sampleData = {
  //   date: "2026-04-23",
  //   description: "Monthly rent payment",
  //   reference: "REF-001",
  //   lines: [
  //     { account: 2, side: "CREDIT", amount: 300000 },
  //     { account: 6, side: "DEBIT", amount: 300000 },
  //   ],
  // };

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  const handleClicksToCreateJournalEntryButton = () => {
    /* send journal entry data to backend via Axios instance */
    const createJournalEntry = async () => {
      try {
        await instance
          .post(
            "api/accounting/accounting/journal_entries/create/",
            journalData,
            {
              headers: {
                "X-CSRFToken": csrfToken,
              },
            },
          )
          .then((response) => {
            if (response) {
              console.log(response);
            }
          });
      } catch (e) {
        console.log(e);
        window.alert("Error creating journal entry. Please try again.");
      }
    };

    /* drives code */
    createJournalEntry();
  };

  useState(() => {
    // enables the toolbar after the component mounts
    setDisableToolbarButtons(false);
  }, []);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <section id="journal-entry-create-section">
        <div className="journal-entry-create-container card">
          <div className="journal-entry-create-body"></div>
          <div className="bottom-buttons-container">
            <div
              className="create-journal-entry-button"
              onClick={handleClicksToCreateJournalEntryButton}
            >
              登録
            </div>
          </div>
        </div>
      </section>
      <JournalEntryCreateToolbar
        disableToolbarButtons={disableToolbarButtons}
        backButtonText={backButtonText}
        backButtonLink={backButtonLink}
        displayBackButton={displayBackButton}
        setDisplayBackButton={setDisplayBackButton}
      />
    </Fragment>
  );
}

export default JounalEntryCreate;
