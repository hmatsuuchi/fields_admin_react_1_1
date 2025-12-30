import React, { Fragment } from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./BottomButtons.scss";

function BottomButtons({ csrfToken, invoiceData }) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

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
              console.log("invoice created successfully");
              console.log(response.data);
            }
          });
      } catch (e) {
        console.log(e);
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
              onClick={handleClicksToCreateInvoiceButton}
            >
              作成
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default BottomButtons;
