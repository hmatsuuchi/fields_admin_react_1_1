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
                <div className="invoice-id">
                  {("000000" + invoice.id).slice(-7)}
                </div>
                <div className="customer-info-container">
                  <div>{invoice.customer_name}</div>
                  <div>〒{invoice.customer_postal_code}</div>
                  <div>
                    {invoice.customer_prefecture}
                    {invoice.customer_city}
                  </div>
                  <div>{invoice.customer_address_line_1}</div>
                  <div>{invoice.customer_address_line_2}</div>
                </div>
                <div className="year-month">
                  {invoice.year}年{invoice.month}月
                </div>
                <div className="related-student">
                  関連生徒: {invoice.student.last_name_kanji}{" "}
                  {invoice.student.first_name_kanji}
                </div>
                <div className="invoice-details-container">
                  <div>支払方法: {invoice.payment_method.name}</div>
                  <div>作成日: {invoice.creation_date}</div>
                  <div>振込日: {invoice.transfer_date}</div>
                </div>
                <div className="invoice-status-container">
                  <div>発行日: {invoice.issued_date}</div>
                  <div>支払日: {invoice.paid_date}</div>
                  <div>発行済み: {invoice.issued ? "はい" : "いいえ"}</div>
                  <div>支払済み: {invoice.paid ? "はい" : "いいえ"}</div>
                </div>

                <div className="invoice-items-container">
                  {invoice.invoice_items.map((item) => {
                    return (
                      <div className="invoice-item" key={item.id}>
                        <div>{item.service_type.name}</div>
                        <div>{item.description}</div>
                        <div>{item.quantity}</div>
                        <div>¥{item.rate}</div>
                        <div>{item.tax_rate}%</div>
                      </div>
                    );
                  })}
                </div>
                <div className="invoice-timestamps">
                  <div>{invoice.date_time_created}</div>
                  <div>{invoice.date_time_modified}</div>
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
