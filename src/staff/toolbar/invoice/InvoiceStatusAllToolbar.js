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

  // content loading state
  setContentLoading,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  // Handle Clicks to Date Filter Button
  const handleClicksToDateFilterButton = (e) => {
    // today's date
    const today = new Date();
    const yearToday = today.getFullYear();
    const monthToday = today.getMonth() + 1;

    // chcecks if year and month are selected
    if (selectedYear === "" || selectedMonth === "") {
      setSelectedYear(yearToday);
      setSelectedMonth(monthToday);
    }

    // blur button
    e.target.blur();

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

    // set content loading state
    setContentLoading(true);

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
              year: selectedYear !== "" ? selectedYear : yearToday,
              month: selectedMonth !== "" ? selectedMonth : monthToday,
            },
          })
          .then((response) => {
            if (response) {
              setInvoicesAll(response.data.invoices);

              setDisableToolbarButtons(false);
              setContentLoading(false);

              setAppliedFilters({
                selectedYear: selectedYear !== "" ? selectedYear : yearToday,
                selectedMonth:
                  selectedMonth !== "" ? selectedMonth : monthToday,
                displayUnissuedOnly: false,
                displayUnpaidOnly: false,
              });
            }
          });
      } catch (e) {
        console.log(e);
        window.alert("エラーが発生しました。ページをリロードしてください。");
        setDisableToolbarButtons(false);
        setContentLoading(false);
      }
    };

    // drives code
    fetchInvoicesAll();
  };

  // Handle Clicks to Display Unissued Only Button
  const handleClicksToDisplayUnissuedOnlyButton = (e) => {
    // blurs button
    e.target.blur();

    // disables toolbar buttons
    setDisableToolbarButtons(true);

    // set content loading state
    setContentLoading(true);

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
              setContentLoading(false);
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
        window.alert("エラーが発生しました。ページをリロードしてください。");
        setDisableToolbarButtons(false);
        setContentLoading(false);
      }
    };

    // drives code
    fetchInvoicesAll();
  };

  // Handle Clicks to Display Unpaid Only Button
  const handleClicksToDisplayUnpaidOnlyButton = (e) => {
    // blurs button
    e.target.blur();

    // disables toolbar buttons
    setDisableToolbarButtons(true);

    // set content loading state
    setContentLoading(true);

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
              setContentLoading(false);
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
        window.alert("エラーが発生しました。ページをリロードしてください。");
        setDisableToolbarButtons(false);
        setContentLoading(false);
      }
    };

    // drives code
    fetchInvoicesAll();
  };

  // Handle Clicks to Text Filter Button
  const handleClicksToTextFilterButton = (e) => {
    // blurs button
    e.target.blur();

    // gets date today
    const today = new Date();
    const yearToday = today.getFullYear();
    const monthToday = today.getMonth() + 1;

    // disables toolbar buttons
    setDisableToolbarButtons(true);

    // set content loading state
    setContentLoading(true);

    // clears invoices all state
    setInvoicesAll([]);

    // resets applied filters
    setAppliedFilters({
      selectedYear: textFilterInput ? "" : yearToday,
      selectedMonth: textFilterInput ? "" : monthToday,
      displayUnissuedOnly: false,
      displayUnpaidOnly: false,
      textFilter: "",
    });

    // resets filter states
    setSelectedYear(textFilterInput ? "" : yearToday);
    setSelectedMonth(textFilterInput ? "" : monthToday);
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
              setContentLoading(false);
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
        window.alert("エラーが発生しました。ページをリロードしてください。");
        setDisableToolbarButtons(false);
        setContentLoading(false);
      }
    };

    // drives code
    fetchInvoicesAll();
  };

  // Handle Key Up On Text Search Filter Input
  const handleKeyUpOnTextSearchFilterInput = (e) => {
    if (e.key === "Enter") {
      // runs text search
      handleClicksToTextFilterButton(e);
    }
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
          onKeyUp={handleKeyUpOnTextSearchFilterInput}
          tabIndex={1}
        />
        <button
          className="filter-results-button"
          onClick={handleClicksToTextFilterButton}
          tabIndex={2}
        ></button>
        <div className="vertical-divider-thin" />

        {/* year and month filter */}
        <select
          className="year-select"
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
          }}
          tabIndex={3}
        >
          <option value={""}>-------</option>
          <option value={2026}>2026年</option>
          <option value={2025}>2025年</option>
        </select>
        <select
          className="month-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          tabIndex={4}
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
          tabIndex={5}
        ></button>
        <div className="vertical-divider-thin" />

        {/* unissued only filter */}
        <button
          className={`display-unissued-only-button${displayUnissuedOnly ? " active" : ""}`}
          onClick={handleClicksToDisplayUnissuedOnlyButton}
          tabIndex={6}
        ></button>

        {/* unpaid only filter */}
        <button
          className={`display-unpaid-only-button${displayUnpaidOnly ? " active" : ""}`}
          onClick={handleClicksToDisplayUnpaidOnlyButton}
          tabIndex={7}
        ></button>

        {/* filtered results */}
        <div className="number-of-results">{`${invoicesAll.length}件`}</div>
      </div>
    </div>
  );
}

export default InvoiceStatusAllToolbar;
