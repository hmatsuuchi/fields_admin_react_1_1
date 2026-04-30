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
          .get("api/accounting/accounting/accounts/balance_sheet/")
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

  // groups accounts by type
  const assets = accountSummaryData.filter((a) => a.account_type === "ASSET");
  const liabilities = accountSummaryData.filter(
    (a) => a.account_type === "LIABILITY",
  );
  const equity = accountSummaryData.filter((a) => a.account_type === "EQUITY");
  const revenues = accountSummaryData.filter(
    (a) => a.account_type === "REVENUE",
  );
  const expenses = accountSummaryData.filter(
    (a) => a.account_type === "EXPENSE",
  );
  // calculates totals for each account type
  const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = liabilities.reduce((sum, a) => sum + a.balance, 0);
  const totalEquity = equity.reduce((sum, a) => sum + a.balance, 0);
  const totalRevenues = revenues.reduce((sum, a) => sum + a.balance, 0);
  const totalExpenses = expenses.reduce((sum, a) => sum + a.balance, 0);
  const totalEquityWithNetIncome =
    totalEquity + (totalRevenues - totalExpenses);

  return (
    <Fragment>
      <section id="balance-sheet-section">
        <div className="balance-sheet-container card">
          <div className="title-container">決算書</div>
          <div className="balance-sheet-accounts-container assets">
            <div className="section-title">資産の部</div>
            {assets.map((account) => (
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
            <div className="section-total">{totalAssets.toLocaleString()}</div>
          </div>
          <div className="balance-sheet-accounts-container liabilities">
            <div className="section-title">負債の部</div>
            {liabilities.map((account) => (
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
            <div className="section-total">
              {totalLiabilities.toLocaleString()}
            </div>
          </div>
          <div className="balance-sheet-accounts-container equity">
            <div className="section-title">純資産の部</div>
            {equity.map((account) => (
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
            <div className="account-container">
              <div className="account-name">当期純利益</div>
              <div className="account-balance">
                {(totalRevenues - totalExpenses).toLocaleString()}
              </div>
            </div>
            <div className="section-total">
              {totalEquityWithNetIncome.toLocaleString()}
            </div>
          </div>

          <div className="balance-sheet-accounts-container">
            <div className="section-title">負債及び純資産合計</div>
            <div className="account-container">
              <div className="account-name">資産合計</div>
              <div className="account-balance">
                {totalAssets.toLocaleString()}
              </div>
            </div>
            <div className="account-container">
              <div className="account-name">負債・純資産合計</div>
              <div className="account-balance">
                {(totalLiabilities + totalEquityWithNetIncome).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="balance-sheet-container card">
          <div className="title-container">損益計算書</div>
          <div className="balance-sheet-accounts-container revenues">
            <div className="section-title">収益の部</div>
            {revenues.map((account) => (
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
            <div className="section-total">
              {totalRevenues.toLocaleString()}
            </div>
          </div>
          <div className="balance-sheet-accounts-container expenses">
            <div className="section-title">費用の部</div>
            {expenses.map((account) => (
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
            <div className="section-total">
              {totalExpenses.toLocaleString()}
            </div>
          </div>
          <div className="balance-sheet-accounts-container expenses">
            <div className="section-title">
              {totalRevenues - totalExpenses > 0 ? "当期純利益" : "当期純損失"}
            </div>

            <div
              className={`section-total${totalRevenues - totalExpenses < 0 ? " loss" : ""}`}
            >
              {(totalRevenues - totalExpenses).toLocaleString()}
            </div>
          </div>
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
