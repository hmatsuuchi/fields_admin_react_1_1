import React, { useEffect, useRef, Fragment } from "react";
/* CSS */
import "./CustomerInvoices.scss";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* LOADING SPINNER */
import LoadingSpinner from "../../micro/LoadingSpinner";

function CustomerInvoices({ associatedStudentId }) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const fetchInvoiceRecordsTimerRef = useRef(null);

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [customerInvoiceRecords, setCustomerInvoiceRecords] = React.useState(
    [],
  );

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  useEffect(() => {
    // clears any existing invoice record data
    setCustomerInvoiceRecords([]);

    /* fetch list of student profiles for select list */
    const fetchStudentInvoiceRecords = async () => {
      try {
        // enables loading spinner
        setIsLoading(true);

        await instance
          .get(
            "api/invoices/invoices/invoices_for_student_for_invoice_create/",
            {
              params: { student_id: associatedStudentId },
            },
          )
          .then((response) => {
            if (response) {
              setCustomerInvoiceRecords(response.data.invoice_records);
            }
          });
      } catch (e) {
        console.log(e);
      } finally {
        // disables loading spinner
        setIsLoading(false);
      }
    };

    // resets any previous timers and starts a new timer
    clearTimeout(fetchInvoiceRecordsTimerRef.current);

    // sets a new timer
    if (associatedStudentId) {
      fetchInvoiceRecordsTimerRef.current = setTimeout(() => {
        fetchStudentInvoiceRecords();
      }, 1500);
    }

    // cleanup when invoiceData changes or component unmounts
    return () => {
      clearTimeout(fetchInvoiceRecordsTimerRef.current);
    };
  }, [associatedStudentId]);

  // toggles invoices drawer
  const toggleInvoicesDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <div
        id="customer-invoices-section"
        className={isDrawerOpen ? "open" : ""}
      >
        <div className="open-close-tab" onClick={toggleInvoicesDrawer}>
          <div className="tag-label">請求書履歴</div>
        </div>

        <div className="customer-invoices-container">
          {!isLoading ? (
            customerInvoiceRecords.map((record) => (
              <div className="customer-invoice-record" key={record.id}>
                <div className="year">{`${record.year}年${record.month}月`}</div>
                <div className="payment-method">{`${record.payment_method === 1 ? "月謝袋" : "引き落とし"}`}</div>
                <div className="status-container">
                  <div className="status-label">発行</div>
                  <div
                    className={`invoice-status-button${record.issued_date ? " issued" : ""}`}
                  />
                  <div className="status-label">支払</div>
                  <div
                    className={`invoice-status-button${record.paid_date ? " paid" : ""}`}
                  />
                </div>
                <div className="invoice-items-container">
                  {record.invoice_items.map((item) => {
                    return (
                      <div className="invoice-item" key={item.id}>
                        <div className="service-type">
                          {item.service_type_verbose}
                        </div>
                        <div className="description">{item.description}</div>
                        <div className="quantity">{item.quantity}</div>
                        <div className="rate">{item.rate.toLocaleString()}</div>
                        <div className="subtotal">
                          {item.subtotal.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="invoice-total">{`${record.invoice_total.toLocaleString()}円`}</div>
              </div>
            ))
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default CustomerInvoices;
