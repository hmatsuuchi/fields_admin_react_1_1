import React, { useEffect, useState, Fragment } from "react";
/* AXIOS */
import instance from "../../axios/axios_authenticated";
/* CSS */
import "./InvoiceStatusAll.scss";
/* COMPONENTS */
import InvoiceStatusAllToolbar from "../toolbar/invoice/InvoiceStatusAllToolbar";
import StagedChanges from "./InvoiceStatusAll/StagedChanges";
/* LIVE INPUT FILTER */
import LiveInputFilter from "./InvoiceStatusAll/LiveInputFilter";
/* LOADING SPINNER */
import LoadingSpinner from "../micro/LoadingSpinner";

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

  // gets current date in Japan timezone as string
  const currentDate = new Date()
    .toLocaleDateString("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replaceAll("/", "-");

  const [invoicesAll, setInvoicesAll] = useState([]);
  const [stagedChanges, setStagedChanges] = useState([]);

  const [sendingChanges, setSendingChanges] = useState(false);
  const [disableToolbarButtons, setDisableToolbarButtons] = useState(true);

  // filter parameters
  const [selectedYear, setSelectedYear] = React.useState(
    parseInt(currentDate.slice(0, 4)),
  );
  const [selectedMonth, setSelectedMonth] = React.useState(
    parseInt(currentDate.slice(5, 7)),
  );
  const [displayUnissuedOnly, setDisplayUnissuedOnly] = useState(false);
  const [displayUnpaidOnly, setDisplayUnpaidOnly] = useState(false);
  const [displayStudentOnly, setDisplayStudentOnly] = useState({
    id: null,
    nameKanji: "",
  });
  const [textFilterInput, setTextFilterInput] = React.useState("");

  // applied filters
  const [appliedFilters, setAppliedFilters] = React.useState({
    selectedYear: selectedYear,
    selectedMonth: selectedMonth,
    displayUnissuedOnly: false,
    displayUnpaidOnly: false,
  });

  // display descriptors
  const [displayDescriptors, setDisplayDescriptors] = useState([]);

  // invoice total calculations
  const [invoiceTotalWithoutTax, setInvoiceTotalWithoutTax] = useState(0);
  const [unpaidInvoiceTotalWithoutTax, setUnpaidInvoiceTotalWithoutTax] =
    useState(0);

  // content loading state
  const [contentLoading, setContentLoading] = useState(true);

  // live filter text input
  const [liveFilterTextInput, setLiveFilterTextInput] = useState("");
  const [liveFilterTextInputIsOpen, setLiveFilterTextInputIsOpen] =
    useState(false);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  // fetch invoices on component mount
  useEffect(() => {
    // fetches all invoices based on selected year and month
    const fetchInvoicesAll = async () => {
      try {
        await instance
          .get("api/invoices/invoices/status/all/", {
            params: {
              year: currentDate.slice(0, 4),
              month: currentDate.slice(5, 7),
            },
          })
          .then((response) => {
            if (response) {
              setInvoicesAll(response.data.invoices);
              setDisableToolbarButtons(false);
              setContentLoading(false);
            }
          });
      } catch (e) {
        console.log(e);
        window.alert("エラーが発生しました。ページをリロードしてください。");

        setDisableToolbarButtons(false);
        setContentLoading(false);
      }
    };

    // drives code
    fetchInvoicesAll();
  }, [currentDate]);

  // fetches invoices for manual clicks to various filters in toolbar
  const fetchInvoicesAll = async (studentId) => {
    // disables toolbar buttons
    setDisableToolbarButtons(true);

    // sets content loading state
    setContentLoading(true);

    // resets invoices
    setInvoicesAll([]);

    // resets filters
    setSelectedYear("");
    setSelectedMonth("");
    setDisplayUnissuedOnly(false);
    setDisplayUnpaidOnly(false);

    // fetches invoices
    try {
      await instance
        .get("api/invoices/invoices/status/all/", {
          params: {
            display_student_only_id: studentId,
          },
        })
        .then((response) => {
          if (response) {
            // sets invoice data with response from server
            setInvoicesAll(response.data.invoices);

            // re-enables toolbar buttons and content
            setDisableToolbarButtons(false);
            setContentLoading(false);
          }
        });
    } catch (e) {
      console.log(e);
      window.alert("エラーが発生しました。ページをリロードしてください。");
      setDisableToolbarButtons(false);
      setContentLoading(false);
    }
  };

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

    // (1) if no existing record, add new record to stagedChanges
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

    // (2) if existing record found, update the newValue
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

    // (3) if existing record's originalValue matches newValue, remove the record
    else {
      // if values differ, mark as updated
      if (!valueIsChanged) {
        updatedRecordFlag = true;
      }

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

    // refocus on quick search input if active
    if (liveFilterTextInputIsOpen) {
      const inputElement = document.getElementById("live-input-filter-input");
      if (inputElement) {
        inputElement.focus();
        inputElement.select();
      }
    }
  };

  // gets current date
  useEffect(() => {
    let workingInvoiceTotal = 0;
    let workingUnpaidInvoiceTotal = 0;

    invoicesAll.forEach((invoice) => {
      // calculates total for all invoices
      invoice.invoice_items.forEach((item) => {
        workingInvoiceTotal += item.quantity * item.rate;
      });

      // calculates total for unpaid invoices
      if (invoice.paid_date === null || invoice.paid_date === "") {
        invoice.invoice_items.forEach((item) => {
          workingUnpaidInvoiceTotal += item.quantity * item.rate;
        });
      }
    });

    setInvoiceTotalWithoutTax(workingInvoiceTotal);
    setUnpaidInvoiceTotalWithoutTax(workingUnpaidInvoiceTotal);
  }, [invoicesAll]);

  // handles clicks to display student only button
  const handleClicksToDisplayStudentOnlyButton = (
    studentId,
    studentNameKanji,
  ) => {
    // resets staged changes
    setStagedChanges([]);

    // clears all filters
    setSelectedYear("");
    setSelectedMonth("");
    setDisplayUnissuedOnly(false);
    setDisplayUnpaidOnly(false);

    // resets applied filters
    setAppliedFilters({
      selectedYear: "",
      selectedMonth: "",
      displayUnissuedOnly: false,
      displayUnpaidOnly: false,
    });

    // sets display student only filter
    setDisplayStudentOnly({ id: studentId, nameKanji: studentNameKanji });
    // fetches invoices for the selected student only
    fetchInvoicesAll(studentId);
  };

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
        {contentLoading ? (
          <LoadingSpinner />
        ) : (
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
                <div
                  className={`invoice-container${invoice.matchesLiveFilter ? " matches-filter" : ""}`}
                  key={invoice.id}
                >
                  {/* display student only button */}
                  <div
                    className="display-student-only-button"
                    onClick={() =>
                      handleClicksToDisplayStudentOnlyButton(
                        invoice.student.id,
                        `${invoice.student.last_name_kanji} ${invoice.student.first_name_kanji}`,
                      )
                    }
                  />
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
                            currentDate.slice(0, 10),
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
                        invoice.issued_date !== null &&
                        invoice.issued_date !== ""
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
                            currentDate.slice(0, 10),
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
                          invoice.issued_date === null
                            ? ""
                            : invoice.issued_date
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
                            currentDate.slice(0, 10),
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
        )}

        {/* staged changes component */}
        <StagedChanges
          csrfToken={csrfToken}
          setInvoicesAll={setInvoicesAll}
          stagedChanges={stagedChanges}
          setStagedChanges={setStagedChanges}
          setSendingChanges={setSendingChanges}
          setDisableToolbarButtons={setDisableToolbarButtons}
        />
      </section>

      {/* live input filter component */}
      <LiveInputFilter
        liveFilterTextInput={liveFilterTextInput}
        setLiveFilterTextInput={setLiveFilterTextInput}
        invoicesAll={invoicesAll}
        setInvoicesAll={setInvoicesAll}
        liveFilterTextInputIsOpen={liveFilterTextInputIsOpen}
        setLiveFilterTextInputIsOpen={setLiveFilterTextInputIsOpen}
      />

      {/* toolbar */}
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
        setStagedChanges={setStagedChanges}
        invoiceTotalWithoutTax={invoiceTotalWithoutTax}
        unpaidInvoiceTotalWithoutTax={unpaidInvoiceTotalWithoutTax}
        displayUnissuedOnly={displayUnissuedOnly}
        setDisplayUnissuedOnly={setDisplayUnissuedOnly}
        displayUnpaidOnly={displayUnpaidOnly}
        setDisplayUnpaidOnly={setDisplayUnpaidOnly}
        displayStudentOnly={displayStudentOnly}
        setDisplayStudentOnly={setDisplayStudentOnly}
        appliedFilters={appliedFilters}
        setAppliedFilters={setAppliedFilters}
        textFilterInput={textFilterInput}
        setTextFilterInput={setTextFilterInput}
        setContentLoading={setContentLoading}
      />
      <div id="overlay" className={sendingChanges ? "active" : ""} />
    </Fragment>
  );
}

export default InvoiceStatusAll;
