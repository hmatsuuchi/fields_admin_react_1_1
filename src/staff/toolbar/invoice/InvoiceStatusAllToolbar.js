import React, { useEffect } from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
// CSS
import "./InvoiceStatusAllToolbar.scss";
// COMPONENTS
import ToolbarBackButton from "../../micro/ToolbarBackButton";

function InvoiceStatusAllToolbar({
  // invoices
  invoicesAll,
  setInvoicesAll,

  // toolbar
  disableToolbarButtons,
  setDisableToolbarButtons,

  // back button
  backButtonText,
  backButtonLink,
  displayBackButton,
  setDisplayBackButton,

  // display descriptors
  setDisplayDescriptors,
  invoiceTotalWithoutTax,
  unpaidInvoiceTotalWithoutTax,

  // applied filters
  appliedFilters,
  setAppliedFilters,

  // filter parameters
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  displayUnissuedOnly,
  setDisplayUnissuedOnly,
  displayUnpaidOnly,
  setDisplayUnpaidOnly,
  displayStudentOnly,
  setDisplayStudentOnly,
  textFilterInput,
  setTextFilterInput,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  // Handle Clicks to Date Filter Button
  const handleClicksToDateFilterButton = () => {
    // resets filter states
    setDisplayUnissuedOnly(false);
    setDisplayUnpaidOnly(false);
    setDisplayStudentOnly({
      id: null,
      nameKanji: "",
    });
    setTextFilterInput("");

    // disables toolbar buttons
    setDisableToolbarButtons(true);

    // clears invoices all state
    setInvoicesAll([]);

    // resets applied filters
    setAppliedFilters({
      selectedYear: "",
      selectedMonth: "",
      displayUnissuedOnly: false,
      displayUnpaidOnly: false,
    });

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
              setDisableToolbarButtons(false);
              setAppliedFilters({
                selectedYear: selectedYear,
                selectedMonth: selectedMonth,
                displayUnissuedOnly: false,
                displayUnpaidOnly: false,
              });
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    // drives code
    fetchInvoicesAll();
  };

  // Handle Clicks to Display Unissued Only Button
  const handleClicksToDisplayUnissuedOnlyButton = () => {
    // disables toolbar buttons
    setDisableToolbarButtons(true);

    // clears invoices all state
    setInvoicesAll([]);

    // resets applied filters
    setAppliedFilters({
      selectedYear: "",
      selectedMonth: "",
      displayUnissuedOnly: false,
      displayUnpaidOnly: false,
    });

    // resets filter states
    setSelectedYear("");
    setSelectedMonth("");
    setDisplayUnissuedOnly(true);
    setDisplayUnpaidOnly(false);
    setDisplayStudentOnly({
      id: null,
      nameKanji: "",
    });
    setTextFilterInput("");

    // fetches all invoices
    const fetchInvoicesAll = async () => {
      try {
        await instance
          .get("api/invoices/invoices/status/all/", {
            params: {
              display_unissued_only: true,
            },
          })
          .then((response) => {
            if (response) {
              setInvoicesAll(response.data.invoices);
              setDisableToolbarButtons(false);
              setAppliedFilters({
                selectedYear: "",
                selectedMonth: "",
                displayUnissuedOnly: true,
                displayUnpaidOnly: false,
              });
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    // drives code
    fetchInvoicesAll();
  };

  // Handle Clicks to Display Unpaid Only Button
  const handleClicksToDisplayUnpaidOnlyButton = () => {
    // disables toolbar buttons
    setDisableToolbarButtons(true);

    // clears invoices all state
    setInvoicesAll([]);

    // resets applied filters
    setAppliedFilters({
      selectedYear: "",
      selectedMonth: "",
      displayUnissuedOnly: false,
      displayUnpaidOnly: false,
    });

    // resets filter states
    setSelectedYear("");
    setSelectedMonth("");
    setDisplayUnissuedOnly(false);
    setDisplayUnpaidOnly(true);
    setDisplayStudentOnly({
      id: null,
      nameKanji: "",
    });
    setTextFilterInput("");

    // fetches all invoices
    const fetchInvoicesAll = async () => {
      try {
        await instance
          .get("api/invoices/invoices/status/all/", {
            params: {
              display_unpaid_only: true,
            },
          })
          .then((response) => {
            if (response) {
              setInvoicesAll(response.data.invoices);
              setDisableToolbarButtons(false);
              setAppliedFilters({
                selectedYear: "",
                selectedMonth: "",
                displayUnissuedOnly: false,
                displayUnpaidOnly: true,
              });
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    // drives code
    fetchInvoicesAll();
  };

  // Handle Clicks to Text Filter Button
  const handleClicksToTextFilterButton = () => {
    // disables toolbar buttons
    setDisableToolbarButtons(true);

    // clears invoices all state
    setInvoicesAll([]);

    // resets applied filters
    setAppliedFilters({
      selectedYear: "",
      selectedMonth: "",
      displayUnissuedOnly: false,
      displayUnpaidOnly: false,
      textFilter: "",
    });

    // resets filter states
    setSelectedYear("");
    setSelectedMonth("");
    setDisplayUnissuedOnly(false);
    setDisplayUnpaidOnly(false);
    setDisplayStudentOnly({
      id: null,
      nameKanji: "",
    });

    // fetches all invoices
    const fetchInvoicesAll = async () => {
      try {
        await instance
          .get("api/invoices/invoices/status/all/", {
            params: {
              text_filter: textFilterInput,
            },
          })
          .then((response) => {
            if (response) {
              setInvoicesAll(response.data.invoices);
              setDisableToolbarButtons(false);
              setAppliedFilters({
                selectedYear: "",
                selectedMonth: "",
                displayUnissuedOnly: false,
                displayUnpaidOnly: false,
                textFilter: textFilterInput,
              });
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    // drives code
    fetchInvoicesAll();
  };

  // updates display descriptors
  useEffect(() => {
    setDisplayDescriptors([
      // invoice count
      `${invoicesAll.length}件を表示しています`,
      // invoice totals & unpaid totals
      `税抜合計 ${invoiceTotalWithoutTax.toLocaleString("ja-JP")}円 (未払 ${unpaidInvoiceTotalWithoutTax.toLocaleString("ja-JP")}円)`,
      // year & month filter
      appliedFilters.selectedYear !== "" && appliedFilters.selectedMonth !== ""
        ? `${appliedFilters.selectedYear}年${appliedFilters.selectedMonth}月の請求書を表示しています`
        : null,
      // unissued only filter
      appliedFilters.displayUnissuedOnly
        ? "未発行の請求書のみ表示しています"
        : null,
      // unpaid only filter
      appliedFilters.displayUnpaidOnly
        ? "未入金の請求書のみ表示しています"
        : null,
      // student only filter
      displayStudentOnly.nameKanji !== ""
        ? `「${displayStudentOnly.nameKanji}」の請求書を表示しています`
        : null,
      // text filter
      appliedFilters.textFilter !== "" &&
      appliedFilters.textFilter !== undefined
        ? `「${appliedFilters.textFilter}」の検索結果を表示しています`
        : null,
    ]);
  }, [
    invoicesAll,
    invoiceTotalWithoutTax,
    unpaidInvoiceTotalWithoutTax,
    setDisplayDescriptors,
    appliedFilters,
    displayStudentOnly,
  ]);

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
        {/* text search filter */}
        <input
          type="text"
          className="text-filter-input"
          value={textFilterInput}
          onChange={(e) => {
            setTextFilterInput(e.target.value);
          }}
        />
        <button
          className="filter-results-button"
          onClick={handleClicksToTextFilterButton}
        ></button>
        <div className="vertical-divider-thin" />

        {/* year and month filter */}
        <select
          className="year-select"
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
          }}
        >
          <option value={""}>-------</option>
          <option value={2026}>2026年</option>
          <option value={2025}>2025年</option>
        </select>
        <select
          className="month-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value={""}>-------</option>
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
          onClick={handleClicksToDateFilterButton}
        ></button>
        <div className="vertical-divider-thin" />

        {/* unissued only filter */}
        <button
          className="display-unissued-only-button"
          onClick={handleClicksToDisplayUnissuedOnlyButton}
        ></button>

        {/* unpaid only filter */}
        <button
          className="display-unpaid-only-button"
          onClick={handleClicksToDisplayUnpaidOnlyButton}
        ></button>

        {/* filtered results */}
        <div className="number-of-results">{`${invoicesAll.length}件`}</div>
      </div>
    </div>
  );
}

export default InvoiceStatusAllToolbar;
