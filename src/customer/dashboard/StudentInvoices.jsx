import React, { useState, useEffect } from "react";
/* AXIOS */
import instance from "../../axios/axios_authenticated";
// CSS
import "./StudentInvoices.scss";

function StudentInvoices() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [isLoading, setIsLoading] = useState(true);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* fetches revenue by month data from the API */
  const fetchInvoiceData = () => {
    instance
      .get("api/dashboard/dashboard/invoices_for_customer/")
      .then((response) => {
        if (response) {
          console.log(response.data.students);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setIsLoading(false));
  };

  /* runs on component mount */
  useEffect(() => {
    fetchInvoiceData();
  }, []);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return <div id="testdiv" onClick={fetchInvoiceData}></div>;
}

export default StudentInvoices;
