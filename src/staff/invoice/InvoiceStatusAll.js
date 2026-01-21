import React, { useEffect, useState, Fragment } from "react";
/* AXIOS */
import instance from "../../axios/axios_authenticated";
/* CSS */
import "./InvoiceStatusAll.scss";
/* COMPONENTS */
import InvoiceStatusAllToolbar from "../toolbar/invoice/InvoiceStatusAllToolbar";
import StagedChanges from "./InvoiceStatusAll/StagedChanges";

function InvoiceStatusAll({
  csrfToken,
  backButtonText,
  backButtonLink,
  displayBackButton,
  setDisplayBackButton,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const currentDate = new Date();

  const [invoicesAll, setInvoicesAll] = useState([]);
  const [stagedChanges, setStagedChanges] = useState([]);

  const [sendingChanges, setSendingChanges] = useState(false);
  const [disableToolbarButtons, setDisableToolbarButtons] = useState(true);

  const [selectedYear, setSelectedYear] = React.useState(
    currentDate.toISOString().slice(0, 4),
  );
  const [selectedMonth, setSelectedMonth] = React.useState(
    currentDate.toISOString().slice(5, 7),
  );

  const [displayDescriptors, setDisplayDescriptors] = useState([
    `0件を表示しています`,
  ]);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  // fetch invoices on component mount
  useEffect(() => {
    // fetches all invoices based on selected year and month
    const fetchInvoicesAll = async () => {
      const currentDate = new Date();

      try {
        await instance
          .get("api/invoices/invoices/status/all/", {
            params: {
              year: currentDate.toISOString().slice(0, 4),
              month: currentDate.toISOString().slice(5, 7),
            },
          })
          .then((response) => {
            if (response) {
              setInvoicesAll(response.data.invoices);
              setDisableToolbarButtons(false);
              setDisplayDescriptors([
                `${response.data.invoices.length}件を表示しています`,
              ]);
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    // drives code
    fetchInvoicesAll();
  }, []);

  // handles date input changes
  const handleDateInputChange = (
    invoiceId,
    field,
    newValue,
    previousValue,
    customerName,
    year,
    month,
  ) => {
    // UPDATE STAGED CHANGES ARRAY
    const valueIsChanged = newValue !== previousValue;

    const createNewRecord = !stagedChanges.find(
      (record) => record.id === invoiceId && record.field === field,
    );

    const updateExistingRecord = stagedChanges.find(
      (record) =>
        record.id === invoiceId &&
        record.field === field &&
        record.newValue !== newValue &&
        record.originalValue !== newValue &&
        !(record.originalValue === null && newValue === ""),
    );

    let updatedRecordFlag = false;

    // if no existing record, add new record to stagedChanges
    if (createNewRecord && valueIsChanged) {
      updatedRecordFlag = true;

      setStagedChanges((prevStagedChanges) => [
        {
          id: invoiceId,
          field: field,
          originalValue: previousValue,
          newValue: newValue,
          customerName: customerName,
          year: year,
          month: month,
        },
        ...prevStagedChanges,
      ]);
    }
    // if existing record found, update the newValue
    else if (updateExistingRecord && valueIsChanged) {
      updatedRecordFlag = true;

      setStagedChanges((prevStagedChanges) =>
        prevStagedChanges.map((record) =>
          record.id === invoiceId && record.field === field
            ? { ...record, newValue: newValue }
            : record,
        ),
      );
    }
    // if existing record's originalValue matches newValue, remove the record
    else {
      updatedRecordFlag = false;

      setStagedChanges((prevStagedChanges) =>
        prevStagedChanges.filter(
          (record) =>
            !(
              record.id === invoiceId &&
              record.field === field &&
              (record.originalValue === newValue ||
                (record.originalValue === null && newValue === ""))
            ),
        ),
      );
    }

    setInvoicesAll((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice.id === invoiceId
          ? {
              ...invoice,
              [field]: newValue,
              [`${field}_updated`]: updatedRecordFlag,
            }
          : invoice,
      ),
    );
  };

  // gets current date
  const dateToday = new Date().toISOString().slice(0, 10);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <section id="invoice-status-all">
        <ul id="display-descriptors-container">
          {displayDescriptors.map((descriptor, index) => (
            <li key={`display-descriptor-${index}`}>{descriptor}</li>
          ))}
        </ul>
        <div id="invoice-list-container">
          {invoicesAll.map((invoice) => {
            let subtotal = 0; // subtotal value for each invoice
            let taxTotal = 0; // tax total value for each invoice
            let total = 0; // total value for each invoice

            // calculates subtotal, tax total, and total for each invoice
            invoice.invoice_items.forEach((item) => {
              subtotal += item.quantity * item.rate;
              taxTotal += item.quantity * item.rate * (item.tax_rate / 100);
              total = subtotal + taxTotal;
            });

            return (
              <div className="invoice-container" key={invoice.id}>
                <div className="invoice-header">
                  <div>{invoice.customer_name}</div>
                  <div className="customer-name-romaji">{`${invoice.student.last_name_romaji}, ${invoice.student.first_name_romaji}`}</div>
                  <div className="invoice-year-month">
                    {invoice.year}年{invoice.month}月
                  </div>
                  <div className="invoice-total">
                    ¥{total.toLocaleString("ja-JP")}
                  </div>
                </div>

                <div className="invoice-status-container">
                  {/* invoice created status */}
                  <div
                    className={`invoice-creation-container ${
                      invoice.creation_date !== null &&
                      invoice.creation_date !== ""
                        ? "created"
                        : ""
                    } ${invoice.creation_date_updated ? "updated" : ""}`}
                  >
                    <div
                      className="status-text"
                      onClick={(e) =>
                        handleDateInputChange(
                          invoice.id,
                          "creation_date",
                          new Date().toISOString().slice(0, 10),
                          invoice.creation_date,
                          invoice.customer_name,
                          invoice.year,
                          invoice.month,
                        )
                      }
                    >
                      作成日
                    </div>
                    <input
                      type="date"
                      className="date-input"
                      value={
                        invoice.creation_date === null
                          ? ""
                          : invoice.creation_date
                      }
                      onChange={(e) =>
                        handleDateInputChange(
                          invoice.id,
                          "creation_date",
                          e.target.value,
                          invoice.creation_date,
                          invoice.customer_name,
                          invoice.year,
                          invoice.month,
                        )
                      }
                    />
                  </div>
                  {/* invoice issued status */}
                  <div
                    className={`invoice-issued-container ${
                      invoice.issued_date !== null && invoice.issued_date !== ""
                        ? "issued"
                        : ""
                    } ${invoice.issued_date_updated ? "updated" : ""}`}
                  >
                    <div
                      className="status-text"
                      onClick={(e) =>
                        handleDateInputChange(
                          invoice.id,
                          "issued_date",
                          dateToday,
                          invoice.issued_date,
                          invoice.customer_name,
                          invoice.year,
                          invoice.month,
                        )
                      }
                    >
                      {invoice.issued_date ? "発行日" : "未発行"}
                    </div>
                    <input
                      type="date"
                      className="date-input"
                      value={
                        invoice.issued_date === null ? "" : invoice.issued_date
                      }
                      onChange={(e) =>
                        handleDateInputChange(
                          invoice.id,
                          "issued_date",
                          e.target.value,
                          invoice.issued_date,
                          invoice.customer_name,
                          invoice.year,
                          invoice.month,
                        )
                      }
                    />
                  </div>
                  {/* invoice paid status */}
                  <div
                    className={`invoice-paid-container ${
                      invoice.paid_date !== null && invoice.paid_date !== ""
                        ? "paid"
                        : ""
                    } ${invoice.paid_date_updated ? "updated" : ""}`}
                  >
                    <div
                      className="status-text"
                      onClick={(e) =>
                        handleDateInputChange(
                          invoice.id,
                          "paid_date",
                          dateToday,
                          invoice.paid_date,
                          invoice.customer_name,
                          invoice.year,
                          invoice.month,
                        )
                      }
                    >
                      {invoice.paid_date ? "支払日" : "未払"}
                    </div>
                    <input
                      type="date"
                      className="date-input"
                      value={
                        invoice.paid_date === null ? "" : invoice.paid_date
                      }
                      onChange={(e) =>
                        handleDateInputChange(
                          invoice.id,
                          "paid_date",
                          e.target.value,
                          invoice.paid_date,
                          invoice.customer_name,
                          invoice.year,
                          invoice.month,
                        )
                      }
                    />
                  </div>
                </div>

                <div className="invoice-timestamps">
                  <div>
                    {invoice.date_time_created.slice(0, 10)}{" "}
                    {invoice.date_time_created.slice(11, 16)}
                  </div>
                  <div>
                    {invoice.date_time_modified.slice(0, 10)}{" "}
                    {invoice.date_time_modified.slice(11, 16)}
                  </div>
                  <div className="invoice-id">
                    {("000000" + invoice.id).slice(-7)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <StagedChanges
          csrfToken={csrfToken}
          setInvoicesAll={setInvoicesAll}
          stagedChanges={stagedChanges}
          setStagedChanges={setStagedChanges}
          setSendingChanges={setSendingChanges}
          setDisableToolbarButtons={setDisableToolbarButtons}
        />
      </section>
      <InvoiceStatusAllToolbar
        disableToolbarButtons={disableToolbarButtons}
        setDisableToolbarButtons={setDisableToolbarButtons}
        backButtonText={backButtonText}
        backButtonLink={backButtonLink}
        displayBackButton={displayBackButton}
        setDisplayBackButton={setDisplayBackButton}
        invoicesAll={invoicesAll}
        setInvoicesAll={setInvoicesAll}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        setDisplayDescriptors={setDisplayDescriptors}
      />
      <div id="overlay" className={sendingChanges ? "active" : ""} />
    </Fragment>
  );
}

export default InvoiceStatusAll;
