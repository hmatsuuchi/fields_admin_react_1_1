import React, { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
/* AXIOS */
import instance from "../../axios/axios_authenticated";
/* CSS */
import "./AccountTransactions.scss";

function AccountTransactions() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const { accountId } = useParams();

  const [accountTransactionsData, setAccountTransactionsData] = useState([]);

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
              setAccountTransactionsData(response.data);
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    // drives code
    fetchAccountTransactions();
  }, [accountId]);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <section id="account-transactions-section">
        <div className="account-transactions-container">
          {accountTransactionsData.map((transaction) => (
            <div key={transaction.id} className="transaction-container">
              <div>{transaction.id}</div>
              <div>{transaction.date}</div>
              <div>{transaction.description}</div>
              <div>{transaction.reference}</div>
              <div>{transaction.side}</div>
              <div>{transaction.amount}</div>
            </div>
          ))}
        </div>
      </section>
    </Fragment>
  );
}

export default AccountTransactions;
