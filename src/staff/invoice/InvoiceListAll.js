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
          // console.log(response.data.invoices);
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
            let subtotal = 0; // subtotal value for each invoice
            let taxTotal = 0; // tax total value for each invoice
            let total = 0; // total value for each invoice

            return (
              <div className="invoice-container" key={invoice.id}>
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
                  <div>作成日: {invoice.creation_date}</div>
                  <div>支払方法: {invoice.payment_method.name}</div>
                  <div>振込日: {invoice.transfer_date}</div>
                </div>
                <div className="invoice-status-container">
                  <div
                    className={`invoice-issued-container ${
                      invoice.issued_date !== null ? "issued" : ""
                    }`}
                  >
                    <div className="status-text">
                      {invoice.issued_date !== null ? "発行済" : "未発行"}
                    </div>
                    {invoice.issued_date !== null ? (
                      <div className="date">{invoice.issued_date}</div>
                    ) : null}
                  </div>
                  <div
                    className={`invoice-paid-container ${
                      invoice.paid_date !== null ? "paid" : ""
                    }`}
                  >
                    <div className="status-text">
                      {invoice.paid_date !== null ? "支払済" : "未払"}
                    </div>
                    {invoice.paid_date !== null ? (
                      <div className="date">{invoice.paid_date}</div>
                    ) : null}
                  </div>
                </div>

                <div className="invoice-items-container">
                  <div className="invoice-item column-header-container">
                    <div>種類</div>
                    <div>内容</div>
                    <div className="invoice-item-number">数量</div>
                    <div className="invoice-item-number">単価</div>
                    <div className="invoice-item-number">税率</div>
                    <div className="invoice-item-number">金額</div>
                  </div>
                  {invoice.invoice_items.map((item) => {
                    subtotal += item.quantity * item.rate;
                    taxTotal +=
                      item.quantity * item.rate * (item.tax_rate / 100);
                    total = subtotal + taxTotal;

                    return (
                      <div className="invoice-item" key={item.id}>
                        <div>{item.service_type.name}</div>
                        <div>{item.description}</div>
                        <div className="invoice-item-number">
                          {item.quantity}
                        </div>
                        <div className="invoice-item-number">
                          ¥{item.rate.toLocaleString("ja-JP")}
                        </div>
                        <div className="invoice-item-number">
                          {item.tax_rate}%
                        </div>
                        <div className="invoice-item-number">
                          ¥{(item.quantity * item.rate).toLocaleString("ja-JP")}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="subtotal-tax-total-container">
                  <div>小計</div>
                  <div>¥{subtotal.toLocaleString("ja-JP")}</div>
                  <div>税額</div>
                  <div>¥{taxTotal.toLocaleString("ja-JP")}</div>
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
