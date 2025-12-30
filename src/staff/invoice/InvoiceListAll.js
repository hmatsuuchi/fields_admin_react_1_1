import React, { useEffect, useState, Fragment } from "react";
/* AXIOS */
import instance from "../../axios/axios_authenticated";
/* CSS */
import "./InvoiceListAll.scss";
/* COMPONENTS */
import InvoiceListAllToolbar from "../../staff/toolbar/invoice/InvoiceListAllToolbar";

function InvoiceListAll({
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
      await instance.get("api/invoices/invoices/list/all/").then((response) => {
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
      <section id="invoice-list-all">
        <div id="invoice-list-container">
          {invoicesAll.map((invoice) => {
            return (
              <div className="invoice-container" key={invoice.id}>
                <div>Invoice ID: {invoice.id}</div>
                <div className="placeholder-gap" />
                <div>Customer Name: {invoice.customer_name}</div>
                <div>Customer Postal Code: {invoice.customer_postal_code}</div>
                <div>Customer Prefecture: {invoice.customer_prefecture}</div>
                <div>Customer City: {invoice.customer_city}</div>
                <div>
                  Customer Address Line 1: {invoice.customer_address_line_1}
                </div>
                <div>
                  Customer Address Line 2: {invoice.customer_address_line_2}
                </div>
                <div className="placeholder-gap" />
                <div>Year: {invoice.year}</div>
                <div>Month: {invoice.month}</div>
                <div className="placeholder-gap" />
                <div>Creation Date: {invoice.creation_date}</div>
                <div>Transfer Date: {invoice.transfer_date}</div>
                <div>Issued Date: {invoice.issued_date}</div>
                <div>Paid Date: {invoice.paid_date}</div>
                <div className="placeholder-gap" />
                <div>Issued: {invoice.issued ? "Yes" : "No"}</div>
                <div>Paid: {invoice.paid ? "Yes" : "No"}</div>
                <div className="placeholder-gap" />
                <div>Student [FK]: {invoice.student.id}</div>
                <div>Payment Method [FK]: {invoice.payment_method.name}</div>
                <div className="placeholder-gap" />
                <div>Date/Time Created: {invoice.date_time_created}</div>
                <div>Date/Time Modified: {invoice.date_time_modified}</div>

                <div className="invoice-items-container">
                  {invoice.invoice_items.map((item) => {
                    return (
                      <div className="invoice-item" key={item.id}>
                        <div>Item Id: {item.id}</div>
                        <div className="placeholder-gap" />
                        <div>Description: {item.description}</div>
                        <div>Quantity: {item.quantity}</div>
                        <div>Rate: {item.rate}</div>
                        <div>Tax Rate: {item.tax_rate}</div>
                        <div className="placeholder-gap" />
                        <div>Invoice [FK]: {item.invoice.id}</div>
                        <div>Service Type [FK]: {item.service_type.id}</div>
                        <div>Tax Type [FK]: {item.tax_type.id}</div>
                        <div className="placeholder-gap" />
                        <div>Date/Time Created: {item.date_time_created}</div>
                        <div>Date/Time Modified: {item.date_time_modified}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <InvoiceListAllToolbar
        disableToolbarButtons={disableToolbarButtons}
        backButtonText={backButtonText}
        backButtonLink={backButtonLink}
        displayBackButton={displayBackButton}
        setDisplayBackButton={setDisplayBackButton}
      />
    </Fragment>
  );
}

export default InvoiceListAll;
