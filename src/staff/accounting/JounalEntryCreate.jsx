import React, { Fragment, useState, useEffect } from "react";
/* AXIOS */
import instance from "../../axios/axios_authenticated";
/* CSS */
import "./JounalEntryCreate.scss";
/* COMPONENTS */
import JournalEntryCreateToolbar from "../toolbar/accounting/JournalEntryCreateToolbar";

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

  const [disablePage, setDisablePage] = useState(false);

  const [accountChoices, setAccountChoices] = useState([]);
  const [contactChoices, setContactChoices] = useState([]);

  const journalDataDefault = {
    date: "",
    description: "",
    reference: "",
    contact: "",
    lines: [
      { account: "", amount_debit: "", amount_credit: "" },
      { account: "", amount_debit: "", amount_credit: "" },
    ],
  };
  const [journalData, setJournalData] = React.useState(journalDataDefault);
  const [convertedJournalData, setConvertedJournalData] = useState({});

  const [debitCreditTotals, setDebitCreditTotals] = useState({
    debit: 0,
    credit: 0,
  });

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  useEffect(() => {
    setConvertedJournalData({
      date: journalData.date,
      description: journalData.description,
      reference: journalData.reference,
      contact: journalData.contact,
      lines: journalData.lines
        .filter(
          (line) => line.account && (line.amount_debit || line.amount_credit),
        )
        .map((line) => ({
          account: line.account,
          side: line.amount_debit && !line.amount_credit ? "DEBIT" : "CREDIT",
          amount: line.amount_debit ? line.amount_debit : line.amount_credit,
        })),
    });
  }, [journalData]);

  // updates debit and credit totals whenever journal lines are updated
  useEffect(() => {
    const debitTotal = journalData.lines.reduce(
      (total, line) =>
        total + (line.amount_debit ? parseFloat(line.amount_debit) : 0),
      0,
    );
    const creditTotal = journalData.lines.reduce(
      (total, line) =>
        total + (line.amount_credit ? parseFloat(line.amount_credit) : 0),
      0,
    );
    setDebitCreditTotals({ debit: debitTotal, credit: creditTotal });
  }, [journalData.lines]);

  const handleClicksToCreateJournalEntryButton = () => {
    /* send journal entry data to backend via Axios instance */
    const createJournalEntry = async () => {
      // disables page
      setDisablePage(true);

      try {
        await instance
          .post(
            "api/accounting/accounting/journal_entries/create/",
            convertedJournalData,
            {
              headers: {
                "X-CSRFToken": csrfToken,
              },
            },
          )
          .then((response) => {
            if (response) {
              setJournalData(journalDataDefault);
              setDisablePage(false);
              window.document.getElementById("contact-select-dropdown").focus();
              console.log("Success...");
            }
          });
      } catch (e) {
        console.log(e);
        setDisablePage(false);
        window.alert("Error creating journal entry. Please try again.");
      }
    };

    /* drives code */
    createJournalEntry();
  };

  // updates the values of a journal line
  const updateLineField = (index, field, value) => {
    // updates journalData with new value for specified line and field
    setJournalData((prev) => ({
      ...prev,
      lines: prev.lines.map((line, i) =>
        i === index ? { ...line, [field]: value } : line,
      ),
    }));
  };

  // fetches list of accounts for dropdown menu
  useEffect(() => {
    const fetchAccountList = async () => {
      try {
        await instance
          .get("api/accounting/accounting/accounts/list/")
          .then((response) => {
            if (response) {
              setAccountChoices(response.data);

              setDisableToolbarButtons(false);
            }
          });
      } catch (e) {
        console.log(e);
        window.alert("Error creating journal entry. Please try again.");
        setDisableToolbarButtons(false);
      }
    };

    // drives code
    fetchAccountList();
  }, []);

  // fetches list of contacts for dropdown menu
  useEffect(() => {
    const fetchContactList = async () => {
      try {
        await instance
          .get("api/accounting/accounting/contacts/list/")
          .then((response) => {
            if (response) {
              setContactChoices(response.data);

              setDisableToolbarButtons(false);
            }
          });
      } catch (e) {
        console.log(e);
        window.alert("Error creating journal entry. Please try again.");
        setDisableToolbarButtons(false);
      }
    };

    // drives code
    fetchContactList();
  }, []);

  // submits journal entry data when user presses Enter key
  const handleKeyDownWhileInputFocus = (e) => {
    // submits data if Enter key is pressed while focus is on any of the input fields
    if (e.key === "Enter") {
      e.preventDefault();
      handleClicksToCreateJournalEntryButton();
    }

    // creates new line if user presses tab key while focus is on the last input field of the last journal line
    if (
      e.key === "Tab" &&
      !e.shiftKey &&
      e.target.classList.contains("line-amount-credit")
    ) {
      const journalLines = document.querySelectorAll(".journal-line");
      const lastCreditInput = journalLines[
        journalLines.length - 1
      ]?.querySelector(".line-amount-credit");
      if (e.target === lastCreditInput) {
        addNewLine();
      }
    }
  };

  // adds new journal line when user clicks "add new line" button
  const addNewLine = () => {
    if (journalData.lines.length < 10) {
      setJournalData((prev) => ({
        ...prev,
        lines: [
          ...prev.lines,
          { account: "", amount_debit: "", amount_credit: "" },
        ],
      }));
    }
  };

  // deletes journal line when user clicks "X" button on the line (except for the first 2 lines, which are the default number of lines)
  const handleClicksToDeleteLineButton = (e) => {
    if (e.target.classList.contains("delete-line-item-button")) {
      const lineIndex = Array.from(
        document.querySelectorAll(".delete-line-item-button"),
      ).indexOf(e.target);

      setJournalData((prev) => ({
        ...prev,
        lines: prev.lines.filter((line, index) => index !== lineIndex),
      }));
    }
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <section
        id="journal-entry-create-section"
        className={disablePage ? "disabled" : ""}
      >
        <div className="journal-entry-create-container card">
          <div className="journal-entry-create-body">
            <select
              id="contact-select-dropdown"
              autoFocus
              tabIndex={1}
              value={journalData.contact}
              className="journal"
              onChange={(e) => {
                setJournalData((prev) => ({
                  ...prev,
                  contact: e.target.value,
                }));
              }}
              onKeyDown={handleKeyDownWhileInputFocus}
            >
              <option value="">-------</option>
              {contactChoices.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.name}
                </option>
              ))}
            </select>
            <input
              tabIndex={2}
              value={journalData.date}
              className="date"
              type="date"
              onChange={(e) => {
                setJournalData((prev) => ({ ...prev, date: e.target.value }));
              }}
              onKeyDown={handleKeyDownWhileInputFocus}
            />
            <input
              placeholder="REF-001"
              tabIndex={3}
              value={journalData.reference}
              className="reference"
              type="text"
              onChange={(e) => {
                setJournalData((prev) => ({
                  ...prev,
                  reference: e.target.value,
                }));
              }}
              onKeyDown={handleKeyDownWhileInputFocus}
            />
            <input
              placeholder="内容"
              tabIndex={4}
              value={journalData.description}
              className="description"
              type="text"
              onChange={(e) => {
                setJournalData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }));
              }}
              onKeyDown={handleKeyDownWhileInputFocus}
            />
          </div>
          <div className="journal-lines-container">
            {journalData.lines.map((line, index) => (
              <div
                className={`journal-line${journalData.lines.length <= 2 ? " disable-cross" : ""}`}
                key={index}
              >
                <div
                  className="delete-line-item-button"
                  onClick={handleClicksToDeleteLineButton}
                />
                <select
                  tabIndex={5 + index * 2}
                  value={line.account}
                  className="line-account"
                  onChange={(e) =>
                    updateLineField(index, "account", e.target.value)
                  }
                  onKeyDown={handleKeyDownWhileInputFocus}
                >
                  <option value="">-------</option>
                  {accountChoices.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name_japanese}
                    </option>
                  ))}
                </select>
                <div className="amount-container">
                  <input
                    tabIndex={6 + index * 2}
                    placeholder="金額（借方）"
                    value={line.amount_debit}
                    className="line-amount-debit"
                    onChange={(e) =>
                      updateLineField(index, "amount_debit", e.target.value)
                    }
                    onKeyDown={handleKeyDownWhileInputFocus}
                  />

                  <input
                    tabIndex={7 + index * 2}
                    placeholder="金額（貸方）"
                    value={line.amount_credit}
                    className="line-amount-credit"
                    onChange={(e) =>
                      updateLineField(index, "amount_credit", e.target.value)
                    }
                    onKeyDown={handleKeyDownWhileInputFocus}
                  />
                </div>
              </div>
            ))}
            <div className="add-new-line-button" onClick={addNewLine} />
            <div
              className={`debit-credit-totals-line${debitCreditTotals.debit !== debitCreditTotals.credit ? " mismatch" : ""}`}
            >
              <div className="debit-total">
                {debitCreditTotals.debit.toLocaleString()}
              </div>
              <div className="debit-breakdown">
                {`${(debitCreditTotals.debit / 1.1).toLocaleString("ja-JP", { maximumFractionDigits: 0 })} + ${(debitCreditTotals.debit - debitCreditTotals.debit / 1.1).toLocaleString("ja-JP", { maximumFractionDigits: 0 })}`}
              </div>
              <div className="credit-total">
                {debitCreditTotals.credit.toLocaleString()}
              </div>

              <div className="credit-breakdown">
                {`${(debitCreditTotals.credit / 1.1).toLocaleString("ja-JP", { maximumFractionDigits: 0 })} + ${(debitCreditTotals.credit - debitCreditTotals.credit / 1.1).toLocaleString("ja-JP", { maximumFractionDigits: 0 })}`}
              </div>
            </div>
          </div>
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
