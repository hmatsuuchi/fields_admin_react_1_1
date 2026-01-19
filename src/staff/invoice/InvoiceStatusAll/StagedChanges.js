import React from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./StagedChanges.scss";

function StagedChanges({
  csrfToken,
  setInvoicesAll,
  stagedChanges,
  setStagedChanges,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  const formatValue = {
    creation_date: "作成日",
    issued_date: "発行日",
    paid_date: "支払日",
  };

  const convertNullOrEmptyToVerbose = (value) => {
    if (value === null || value === "") {
      return "無";
    }
    return value;
  };

  const handleClicksToClearButton = () => {
    // edit invoicesAll to set creation_date_updated, issued_date_updated, paid_date_updated to false
    setInvoicesAll((prevInvoices) =>
      prevInvoices.map((invoice) => {
        let updatedInvoice = { ...invoice };
        if (invoice.creation_date_updated) {
          updatedInvoice.creation_date_updated = false;
        }
        if (invoice.issued_date_updated) {
          updatedInvoice.issued_date_updated = false;
        }
        if (invoice.paid_date_updated) {
          updatedInvoice.paid_date_updated = false;
        }
        return updatedInvoice;
      })
    );

    // clear stagedChanges array
    setStagedChanges([]);
  };

  const handleClicksToConfirmButton = () => {
    console.log(stagedChanges);

    // send stagedChanges to backend to update invoices
    const batchUpdateInvoiceStatus = async () => {
      try {
        await instance
          .post("api/invoices/invoices/status/batch-update/", stagedChanges, {
            headers: {
              "X-CSRFToken": csrfToken,
            },
          })
          .then((response) => {
            if (response) {
              console.log(response.data);
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    // drives code
    batchUpdateInvoiceStatus();
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return stagedChanges.length > 0 ? (
    <div id="staged-changes-container">
      {stagedChanges.map((record) => {
        return (
          <div
            className="record-container"
            key={`staged-change-${record.id}-${record.field}`}
          >
            <div>{record.customerName}</div>
            <div>
              {record.year.toString().slice(-2)}年{record.month}月
            </div>
            <div>#{("000000" + record.id).slice(-7)}</div>
            <div>{formatValue[record.field]}</div>
            <div className="date">
              {convertNullOrEmptyToVerbose(record.originalValue)}
            </div>
            <div>→</div>
            <div className="date">
              {convertNullOrEmptyToVerbose(record.newValue)}
            </div>
          </div>
        );
      })}
      <div className="button-container">
        <button className="clear-button" onClick={handleClicksToClearButton}>
          クリア
        </button>
        <button
          className="confirm-button"
          onClick={handleClicksToConfirmButton}
        >
          確定
        </button>
      </div>
    </div>
  ) : null;
}

export default StagedChanges;
