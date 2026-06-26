import React, { Fragment } from "react";
// CSS
import "./Dashboard.scss";
// COMPONENTS
import DashboardToolbar from "./DashboardToolbar";
import StudentInvoices from "./StudentInvoices";

function Dashboard() {
  return (
    <Fragment>
      <section id="customer-dashboard-section">
        <StudentInvoices />
      </section>
      <DashboardToolbar
        disableToolbarButtons={false}
        backButtonText="SOME TEXT"
        backButtonLink={"/some-link"}
        displayBackButton={true}
        setDisplayBackButton={() => {}}
      />
    </Fragment>
  );
}

export default Dashboard;
