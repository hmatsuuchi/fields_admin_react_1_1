import React, { Fragment } from "react";
/* CSS */
import "./CustomerManualInput.scss";

function CustomerManualInput({ invoiceData, setInvoiceData }) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <div id="customer-manual-input-section">
        <div className="section-header">生徒情報</div>
        <input
          type="text"
          id="customer-name"
          value={invoiceData.customer_name}
          onChange={(e) =>
            setInvoiceData({
              ...invoiceData,
              customer_name: e.target.value,
            })
          }
        ></input>
        <input
          type="text"
          id="customer-post-code"
          value={invoiceData.customer_postal_code}
          onChange={(e) =>
            setInvoiceData({
              ...invoiceData,
              customer_postal_code: e.target.value,
            })
          }
        ></input>
        <input
          type="text"
          id="customer-prefecture"
          value={invoiceData.customer_prefecture}
          onChange={(e) =>
            setInvoiceData({
              ...invoiceData,
              customer_prefecture: e.target.value,
            })
          }
        ></input>
        <input
          type="text"
          id="customer-city"
          value={invoiceData.customer_city}
          onChange={(e) =>
            setInvoiceData({
              ...invoiceData,
              customer_city: e.target.value,
            })
          }
        ></input>
        <input
          type="text"
          id="customer-address-line-1"
          value={invoiceData.customer_address_line_1}
          onChange={(e) =>
            setInvoiceData({
              ...invoiceData,
              customer_address_line_1: e.target.value,
            })
          }
        ></input>
        <input
          type="text"
          id="customer-address-line-2"
          value={invoiceData.customer_address_line_2}
          onChange={(e) =>
            setInvoiceData({
              ...invoiceData,
              customer_address_line_2: e.target.value,
            })
          }
        ></input>
      </div>
    </Fragment>
  );
}

export default CustomerManualInput;
