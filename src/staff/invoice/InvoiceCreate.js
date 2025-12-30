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

  const [invoiceData, setInvoiceData] = useState({
    customer_name: "",
    customer_postal_code: "",
    customer_prefecture: "",
    customer_city: "",
    customer_address_line_1: "",
    customer_address_line_2: "",

    year: "",
    month: "",
    transfer_date: "",
    creation_date: "",
    paid_date: "",

    issued: false,
    paid: false,

    student: "",
    payment_method: "",

    line_items: [],
  });

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  useEffect(() => {
    console.log(invoiceData);
  }, [invoiceData]);

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
            setInvoiceData={setInvoiceData}
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
          />
        </div>
        <BottomButtons csrfToken={csrfToken} invoiceData={invoiceData} />
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
