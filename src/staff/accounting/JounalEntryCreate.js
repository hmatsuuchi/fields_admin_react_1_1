import React, { Fragment, useState, useEffect } from "react";
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

  const [accountChoices, setAccountChoices] = useState([]);

  const journalDataDefault = {
    date: "",
    description: "",
    reference: "",
    lines: [
      { account: "", amount_debit: "", amount_credit: "" },
      { account: "", amount_debit: "", amount_credit: "" },
      { account: "", amount_debit: "", amount_credit: "" },
      { account: "", amount_debit: "", amount_credit: "" },
      { account: "", amount_debit: "", amount_credit: "" },
      { account: "", amount_debit: "", amount_credit: "" },
      { account: "", amount_debit: "", amount_credit: "" },
      { account: "", amount_debit: "", amount_credit: "" },
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

  useEffect(() => {
    setConvertedJournalData({
      date: journalData.date,
      description: journalData.description,
      reference: journalData.reference,
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
            convertedJournalData,
            {
              headers: {
                "X-CSRFToken": csrfToken,
              },
            },
          )
          .then((response) => {
            if (response) {
              window.alert("Journal entry created successfully!");
              setJournalData(journalDataDefault);
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

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <section id="journal-entry-create-section">
        <div className="journal-entry-create-container card">
          <div className="journal-entry-create-body">
            <input
              value={journalData.date}
              className="date"
              type="date"
              onChange={(e) => {
                setJournalData((prev) => ({ ...prev, date: e.target.value }));
              }}
            />
            <input
              placeholder="REF-001"
              value={journalData.reference}
              className="reference"
              type="text"
              onChange={(e) => {
                setJournalData((prev) => ({
                  ...prev,
                  reference: e.target.value,
                }));
              }}
            />
            <input
              placeholder="内容"
              value={journalData.description}
              className="description"
              type="text"
              onChange={(e) => {
                setJournalData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }));
              }}
            />
          </div>
          <div className="journal-lines-container">
            {journalData.lines.map((line, index) => (
              <div className="journal-line" key={index}>
                <select
                  value={line.account}
                  className="line-account"
                  onChange={(e) =>
                    updateLineField(index, "account", e.target.value)
                  }
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
                    placeholder="金額（借方）"
                    value={line.amount_debit}
                    className="line-amount-debit"
                    onChange={(e) =>
                      updateLineField(index, "amount_debit", e.target.value)
                    }
                  />

                  <input
                    placeholder="金額（貸方）"
                    value={line.amount_credit}
                    className="line-amount-credit"
                    onChange={(e) =>
                      updateLineField(index, "amount_credit", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
            <div
              className={`debit-credit-totals-line${debitCreditTotals.debit !== debitCreditTotals.credit ? " mismatch" : ""}`}
            >
              <div className="debit-total">
                {debitCreditTotals.debit.toLocaleString()}
              </div>
              <div className="credit-total">
                {debitCreditTotals.credit.toLocaleString()}
              </div>
            </div>
            <div className="debit-credit-totals-line">
              <div className="debit-breakdown">
                {`(${(debitCreditTotals.debit / 1.1).toLocaleString("ja-JP", { maximumFractionDigits: 0 })} + ${(debitCreditTotals.debit - debitCreditTotals.debit / 1.1).toLocaleString("ja-JP", { maximumFractionDigits: 0 })})`}
              </div>
              <div className="credit-breakdown">
                {`(${(debitCreditTotals.credit / 1.1).toLocaleString("ja-JP", { maximumFractionDigits: 0 })} + ${(debitCreditTotals.credit - debitCreditTotals.credit / 1.1).toLocaleString("ja-JP", { maximumFractionDigits: 0 })})`}
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
