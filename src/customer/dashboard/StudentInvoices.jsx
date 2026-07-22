import React, { useState, useEffect, Fragment } from "react";
/* AXIOS */
import instance from "../../axios/axios_authenticated";
// CSS
import "./StudentInvoices.scss";

function StudentInvoices() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [invoiceData, setInvoiceData] = useState(null);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(0);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* fetches revenue by month data from the API */
  const fetchInvoiceData = () => {
    instance
      .get("api/dashboard/dashboard/invoices_for_customer/")
      .then((response) => {
        if (response) {
          setInvoiceData(response.data.student_invoices);
          console.log(response.data.student_invoices);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => console.log("fetchInvoiceData() completed"));
  };

  /* runs on component mount */
  useEffect(() => {
    fetchInvoiceData();
  }, []);

  /* applies class based on number of students */
  const numberOfStudentsClass = {
    1: "single",
    2: "double",
    3: "triple",
    4: "quadruple",
    5: "too-many",
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <section id="student-invoice-section">
      <div className="student-invoice-container customer-card">
        <div className="customer-card-title">明細書</div>
        <div className="customer-card-content">
          <div
            className={`student-tabs ${invoiceData ? numberOfStudentsClass[invoiceData.length] || "" : ""}`}
          >
            {invoiceData && invoiceData.length > 0
              ? invoiceData.map((student, index) => {
                  return (
                    <div
                      key={index}
                      className={`tab${selectedStudentIndex === index ? " selected" : ""}`}
                      onClick={() => setSelectedStudentIndex(index)}
                    >
                      {`${student.last_name_kanji} ${student.first_name_kanji}`}
                    </div>
                  );
                })
              : null}
          </div>
          <div className="invoice-data-container">
            {invoiceData && invoiceData.length > 0
              ? invoiceData.map((student, index) => {
                  // caculate startingYear and endingYear for each student based on invoice data
                  const invoiceYears =
                    student.invoices?.map((inv) => inv.year) ?? [];
                  const startingYear = Math.min(...invoiceYears);
                  const endingYear = Math.max(...invoiceYears);

                  return (
                    <div
                      key={index}
                      className={`student-invoice-data ${selectedStudentIndex === index ? "selected" : ""}`}
                      onClick={() => setSelectedStudentIndex(index)}
                    >
                      {Array.from(
                        { length: endingYear - startingYear + 1 },
                        (_, yi) => {
                          const year = endingYear - yi;
                          return (
                            <Fragment>
                              <div className="year-header">{`${year}`}</div>
                              {Array.from({ length: 12 }, (_, mi) => {
                                const month = mi + 1;
                                const invoiceForCell = student.invoices?.find(
                                  (inv) =>
                                    inv.year === year && inv.month === month,
                                );
                                const invoiceTotal = invoiceForCell
                                  ? invoiceForCell.invoiceitem_set.reduce(
                                      (sum, item) =>
                                        sum +
                                        item.quantity * item.rate +
                                        (item.quantity *
                                          item.rate *
                                          item.tax_rate) /
                                          100,
                                      0,
                                    )
                                  : null;
                                return (
                                  <div
                                    key={`${year}-${month}`}
                                    className={`invoice-month-container${invoiceForCell && invoiceForCell.paid_date ? " paid" : invoiceForCell && !invoiceForCell.paid_date ? " unpaid" : ""}`}
                                  ></div>
                                );
                              })}
                            </Fragment>
                          );
                        },
                      )}
                      <div className="year-header" />
                      {Array.from({ length: 12 }, (_, mi) => (
                        <div key={mi} className="month-footer">
                          {mi + 1}
                        </div>
                      ))}
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudentInvoices;
