import React, { useEffect, useState, Fragment } from "react";
/* AXIOS */
import instance from "../../axios/axios_authenticated";
/* CSS */
import "./InvoiceStatusAll.scss";
/* COMPONENTS */
import InvoiceStatusAllToolbar from "../toolbar/invoice/InvoiceStatusAllToolbar";

function InvoiceStatusAll({
  backButtonText,
  backButtonLink,
  displayBackButton,
  setDisplayBackButton,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [invoicesAll, setInvoicesAll] = useState([]);

  const [disableToolbarButtons, setDisableToolbarButtons] = useState(true);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  const fetchInvoicesAll = async () => {
    try {
      await instance
        .get("api/invoices/invoices/status/all/")
        .then((response) => {
          if (response) {
            console.log(response.data.invoices);
            setInvoicesAll(response.data.invoices);
            setDisableToolbarButtons(false);
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchInvoicesAll();
  }, []);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <section id="invoice-status-all">
        <div id="invoice-list-container">
          {invoicesAll.map((invoice) => {
            let subtotal = 0; // subtotal value for each invoice
            let taxTotal = 0; // tax total value for each invoice
            let total = 0; // total value for each invoice

            return (
              <div className="invoice-container" key={invoice.id}>
                <div className="customer-info-container">
                  <div>{invoice.customer_name}</div>
                </div>
                <div className="year-month">
                  {invoice.year}年{invoice.month}月
                </div>

                <div className="invoice-details-container">
                  <div>作成日: {invoice.creation_date}</div>
                </div>
                <div className="invoice-status-container">
                  <div
                    className={`invoice-issued-container ${
                      invoice.issued & (invoice.issued_date !== null)
                        ? "issued"
                        : ""
                    }`}
                  >
                    <div className="status-text">
                      {invoice.issued ? "発行済" : "未発行"}
                    </div>
                    {invoice.issued_date !== null ? (
                      <div className="date">{invoice.issued_date}</div>
                    ) : null}
                  </div>
                  <div
                    className={`invoice-paid-container ${
                      invoice.paid & (invoice.paid_date !== null) ? "paid" : ""
                    }`}
                  >
                    <div className="status-text">
                      {invoice.paid ? "支払済" : "未払"}
                    </div>
                    {invoice.paid_date !== null ? (
                      <div className="date">{invoice.paid_date}</div>
                    ) : null}
                  </div>
                </div>

                {invoice.invoice_items.forEach((item) => {
                  subtotal += item.quantity * item.rate;
                  taxTotal += item.quantity * item.rate * (item.tax_rate / 100);
                  total = subtotal + taxTotal;
                })}

                <div className="subtotal-tax-total-container">
                  <div className="invoice-total">合計</div>
                  <div className="invoice-total">
                    ¥{total.toLocaleString("ja-JP")}
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
      </section>
      <InvoiceStatusAllToolbar
        disableToolbarButtons={disableToolbarButtons}
        backButtonText={backButtonText}
        backButtonLink={backButtonLink}
        displayBackButton={displayBackButton}
        setDisplayBackButton={setDisplayBackButton}
      />
    </Fragment>
  );
}

export default InvoiceStatusAll;
