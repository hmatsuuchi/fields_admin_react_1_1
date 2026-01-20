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
  setSendingChanges,
  setDisableToolbarButtons,
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
    // create a map of changes for quick lookup
    const changesMap = new Map();
    stagedChanges.forEach((record) => {
      if (!changesMap.has(record.id)) {
        changesMap.set(record.id, {});
      }
      changesMap.get(record.id)[record.field] = record.originalValue;
    });

    // edit invoicesAll to reset values and updated flags
    setInvoicesAll((prevInvoices) =>
      prevInvoices.map((invoice) => {
        const changes = changesMap.get(invoice.id);
        if (!changes) return invoice;

        return {
          ...invoice,
          ...changes,
          creation_date_updated: false,
          issued_date_updated: false,
          paid_date_updated: false,
        };
      })
    );

    // clear stagedChanges array
    setStagedChanges([]);
  };

  const handleClicksToConfirmButton = () => {
    console.log(stagedChanges);

    // send stagedChanges to backend to update invoices
    const batchUpdateInvoiceStatus = async () => {
      // disable screen and toolbar
      setSendingChanges(true);
      setDisableToolbarButtons(true);

      try {
        await instance
          .post("api/invoices/invoices/status/batch-update/", stagedChanges, {
            headers: {
              "X-CSRFToken": csrfToken,
            },
          })
          .then((response) => {
            if (response.status === 200) {
              // re-enable screen and toolbar
              setSendingChanges(false);
              setDisableToolbarButtons(false);

              // clear stagedChanges array and keep changes in invoicesAll
              setStagedChanges([]);
              setInvoicesAll((prevInvoices) =>
                prevInvoices.map((invoice) => {
                  return {
                    ...invoice,
                    creation_date_updated: false,
                    issued_date_updated: false,
                    paid_date_updated: false,
                  };
                })
              );
            }
          });
      } catch (e) {
        console.log(e);
        window.Error("エラーが発生しました。もう一度お試しください。");
        // re-enable screen and toolbar
        setSendingChanges(false);
        setDisableToolbarButtons(false);
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
