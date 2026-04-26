import React, { Fragment, useState, useEffect } from "react";
/* AXIOS */
import instance from "../../axios/axios_authenticated";
/* CSS */
import "./AccountsSummary.scss";

function AccountsSummary() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [accountSummaryData, setAccountSummaryData] = useState([]);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  // fetches list of accounts for dropdown menu
  useEffect(() => {
    const fetchAccountSummary = async () => {
      try {
        await instance
          .get("api/accounting/accounting/accounts/summary/")
          .then((response) => {
            if (response) {
              setAccountSummaryData(response.data);
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    // drives code
    fetchAccountSummary();
  }, []);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <section id="accounts-summary-section">
        <div className="accounts-summary-container">
          {accountSummaryData.map((account) => (
            <div key={account.id} className="account-container">
              <div>
                {account.name_japanese} [{account.balance.toLocaleString()}]
              </div>
            </div>
          ))}
        </div>
      </section>
    </Fragment>
  );
}

export default AccountsSummary;
