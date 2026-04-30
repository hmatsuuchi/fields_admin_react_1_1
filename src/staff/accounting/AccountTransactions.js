import React, { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
/* AXIOS */
import instance from "../../axios/axios_authenticated";
/* CSS */
import "./AccountTransactions.scss";
/* COMPONENTS */
import AccountTransactionsToolbar from "../toolbar/accounting/AccountTransactionsToolbar";

function AccountTransactions({
  backButtonText,
  backButtonLink,
  displayBackButton,
  setDisplayBackButton,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const { accountId } = useParams();

  const [disableToolbarButtons, setDisableToolbarButtons] = useState(true);

  const [accountTransactionsData, setAccountTransactionsData] = useState([]);
  const [accountData, setAccountData] = useState(null);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  // fetches list of account transactions
  useEffect(() => {
    const fetchAccountTransactions = async () => {
      try {
        await instance
          .get("api/accounting/accounting/account/transactions/", {
            params: {
              account_id: accountId,
            },
          })
          .then((response) => {
            if (response) {
              setAccountTransactionsData(response.data.transactions);
              setAccountData(response.data.account_data);
              setDisableToolbarButtons(false);
            }
          });
      } catch (e) {
        console.log(e);
        setDisableToolbarButtons(false);
      }
    };

    // drives code
    fetchAccountTransactions();
  }, [accountId]);

  const generateIntegerSign = (transaction_side) => {
    if (!accountData) return "";
    const accountType = accountData.account_type;
    if (accountType === "ASSET" || accountType === "EXPENSE") {
      return transaction_side === "DEBIT" ? "" : "-";
    } else if (
      accountType === "LIABILITY" ||
      accountType === "EQUITY" ||
      accountType === "REVENUE"
    ) {
      return transaction_side === "CREDIT" ? "" : "-";
    }
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <section id="account-transactions-section">
        <div className="account-transactions-container card">
          {accountData ? (
            <div className="account-title">
              {`${accountData.account_name_japanese} (${accountData.account_code})`}
            </div>
          ) : null}
          {accountTransactionsData.map((transaction) => (
            <div key={transaction.id} className="transaction-container">
              <div>{transaction.id}</div>
              <div>{transaction.date}</div>
              <div>{transaction.reference}</div>
              <div>{transaction.description}</div>
              <div className="currency">{`${generateIntegerSign(transaction.side)}${transaction.amount.toLocaleString()}`}</div>
              <div className="currency">
                {transaction.running_balance.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>
      <AccountTransactionsToolbar
        disableToolbarButtons={disableToolbarButtons}
        backButtonText={backButtonText}
        backButtonLink={backButtonLink}
        displayBackButton={displayBackButton}
        setDisplayBackButton={setDisplayBackButton}
      />
    </Fragment>
  );
}

export default AccountTransactions;
