import React, { Fragment, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
/* AXIOS */
import instance from "../../axios/axios_authenticated";
/* CSS */
import "./BalanceSheet.scss";
/* COMPONENTS */
import BalanceSheetToolbar from "../toolbar/accounting/BalanceSheetToolbar";

function BalanceSheet({
  backButtonText,
  setBackButtonText,
  backButtonLink,
  setBackButtonLink,
  displayBackButton,
  setDisplayBackButton,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [disableToolbarButtons, setDisableToolbarButtons] = useState(true);

  const [accountSummaryData, setAccountSummaryData] = useState([]);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  // fetches accounts and account balances
  useEffect(() => {
    const fetchAccountSummary = async () => {
      try {
        await instance
          .get("api/accounting/accounting/accounts/summary/")
          .then((response) => {
            if (response) {
              setAccountSummaryData(response.data);
              setDisableToolbarButtons(false);
            }
          });
      } catch (e) {
        console.log(e);
        setDisableToolbarButtons(false);
      }
    };

    // drives code
    fetchAccountSummary();
  }, []);

  const setToolbarBackButton = () => {
    setBackButtonText("決算書");
    setBackButtonLink("/staff/accounting/balance_sheet/");
    setDisplayBackButton(true);
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <section id="balance-sheet-section">
        <div className="balance-sheet-container card">
          {accountSummaryData.map((account) => (
            <NavLink
              to={`/staff/accounting/account/transactions/${account.id}/`}
              key={account.id}
              onClick={setToolbarBackButton}
            >
              <div className="account-container">
                <div className="account-name">{account.name_japanese}</div>
                <div className="account-balance">
                  {account.balance.toLocaleString()}
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </section>
      <BalanceSheetToolbar
        disableToolbarButtons={disableToolbarButtons}
        backButtonText={backButtonText}
        backButtonLink={backButtonLink}
        displayBackButton={displayBackButton}
        setDisplayBackButton={setDisplayBackButton}
      />
    </Fragment>
  );
}

export default BalanceSheet;
