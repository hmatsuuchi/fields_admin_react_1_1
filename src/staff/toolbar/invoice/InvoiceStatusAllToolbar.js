import React from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
// CSS
import "./InvoiceStatusAllToolbar.scss";
// COMPONENTS
import ToolbarBackButton from "../../micro/ToolbarBackButton";

function InvoiceStatusAllToolbar({
  disableToolbarButtons,
  setDisableToolbarButtons,
  backButtonText,
  backButtonLink,
  displayBackButton,
  setDisplayBackButton,
  invoicesAll,
  setInvoicesAll,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  setDisplayDescriptors,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  // Handle Clicks to Filter Results Button
  const handleClicksToFilterResultsButton = () => {
    // disables toolbar buttons
    setDisableToolbarButtons(true);
    // clears invoices all state
    setInvoicesAll([]);
    // resets display descriptors
    setDisplayDescriptors(["0件を表示しています"]);

    // fetches all invoices
    const fetchInvoicesAll = async () => {
      try {
        await instance
          .get("api/invoices/invoices/status/all/", {
            params: {
              year: selectedYear,
              month: selectedMonth,
            },
          })
          .then((response) => {
            if (response) {
              setInvoicesAll(response.data.invoices);
              setDisplayDescriptors([
                `${response.data.invoices.length}件を表示しています`,
              ]);
              setDisableToolbarButtons(false);
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    // drives code
    fetchInvoicesAll();
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <div
      id="invoice-status-all-toolbar"
      className={disableToolbarButtons ? "disable-toolbar-buttons" : ""}
    >
      {/* <ToolbarBackButton
        backButtonText={backButtonText}
        backButtonLink={backButtonLink}
        displayBackButton={displayBackButton}
        setDisplayBackButton={setDisplayBackButton}
      /> */}

      <ToolbarBackButton
        backButtonText={"ダッシュボード"}
        backButtonLink={"/some/link/"}
        displayBackButton={true}
        setDisplayBackButton={setDisplayBackButton}
      />

      <div className="toolbar-right-side-container">
        <select
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
          }}
        >
          <option value={2026}>2026年</option>
          <option value={2025}>2025年</option>
        </select>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value={1}>1月</option>
          <option value={2}>2月</option>
          <option value={3}>3月</option>
          <option value={4}>4月</option>
          <option value={5}>5月</option>
          <option value={6}>6月</option>
          <option value={7}>7月</option>
          <option value={8}>8月</option>
          <option value={9}>9月</option>
          <option value={10}>10月</option>
          <option value={11}>11月</option>
          <option value={12}>12月</option>
        </select>
        <button
          className="filter-results-button"
          onClick={handleClicksToFilterResultsButton}
        ></button>
        <div className="vertical-divider-thin" />
        <button className="issued-filter-button"></button>
        <button className="paid-filter-button"></button>

        <div className="number-of-results">{`${invoicesAll.length}件`}</div>
      </div>
    </div>
  );
}

export default InvoiceStatusAllToolbar;
