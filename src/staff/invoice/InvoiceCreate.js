import React, { useState, Fragment } from "react";
/* CSS */
import "./InvoiceCreate.scss";
/* COMPONENTS */
import InvoiceCreateToolbar from "../../staff/toolbar/invoice/InvoiceCreateToolbar";
import CustomerSelect from "./InvoiceCreate/CustomerSelect";
import CustomerManualInput from "./InvoiceCreate/CustomerManualInput";
import CreationTransferDateManualInput from "./InvoiceCreate/CreationTransferDateManualInput";
import InvoiceLineItems from "./InvoiceCreate/InvoiceLineItems";
import BottomButtons from "./InvoiceCreate/BottomButtons";

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

  const dateTodayString = new Date().toISOString().slice(0, 10);

  const [invoiceData, setInvoiceData] = useState({
    customer_name: "",
    customer_postal_code: "",
    customer_prefecture: "",
    customer_city: "",
    customer_address_line_1: "",
    customer_address_line_2: "",

    year: parseInt(dateTodayString.slice(0, 4)), // default to this year
    month: parseInt(dateTodayString.slice(5, 7)), // default to this month
    creation_date: dateTodayString, // default to today's date
    transfer_date: "",
    paid_date: "",

    issued: false,
    paid: false,

    student: "",
    payment_method: "",

    line_items: [],
  });

  const [serviceTypeList, setServiceTypeList] = React.useState([]);
  const [taxesList, setTaxesList] = React.useState([]);
  const [taxesDefault, setTaxesDefault] = React.useState("");

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  // useEffect(() => {
  //   console.log(invoiceData);
  // }, [invoiceData]);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <section id="invoice-create">
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
        <BottomButtons
          csrfToken={csrfToken}
          invoiceData={invoiceData}
          setInvoiceData={setInvoiceData}
          setSearchTerm={setSearchTerm}
          setSelectedCustomerData={setSelectedCustomerData}
          taxesList={taxesList}
          taxesDefault={taxesDefault}
        />
      </section>
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
