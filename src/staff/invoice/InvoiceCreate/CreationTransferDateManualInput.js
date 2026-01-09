import React, { Fragment, useEffect } from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./CreationTransferDateManualInput.scss";

function CreationTransferDateManualInput({ invoiceData, setInvoiceData }) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [paymentChoices, setPaymentChoices] = React.useState([]);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* run on component mount */
  useEffect(() => {
    /* fetch list of payment choices for select list */
    const fetchPaymentChoices = async () => {
      try {
        await instance
          .get("api/invoices/invoices/payment-methods-list-for-select/")
          .then((response) => {
            if (response) {
              setPaymentChoices(response.data);
            }
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchPaymentChoices();
  }, []);

  /* disables transfer date input if transfer payment method is not selected */
  useEffect(() => {
    const transferDateInput = document.getElementById("transfer-date");

    const disableInput = () => {
      transferDateInput.classList.add("disable-clicks");
      setInvoiceData((prev) => ({ ...prev, transfer_date: "" }));
    };

    parseInt(invoiceData.payment_method) !== 2
      ? disableInput()
      : transferDateInput.classList.remove("disable-clicks");
  }, [invoiceData.payment_method, setInvoiceData]);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <div id="creation-transfer-date-manual-input-section">
        <div className="section-header">作成日</div>
        <input
          type="date"
          id="creation-date"
          value={invoiceData.creation_date || ""}
          onChange={(e) =>
            setInvoiceData({
              ...invoiceData,
              creation_date: e.target.value,
            })
          }
        ></input>
        <div className="section-header">年・月</div>
        <select
          id="invoice-year-dropdown"
          value={invoiceData.year || ""}
          onChange={(e) => {
            setInvoiceData({ ...invoiceData, year: e.target.value });
          }}
        >
          <option value="">-------</option>
          <option value={2025}>2025年</option>
          <option value={2026}>2026年</option>
          <option value={2027}>2027年</option>
        </select>
        <select
          id="invoice-month-dropdown"
          value={invoiceData.month || ""}
          onChange={(e) => {
            setInvoiceData({ ...invoiceData, month: e.target.value });
          }}
        >
          <option value="">-------</option>
          <option value={1}>1月</option>
          <option value={2}>2月</option>
          <option value={3}>3月</option>
          <option value={4}>4月</option>
          <option value={5}>5月</option>
          <option value={6}>6月</option>
          <option value={7}>7月</option>
          <option value={8}>8月</option>
          <option value={9}>9月</option>
          <option value={10}>10月</option>
          <option value={11}>11月</option>
          <option value={12}>12月</option>
        </select>
        <div className="section-header">支払方法</div>
        <select
          value={invoiceData.payment_method || ""}
          onChange={(e) =>
            setInvoiceData({
              ...invoiceData,
              payment_method: e.target.value,
            })
          }
        >
          <option value="">-------</option>
          {paymentChoices.map((choice) => (
            <option key={choice.id} value={choice.id}>
              {choice.name}
            </option>
          ))}
        </select>
        <div className="section-header">振替日</div>
        <input
          type="date"
          id="transfer-date"
          value={invoiceData.transfer_date || ""}
          onChange={(e) =>
            setInvoiceData({
              ...invoiceData,
              transfer_date: e.target.value,
            })
          }
        ></input>
      </div>
    </Fragment>
  );
}

export default CreationTransferDateManualInput;
