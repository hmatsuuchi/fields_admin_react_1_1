import React from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
// CSS
import "./InvoiceListAllToolbar.scss";
// COMPONENTS
import ToolbarBackButton from "../../micro/ToolbarBackButton";

function InvoiceListAllToolbar({
  disableToolbarButtons,
  setDisableToolbarButtons,
  backButtonText,
  backButtonLink,
  displayBackButton,
  setDisplayBackButton,
  filterParameters,
  setFilterParameters,
  invoiceCount,
  setInvoicesAll,
  setContentLoading,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  // fetches invoices using the query parameters
  const fetchInvoicesAll = async () => {
    // defaults to current year and month upon initial fetch
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    let verifiedYear = filterParameters.year;
    let verifiedMonth = filterParameters.month;

    if (filterParameters.year === "" || filterParameters.month === "") {
      verifiedYear = currentYear;
      verifiedMonth = currentMonth;

      setFilterParameters({
        display_student_only_id: null,
        year: currentYear,
        month: currentMonth,
      });
    }

    try {
      await instance
        .get("api/invoices/invoices/list/all/", {
          params: {
            year: verifiedYear,
            month: verifiedMonth,
          },
        })
        .then((response) => {
          if (response) {
            setInvoicesAll(response.data.invoices);
            setDisableToolbarButtons(false);
            setContentLoading(false);
          }
        });
    } catch (e) {
      setContentLoading(false);
      console.log(e);
    }
  };

  const handleClicksToDateFilterButton = () => {
    // reset invoice array to empty array
    setInvoicesAll([]);

    // set content loading state
    setContentLoading(true);

    // disable toolbar buttons while fetching data
    setDisableToolbarButtons(true);

    // fetch data using the query parameters
    fetchInvoicesAll();
  };

  // DEBUG
  // useEffect(() => {
  //   console.log(filterParameters);
  //   console.log(filterParameters.year === "");
  //   console.log(filterParameters.month === "");
  // }, [filterParameters]);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */
  return (
    <div
      id="invoice-list-all-toolbar"
      className={disableToolbarButtons ? "disable-toolbar-buttons" : ""}
    >
      <ToolbarBackButton
        backButtonText={backButtonText}
        backButtonLink={backButtonLink}
        displayBackButton={displayBackButton}
        setDisplayBackButton={setDisplayBackButton}
      />

      <div className="toolbar-right-side-container">
        {/* year and month filter */}
        <select
          className="year-select"
          value={filterParameters.year}
          onChange={(e) => {
            setFilterParameters({
              ...filterParameters,
              year: e.target.value,
            });
          }}
          tabIndex={3}
        >
          <option value={""}>-------</option>
          <option value={2026}>2026年</option>
          <option value={2025}>2025年</option>
        </select>
        <select
          className="month-select"
          value={filterParameters.month}
          onChange={(e) => {
            setFilterParameters({
              ...filterParameters,
              month: e.target.value,
            });
          }}
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

        {/* filtered results */}
        <div className="number-of-results">{`${invoiceCount}件`}</div>
      </div>
    </div>
  );
}

export default InvoiceListAllToolbar;
