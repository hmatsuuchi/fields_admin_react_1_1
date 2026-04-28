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

  const transactionsWithBalance = [...accountTransactionsData]
    .reverse()
    .reduce((acc, transaction, index) => {
      const prev = index === 0 ? 0 : acc[index - 1].balance;
      const amount = Number(transaction.amount);
      const delta = transaction.side === "DEBIT" ? amount : -amount;
      return [...acc, { ...transaction, balance: prev + delta }];
    }, [])
    .reverse();

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <section id="account-transactions-section">
        <div className="account-transactions-container">
          {transactionsWithBalance.map((transaction) => (
            <div key={transaction.id} className="transaction-container">
              <div>{transaction.id}</div>
              <div>{transaction.date}</div>
              <div>{transaction.description}</div>
              <div>{transaction.reference}</div>
              <div>{transaction.side}</div>
              <div>{transaction.amount.toLocaleString()}</div>
              <div>{transaction.balance.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </section>
    </Fragment>
  );
}

export default AccountTransactions;
