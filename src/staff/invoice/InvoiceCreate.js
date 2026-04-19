import React, { useState, Fragment, useEffect } from "react";
/* CSS */
import "./InvoiceCreate.scss";
/* COMPONENTS */
import InvoiceCreateToolbar from "../../staff/toolbar/invoice/InvoiceCreateToolbar";
import CustomerSelect from "./InvoiceCreate/CustomerSelect";
import CustomerManualInput from "./InvoiceCreate/CustomerManualInput";
import CreationTransferDateManualInput from "./InvoiceCreate/CreationTransferDateManualInput";
import InvoiceLineItems from "./InvoiceCreate/InvoiceLineItems";
import BottomButtons from "./InvoiceCreate/BottomButtons";
import CustomerAttendance from "./InvoiceCreate/CustomerAttendance";
import CustomerInvoices from "./InvoiceCreate/CustomerInvoices";

function InvoiceCreate({
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

  /* search term input field value for the customer select dropdown*/
  const [searchTerm, setSearchTerm] = useState("");

  /* selected customer data */
  const [selectedCustomerData, setSelectedCustomerData] = useState({
    last_name_kanji: "",
    first_name_kanji: "",
    last_name_romaji: "",
    first_name_romaji: "",
    last_name_katakana: "",
    first_name_katakana: "",
    grade_verbose: "",
    post_code: "",
    prefecture_verbose: "",
    city: "",
    address_1: "",
    address_2: "",
  });

  // today
  const dateToday = new Date();
  // get the date object for the first day of the next month to set as the default creation date
  const nextMonth = new Date(
    dateToday.getFullYear(),
    dateToday.getMonth() + 1,
    1,
  );

  const [invoiceData, setInvoiceData] = useState({
    customer_name: "",
    customer_postal_code: "",
    customer_prefecture: "",
    customer_city: "",
    customer_address_line_1: "",
    customer_address_line_2: "",

    year: nextMonth.getFullYear(), // default to this year
    month: nextMonth.getMonth() + 1, // default to next month
    creation_date: dateToday.toISOString().slice(0, 10), // default to today's date
    transfer_date: "",
    paid_date: "",

    issued: false,
    paid: false,

    student: "",
    payment_method: "",

    line_items: [],
  });

  const [subtotalTaxTotal, setSubtotalTaxTotal] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  const [serviceTypeList, setServiceTypeList] = React.useState([]);
  const [taxesList, setTaxesList] = React.useState([]);
  const [taxesDefault, setTaxesDefault] = React.useState("");

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  useEffect(() => {
    let subtotal = 0;
    let tax = 0;
    let total = 0;
    invoiceData.line_items.forEach((item) => {
      subtotal += item.quantity * item.rate;
      tax += item.quantity * item.rate * (item.tax_rate / 100);
      total += item.quantity * item.rate * (1 + item.tax_rate / 100);
    });
    setSubtotalTaxTotal({ subtotal, tax, total });
  }, [invoiceData]);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <section id="invoice-create">
        <div className="invoice-create-container card">
          <div id="customer-input-section">
            {/* select the associated customer from a search field and dropdown menu */}
            <CustomerSelect
              setDisableToolbarButtons={setDisableToolbarButtons}
              invoiceData={invoiceData}
              setInvoiceData={setInvoiceData}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCustomerData={selectedCustomerData}
              setSelectedCustomerData={setSelectedCustomerData}
            />

            {/* manually input customer data */}
            <CustomerManualInput
              invoiceData={invoiceData}
              setInvoiceData={setInvoiceData}
            />

            {/* manually input creation/transfer date */}
            <CreationTransferDateManualInput
              invoiceData={invoiceData}
              setInvoiceData={setInvoiceData}
            />
          </div>
          <div id="invoice-line-items-section">
            <InvoiceLineItems
              invoiceData={invoiceData}
              setInvoiceData={setInvoiceData}
              serviceTypeList={serviceTypeList}
              setServiceTypeList={setServiceTypeList}
              taxesList={taxesList}
              setTaxesList={setTaxesList}
              taxesDefault={taxesDefault}
              setTaxesDefault={setTaxesDefault}
            />
          </div>
          <div className="invoice-totals-container">
            <div className="subtotal-label">小計</div>
            <div className="subtotal">
              {subtotalTaxTotal.subtotal.toLocaleString("ja-JP")}円
            </div>
            <div className="tax-label">消費税</div>
            <div className="tax">
              {subtotalTaxTotal.tax.toLocaleString("ja-JP")}円
            </div>
            <div className="total-label">合計</div>
            <div className="total">
              {subtotalTaxTotal.total.toLocaleString("ja-JP")}円
            </div>
          </div>
          <BottomButtons
            csrfToken={csrfToken}
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
            setSearchTerm={setSearchTerm}
            setSelectedCustomerData={setSelectedCustomerData}
            taxesList={taxesList}
            taxesDefault={taxesDefault}
          />
        </div>
      </section>
      <CustomerAttendance associatedStudentId={invoiceData["student"]} />
      <CustomerInvoices associatedStudentId={invoiceData["student"]} />
      <InvoiceCreateToolbar
        disableToolbarButtons={disableToolbarButtons}
        backButtonText={backButtonText}
        backButtonLink={backButtonLink}
        displayBackButton={displayBackButton}
        setDisplayBackButton={setDisplayBackButton}
      />
    </Fragment>
  );
}

export default InvoiceCreate;
