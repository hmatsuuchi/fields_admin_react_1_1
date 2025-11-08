import React, { useState, Fragment } from "react";
/* CSS */
import "./InvoiceCreate.scss";
/* COMPONENTS */
import InvoiceCreateToolbar from "../../staff/toolbar/invoice/InvoiceCreateToolbar";
import CustomerSelect from "./InvoiceCreate/CustomerSelect";

function InvoiceCreate({
  backButtonText,
  backButtonLink,
  displayBackButton,
  setDisplayBackButton,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [disableToolbarButtons, setDisableToolbarButtons] = useState(true);

  const [invoiceCustomerData, setInvoiceCustomerData] = useState({
    full_name_kanji: "",
    grade_verbose: "",
    post_code: "",
    prefecture_verbose: "",
    city: "",
    address_1: "",
    address_2: "",
  });

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <section id="invoice-create">
        <div id="input-section">
          <CustomerSelect
            setDisableToolbarButtons={setDisableToolbarButtons}
            setInvoiceCustomerData={setInvoiceCustomerData}
          />
          <div id="customer-manual-input-section">
            <input
              type="text"
              id="customer-name"
              value={invoiceCustomerData.full_name_kanji}
              onChange={(e) =>
                setInvoiceCustomerData({
                  ...invoiceCustomerData,
                  full_name_kanji: e.target.value,
                })
              }
            ></input>
            <input
              type="text"
              id="customer-post-code"
              value={invoiceCustomerData.post_code}
              onChange={(e) =>
                setInvoiceCustomerData({
                  ...invoiceCustomerData,
                  post_code: e.target.value,
                })
              }
            ></input>
            <input
              type="text"
              id="customer-prefecture"
              value={invoiceCustomerData.prefecture_verbose}
              onChange={(e) =>
                setInvoiceCustomerData({
                  ...invoiceCustomerData,
                  prefecture_verbose: e.target.value,
                })
              }
            ></input>
            <input
              type="text"
              id="customer-city"
              value={invoiceCustomerData.city}
              onChange={(e) =>
                setInvoiceCustomerData({
                  ...invoiceCustomerData,
                  city: e.target.value,
                })
              }
            ></input>
            <input
              type="text"
              id="customer-address-line-1"
              value={invoiceCustomerData.address_1}
              onChange={(e) =>
                setInvoiceCustomerData({
                  ...invoiceCustomerData,
                  address_1: e.target.value,
                })
              }
            ></input>
            <input
              type="text"
              id="customer-address-line-2"
              value={invoiceCustomerData.address_2}
              onChange={(e) =>
                setInvoiceCustomerData({
                  ...invoiceCustomerData,
                  address_2: e.target.value,
                })
              }
            ></input>
          </div>
        </div>
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
