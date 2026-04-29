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
  const [accountType, setAccountType] = useState("");

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
              setAccountType(response.data.account_type);
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
          {accountTransactionsData.map((transaction) => (
            <div key={transaction.id} className="transaction-container">
              <div>{transaction.id}</div>
              <div>{transaction.date}</div>
              <div>{transaction.description}</div>
              <div>{transaction.reference}</div>
              <div>{`${generateIntegerSign(transaction.side)}${transaction.amount.toLocaleString()}`}</div>
              <div>{transaction.running_balance.toLocaleString()}</div>
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
