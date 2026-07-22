import React, { Fragment, useState, useEffect } from "react";
/* AXIOS */
import instance from "../../axios/axios_authenticated";
// CSS
import "./Dashboard.scss";
// COMPONENTS
import TopBar from "./TopBar";
import StudentInvoices from "./StudentInvoices";

function Dashboard() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [customerProfileData, setCustomerProfileData] = useState(null);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* fetches customer profile data from the API */
  const fetchCustomerProfileData = () => {
    instance
      .get("api/dashboard/dashboard/customer_profile/")
      .then((response) => {
        if (response) {
          setCustomerProfileData(response.data.customer_profile);
          console.log(response.data.customer_profile);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => console.log("fetchCustomerProfileData() completed"));
  };

  /* runs on component mount */
  useEffect(() => {
    fetchCustomerProfileData();
  }, []);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */
  return (
    <Fragment>
      <section id="customer-dashboard-section">
        <div className="customer-dashboard-container">
          <TopBar
            customerLastNameKanji={customerProfileData?.last_name_kanji}
          />
          <StudentInvoices />
        </div>
      </section>
    </Fragment>
  );
}

export default Dashboard;
