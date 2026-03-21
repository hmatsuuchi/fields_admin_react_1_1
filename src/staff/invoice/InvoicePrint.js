import React, { useEffect, Fragment } from "react";
/* AXIOS */
import instance from "../../axios/axios_authenticated";
/* CSS */
import "./InvoicePrint.scss";

function InvoicePrint({ invoiceId, setInvoiceIdForPrinting }) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [invoiceData, setInvoiceData] = React.useState(null);
  const [invoiceTotal, setInvoiceTotal] = React.useState({
    subtotal: 0,
    totalTax: 0,
    total: 0,
  });

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */
  // runs on component mount
  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        await instance
          .get("api/invoices/invoices/print/", {
            params: {
              invoice_id: invoiceId,
            },
          })
          .then((response) => {
            setInvoiceData(response.data);
            window.print();
            setInvoiceIdForPrinting(null);
          });
      } catch (e) {
        console.log(e);
      }
    };

    // drives code
    invoiceId && fetchInvoiceData();
  }, [invoiceId, setInvoiceIdForPrinting]);

  // runs when invoiceData state is updated
  useEffect(() => {
    if (invoiceData) {
      let subtotal = 0;
      let totalTax = 0;
      let total = 0;
      invoiceData.invoice_items.forEach((item) => {
        total += item.quantity * item.rate * (1 + item.tax_rate / 100);
        subtotal += item.quantity * item.rate;
        totalTax += item.quantity * item.rate * (item.tax_rate / 100);
      });
      setInvoiceTotal({
        subtotal: Math.round(subtotal),
        totalTax: Math.round(totalTax),
        total: Math.round(total),
      });
    }
  }, [invoiceData]);

  // converts date to Japanese format (e.g. 2024年6月1日)
  const formatDateToJapanese = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  };

  // converts date to Japanese day of week
  const getJapaneseDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
    return daysOfWeek[date.getDay()];
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return invoiceData ? (
    <Fragment>
      <div id="invoice-print-container">
        <div className="header-container">
          <div className="year-month">
            {`明細書 ${invoiceData.year}年${invoiceData.month}月分`}
          </div>
          <div className="fields-container">
            <div className="fields">フィールズ英会話</div>
            <div className="fields-info">〒770-8053</div>
            <div className="fields-info">徳島県徳島市沖浜東3-2</div>
            <div className="fields-info">オプスフジタ 2階 I号室</div>
            <div className="fields-info">088-661-3464</div>
            <div className="fields-info">info@fields.jp</div>
          </div>
        </div>
        <div className="divider-line" />
        <div className="invoice-container">
          <div className="title-value-container">
            <div className="title">氏名</div>
            <div className="value">{invoiceData.customer_name} 様</div>
          </div>
          <div className="title-value-container">
            <div className="title">発行日</div>
            <div className="value">{`${formatDateToJapanese(invoiceData.creation_date)} (${getJapaneseDayOfWeek(invoiceData.creation_date)})`}</div>
          </div>
          <div className="title-value-container">
            <div className="title">合計</div>
            <div className="value total">
              {invoiceTotal.total.toLocaleString("ja-JP")}円
            </div>
          </div>
          <div className="title-value-container">
            <div className="title">住所</div>
            {invoiceData.customer_postal_code ? (
              <div className="value">〒{invoiceData.customer_postal_code}</div>
            ) : null}
            {invoiceData.customer_prefecture ||
            invoiceData.customer_city ||
            invoiceData.customer_address_line_1 ? (
              <div className="value">
                {invoiceData.customer_prefecture}
                {invoiceData.customer_city}
                {invoiceData.customer_address_line_1}
              </div>
            ) : null}
            {invoiceData.customer_address_line_2 ? (
              <div className="value">{invoiceData.customer_address_line_2}</div>
            ) : null}
          </div>
          {invoiceData.transfer_date ? (
            <div className="title-value-container">
              <div className="title">引落日</div>
              <div className="value">{`${formatDateToJapanese(invoiceData.transfer_date)} (${getJapaneseDayOfWeek(invoiceData.transfer_date)})`}</div>
            </div>
          ) : null}
        </div>
        <div className="divider-line" />
        <div className="invoice-items-container">
          <div className="invoice-item-header-container">
            <div className="service-type">種類</div>
            <div className="description">内容</div>
            <div className="quantity">数量</div>
            <div className="rate">単価</div>
            <div className="tax-rate">税率</div>
            <div className="line-total">金額</div>
          </div>
          {invoiceData.invoice_items.map((item, index) => (
            <div
              key={`invoice-item-${index}`}
              className="invoice-item-container"
            >
              <div className="service-type">{item.service_type.name}</div>
              <div className="description">{item.description}</div>
              <div className="quantity">{item.quantity}</div>
              <div className="rate">{item.rate.toLocaleString("ja-JP")}円</div>
              <div className="tax-rate">{item.tax_rate}%</div>
              <div className="line-total">
                {(item.quantity * item.rate).toLocaleString("ja-JP")}円
              </div>
            </div>
          ))}
        </div>
        <div className="tax-and-total-container">
          <div className="label">小計</div>
          <div className="label">消費税</div>
          <div className="label">合計</div>
          <div className="subtotal">
            {invoiceTotal.subtotal.toLocaleString("ja-JP")}円
          </div>
          <div className="tax">
            {invoiceTotal.totalTax.toLocaleString("ja-JP")}円
          </div>
          <div className="total">
            {invoiceTotal.total.toLocaleString("ja-JP")}円
          </div>
        </div>
      </div>
      <div id="invoice-print-container-second-page">
        <div className="student-name-romaji">
          {invoiceData.student.last_name_romaji},{" "}
          {invoiceData.student.first_name_romaji} 様
        </div>
      </div>
    </Fragment>
  ) : null;
}

export default InvoicePrint;
