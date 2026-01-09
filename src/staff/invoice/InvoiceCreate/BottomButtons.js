import React, { Fragment } from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./BottomButtons.scss";

function BottomButtons({
  csrfToken,
  invoiceData,
  setInvoiceData,
  setSearchTerm,
  setSelectedCustomerData,
  taxesList,
  taxesDefault,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* calculates default tax rate based on default tax type */
  function calculateDefaultTaxRate(taxesList, taxesDefault) {
    const defaultTaxObject = taxesList.find(
      (taxItem) => taxItem.id === taxesDefault
    );
    if (defaultTaxObject) {
      return defaultTaxObject.rate;
    } else {
      return "";
    }
  }

  const resetInvoiceData = () => {
    const dateToday = new Date().toISOString().slice(0, 10);

    /* resets invoice data state to initial state */
    setInvoiceData({
      customer_name: "",
      customer_postal_code: "",
      customer_prefecture: "",
      customer_city: "",
      customer_address_line_1: "",
      customer_address_line_2: "",

      year: parseInt(dateToday.slice(0, 4)), // defaults to current year
      month: parseInt(dateToday.slice(5, 7)), // defaults to current month
      transfer_date: "",
      creation_date: dateToday, // default to today's date
      paid_date: "",

      issued: false,
      paid: false,

      student: "",
      payment_method: "",

      line_items: [
        {
          description: "",
          quantity: "",
          rate: "",
          tax_type: taxesDefault,
          tax_rate: calculateDefaultTaxRate(taxesList, taxesDefault),
          service_type: "",
        },
      ],
    });

    /* resets search term in customer select dropdown */
    setSearchTerm("");

    /* resets selected customer data */
    setSelectedCustomerData({
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

    /* return focus to student select input field */
    const studentSelectInputField = document.getElementById("customer-search");
    if (studentSelectInputField) {
      studentSelectInputField.focus();
    }
  };

  const handleClicksToCreateInvoiceButton = () => {
    /* send invoice data to backend via Axios instance */
    const createInvoice = async () => {
      try {
        await instance
          .post("api/invoices/invoices/create/invoice/", invoiceData, {
            headers: {
              "X-CSRFToken": csrfToken,
            },
          })
          .then((response) => {
            if (response) {
              /* resets invoice data if created successfully */
              resetInvoiceData();
            }
          });
      } catch (e) {
        console.log(e);
        window.alert("Error creating invoice. Please try again.");
      }
    };

    /* drives code */
    createInvoice();
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <div id="invoice-creation-bottom-buttons-section">
        <div className="bottom-buttons-container">
          <div className="button-group-container">
            <button
              id="create-invoice-button"
              className="button"
              type="submit"
              tabIndex="62"
              onClick={handleClicksToCreateInvoiceButton}
            >
              保存して新規
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default BottomButtons;
