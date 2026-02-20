import React, { useEffect, useState, Fragment } from "react";
/* AXIOS */
import instance from "../../axios/axios_authenticated";
/* CSS */
import "./InvoiceListAll.scss";
/* COMPONENTS */
import InvoiceListAllToolbar from "../../staff/toolbar/invoice/InvoiceListAllToolbar";
/* LOADING SPINNER */
import LoadingSpinner from "../micro/LoadingSpinner";

function InvoiceListAll({
  backButtonText,
  backButtonLink,
  displayBackButton,
  setDisplayBackButton,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  // current date
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // invoices
  const [invoicesAll, setInvoicesAll] = useState([]);
  const [filterParameters, setFilterParameters] = useState({
    year: currentYear,
    month: currentMonth,
    display_student_only_id: null,
  });

  const [disableToolbarButtons, setDisableToolbarButtons] = useState(true);

  // content loading state
  const [contentLoading, setContentLoading] = useState(true);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */
  // this is only used for the initial fetch of invoice data
  const fetchInvoicesAllOnMount = async () => {
    // defaults to current year and month upon initial fetch
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    try {
      await instance
        .get("api/invoices/invoices/list/all/", {
          params: {
            year: currentYear,
            month: currentMonth,
          },
        })
        .then((response) => {
          if (response) {
            setInvoicesAll(response.data.invoices);
            setDisableToolbarButtons(false);
            setContentLoading(false);
          }
        });
    } catch (e) {
      setContentLoading(false);
      console.log(e);
    }
  };

  // runs on mount to fetch all invoices for the current year and month by default
  useEffect(() => {
    fetchInvoicesAllOnMount();
  }, []);

  const fetchInvoicesAllWithParameters = async (studentId) => {
    try {
      await instance
        .get("api/invoices/invoices/list/all/", {
          params: {
            display_student_only_id: studentId,
          },
        })
        .then((response) => {
          if (response) {
            setInvoicesAll(response.data.invoices);
            setDisableToolbarButtons(false);
            setContentLoading(false);
          }
        });
    } catch (e) {
      setContentLoading(false);
      console.log(e);
    }
  };

  const handleClicksToDisplayStudentOnlyButton = (studentId, studentName) => {
    // resets filter parameters
    setFilterParameters({
      year: "",
      month: "",
      display_student_only_id: studentId,
    });

    // resets invoice array
    setInvoicesAll([]);

    // disables toolbar buttons
    setDisableToolbarButtons(true);

    // enables content loading spinner
    setContentLoading(true);

    // fetches invoices
    fetchInvoicesAllWithParameters(studentId);
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <section id="invoice-list-all">
        {contentLoading ? (
          <LoadingSpinner />
        ) : (
          <div id="invoice-list-container">
            {invoicesAll.map((invoice) => {
              let subtotal = 0; // subtotal value for each invoice
              let taxTotal = 0; // tax total value for each invoice
              let total = 0; // total value for each invoice

              return (
                <div className="invoice-container" key={invoice.id}>
                  {/* display student only button */}
                  <div
                    className="display-student-only-button"
                    onClick={() =>
                      handleClicksToDisplayStudentOnlyButton(
                        invoice.student.id,
                        `${invoice.student.last_name_kanji} ${invoice.student.first_name_kanji}`,
                      )
                    }
                  />

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
                            ¥
                            {(item.quantity * item.rate).toLocaleString(
                              "ja-JP",
                            )}
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
                    <div>{`${invoice.student.last_name_romaji}, ${invoice.student.first_name_romaji}`}</div>
                    <div>
                      {`${invoice.student.last_name_kanji} ${invoice.student.first_name_kanji}`}
                    </div>
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
        )}
      </section>

      <InvoiceListAllToolbar
        disableToolbarButtons={disableToolbarButtons}
        setDisableToolbarButtons={setDisableToolbarButtons}
        backButtonText={backButtonText}
        backButtonLink={backButtonLink}
        displayBackButton={displayBackButton}
        setDisplayBackButton={setDisplayBackButton}
        filterParameters={filterParameters}
        setFilterParameters={setFilterParameters}
        invoiceCount={invoicesAll.length}
        setInvoicesAll={setInvoicesAll}
        setContentLoading={setContentLoading}
      />
    </Fragment>
  );
}

export default InvoiceListAll;
