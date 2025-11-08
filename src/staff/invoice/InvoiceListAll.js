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
                <p>Invoice ID: {invoice.id}</p>
                <p>Cusomer [FK]: {invoice.student.id}</p>
                <p>Customer Name: {invoice.customer_name}</p>
                <p>Customer Postal Code: {invoice.customer_postal_code}</p>
                <p>Customer Prefecture: {invoice.customer_prefecture}</p>
                <p>Customer City: {invoice.customer_city}</p>
                <p>
                  Customer Address Line 1: {invoice.customer_address_line_1}
                </p>
                <p>
                  Customer Address Line 2: {invoice.customer_address_line_2}
                </p>
                <p>
                  Date: {invoice.year}/{invoice.month}
                </p>
                <p>Payment Method [FK]: {invoice.payment_method.name}</p>
                <p>Transfer Date: {invoice.transfer_date}</p>
                <p>Issued: {invoice.issued ? "Yes" : "No"}</p>
                <p>Paid: {invoice.paid ? "Yes" : "No"}</p>
                <div className="invoice-items-container">
                  {invoice.invoice_items.map((item) => {
                    return (
                      <div className="invoice-item" key={item.id}>
                        <p>Item Id: {item.id}</p>
                        <p>
                          Service Type [FK]: {item.service_type.name}、
                          {item.service_type.price
                            ? `¥${item.service_type.price}`
                            : "N/A"}
                          、[{item.service_type.tax.name}、
                          {item.service_type.tax.rate}%]
                        </p>
                        <p>Description: {item.description}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Rate: {item.rate}</p>
                        <p>Tax: {item.tax}%</p>
                        <p>
                          Subtotal: ¥
                          {item.rate * item.quantity * (1 + item.tax / 100)}
                        </p>
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
